import { LitElement, html, nothing, type PropertyValues } from "lit";
import {
  normalizeConfig,
  ConfigValidationError,
  type ConfigErrorCode,
  TYPE,
} from "./config";
import { t, formatDb, outputLabel, type TextKey } from "./localize";
import {
  Feature,
  RECEIVER_OUTPUT,
  activeSource,
  allSources,
  arcProblem,
  available,
  currentSoundMode,
  entityOf,
  favourites,
  isOn,
  muted,
  roomOn,
  sameSource,
  soundModes,
  soundOutput,
  supports,
  tvAudio,
  volumeDb,
} from "./model";
import { Requests, accepted, type Confirm } from "./requests";
import { sourceIcon } from "./icons";
import { styles } from "./styles";
import type { CardConfig, HomeAssistant, SourceConfig } from "./types";
type Step = () => Promise<unknown>;
interface Waiter {
  test: () => boolean;
  resolve: () => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}
/** A source chip, whichever way the card is bound. */
interface Chip {
  key: string;
  label: string;
  icon: string;
  device?: string;
  source: string;
  active: boolean;
  enabled: boolean;
  select: () => void;
}
/** Keys: the room remote's command, then the webOS button for direct mode. */
const DPAD = [
  ["up", "UP", "mdi:chevron-up"],
  ["left", "LEFT", "mdi:chevron-left"],
  ["ok", "ENTER", ""],
  ["right", "RIGHT", "mdi:chevron-right"],
  ["down", "DOWN", "mdi:chevron-down"],
] as const;
const INTEGRATION_PAGE = "/config/integrations/integration/home_theater";
function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((s): s is string => typeof s === "string") : [];
}
function text(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}
export class HomeTheaterCard extends LitElement {
  static styles = styles;
  static properties = { hass: { attribute: false } };
  hass?: HomeAssistant;
  private config: CardConfig = { type: TYPE };
  private configError?: ConfigErrorCode;
  private dialogKind?: "sources" | "configure";
  private trigger?: HTMLElement;
  private waiters = new Set<Waiter>();
  private requests = new Requests(() => this.requestUpdate(), 60000);
  setConfig(input: unknown): void {
    this.close();
    this.configError = undefined;
    try {
      this.config = normalizeConfig(input);
    } catch (error) {
      if (!(error instanceof ConfigValidationError)) throw error;
      this.config = { type: TYPE };
      this.configError = error.code;
    }
    this.cancelWaiters();
    this.requests.reset();
    this.requestUpdate();
  }
  /** A new card shows the first Home Theater room; the editor can pick another. */
  static getStubConfig(hass?: HomeAssistant): CardConfig {
    const room = Object.values(hass?.entities ?? {})
      .filter((e) => e.platform === "home_theater" && e.entity_id.startsWith("media_player."))
      .map((e) => e.entity_id)
      .sort()[0];
    return room ? { type: TYPE, theater: room } : { type: TYPE };
  }
  static async getConfigElement(): Promise<HTMLElement> {
    await import("./editor");
    return document.createElement("home-theater-card-editor");
  }
  getCardSize(): number {
    return this.on ? 7 : 3;
  }
  private t(key: TextKey): string {
    return t(this.hass, key);
  }
  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) {
      this.requests.reconcile(this.hass.states);
      for (const waiter of this.waiters)
        if (waiter.test()) {
          clearTimeout(waiter.timer);
          this.waiters.delete(waiter);
          waiter.resolve();
        }
    }
    this.setAttribute("appearance", this.config.appearance ?? "default");
    if (!this.config.color_scheme || this.config.color_scheme === "home-assistant")
      this.removeAttribute("data-color-scheme");
    else this.setAttribute("data-color-scheme", this.config.color_scheme);
  }
  protected updated(): void {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog");
    if (this.dialogKind && dialog && !dialog.open) dialog.showModal();
  }
  disconnectedCallback(): void {
    this.close();
    this.cancelWaiters();
    this.requests.reset();
    super.disconnectedCallback();
  }
  /** Resolves once HA reports the condition, for steps that need a device awake. */
  private waitFor(test: () => boolean, ms = 25000): Promise<void> {
    if (test()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const waiter: Waiter = {
        test,
        resolve,
        reject,
        timer: setTimeout(() => {
          this.waiters.delete(waiter);
          reject(new Error(this.t("timeout")));
        }, ms),
      };
      this.waiters.add(waiter);
    });
  }
  private cancelWaiters(): void {
    for (const waiter of this.waiters) {
      clearTimeout(waiter.timer);
      waiter.reject(new Error("cancelled"));
    }
    this.waiters.clear();
  }
  // ----- which entities the card works with

  /** The integration's room media player, when the card is bound to one. */
  private get room(): string | undefined {
    return this.config.theater;
  }
  private entity(id?: string) {
    return entityOf(this.hass, id);
  }
  private roomAttr(key: string): unknown {
    return this.entity(this.room)?.attributes[key];
  }
  private get tvId(): string | undefined {
    return this.room ? text(this.roomAttr("tv")) : this.config.tv;
  }
  private get receiverId(): string | undefined {
    return this.room ? text(this.roomAttr("receiver")) : this.config.receiver;
  }
  /** The room's remote, found beside its media player on the same device. */
  private get remoteId(): string | undefined {
    const entries = this.hass?.entities;
    const device = this.room ? entries?.[this.room]?.device_id : undefined;
    if (!device) return undefined;
    return Object.values(entries!).find((e) => e.device_id === device &&
      e.platform === "home_theater" && e.entity_id.startsWith("remote."))?.entity_id;
  }
  /** The room's device name, as the integration entry named it. */
  private get roomName(): string | undefined {
    const device = this.room ? this.hass?.entities?.[this.room]?.device_id : undefined;
    const entry = device ? this.hass?.devices?.[device] : undefined;
    return text(entry?.name_by_user) ?? text(entry?.name);
  }
  private get volumeId(): string | undefined {
    return this.room || this.config.receiver || this.config.tv;
  }
  private get configured(): boolean {
    return !!(this.room || this.config.tv || this.config.receiver);
  }
  private get on(): boolean {
    return this.room ? isOn(this.entity(this.room)) : roomOn(this.config, this.hass);
  }
  private get anyAvailable(): boolean {
    return this.room
      ? available(this.hass, this.room)
      : available(this.hass, this.config.tv) || available(this.hass, this.config.receiver);
  }
  private canTurnOnTv(): boolean {
    return this.room
      ? this.roomAttr("can_turn_on_tv") === true
      : supports(this.entity(this.config.tv), Feature.TURN_ON);
  }
  private audioProblem(): boolean {
    return this.room ? this.roomAttr("audio_problem") === true : arcProblem(this.config, this.hass);
  }
  // ----- requests

  private call(domain: string, service: string, data: Record<string, unknown>): Step {
    return () => this.hass!.callService(domain, service, data);
  }
  private send(key: string, confirm: Confirm, steps: Step[]): void {
    if (!this.hass || this.busy(key)) return;
    this.requests.start(key, confirm, steps);
  }
  /** Power and source changes touch both devices, so they block each other. */
  private busy(key: string): boolean {
    return ["power", "source"].includes(key)
      ? this.requests.pending("power") || this.requests.pending("source")
      : this.requests.pending(key);
  }
  // ----- power

  private powerEnabled(): boolean {
    if (this.busy("power") || !this.anyAvailable) return false;
    if (this.room || this.on) return true;
    return available(this.hass, this.config.receiver) ||
      (available(this.hass, this.config.tv) && this.canTurnOnTv());
  }
  private togglePower(): void {
    const on = this.on;
    const room = this.room;
    if (room) {
      this.send("power", (s) => isOn(s[room]) !== on,
        [this.call("media_player", on ? "turn_off" : "turn_on", { entity_id: room })]);
      return;
    }
    const { tv, receiver } = this.config;
    const steps: Step[] = [];
    if (on) {
      for (const id of [tv, receiver])
        if (id && isOn(this.entity(id))) steps.push(this.call("media_player", "turn_off", { entity_id: id }));
      this.send("power", (s) => !isOn(tv ? s[tv] : undefined) && !isOn(receiver ? s[receiver] : undefined), steps);
      return;
    }
    if (receiver && available(this.hass, receiver)) steps.push(this.call("media_player", "turn_on", { entity_id: receiver }));
    if (tv && this.canTurnOnTv()) steps.push(this.call("media_player", "turn_on", { entity_id: tv }));
    const target = receiver && available(this.hass, receiver) ? receiver : tv!;
    this.send("power", (s) => isOn(s[target]), steps);
  }
  /** One device on or off. Turning one on goes through the room, which wakes only what is off. */
  private deviceEnabled(id: string | undefined, tv: boolean): boolean {
    if (!id || this.busy("power") || !available(this.hass, id)) return false;
    if (isOn(this.entity(id))) return supports(this.entity(id), Feature.TURN_OFF);
    if (this.room) return available(this.hass, this.room) && (!tv || this.canTurnOnTv());
    return supports(this.entity(id), Feature.TURN_ON);
  }
  private toggleDevice(id: string | undefined, tv: boolean): void {
    if (!id || !this.deviceEnabled(id, tv)) return;
    const on = isOn(this.entity(id));
    const target = !on && this.room ? this.room : id;
    this.send("power", (s) => isOn(s[id]) !== on,
      [this.call("media_player", on ? "turn_off" : "turn_on", { entity_id: target })]);
  }
  // ----- sources

  private chips(all: boolean): Chip[] {
    const room = this.room;
    if (room) {
      const entity = this.entity(room);
      const labels = strings(all ? this.roomAttr("all_sources") : this.roomAttr("sources"));
      const list = labels.length || all ? labels : strings(entity?.attributes.source_list);
      const current = this.on ? text(entity?.attributes.source) : undefined;
      const enabled = available(this.hass, room) && !this.busy("source");
      return list.map((label) => ({
        key: label, label, source: label,
        icon: sourceIcon({ device: "tv", source: label }),
        active: label === current, enabled,
        select: () => this.send("source", (s) => s[room]?.attributes.source === label,
          [this.call("media_player", "select_source", { entity_id: room, source: label })]),
      }));
    }
    const active = this.on ? activeSource(this.config, this.hass) : undefined;
    const list = all
      ? allSources(this.config, this.hass).map((s) => this.config.sources?.find((f) => sameSource(s, f)) ?? s)
      : favourites(this.config, this.hass);
    return list.map((s) => ({
      key: `${s.device}:${s.source}`, label: s.name || s.source, source: s.source, device: s.device,
      icon: s.icon || sourceIcon(s), active: sameSource(active, s),
      enabled: this.sourceEnabled(s), select: () => this.selectSource(s),
    }));
  }
  private sourceEnabled(source: SourceConfig): boolean {
    if (this.busy("source")) return false;
    const { tv, receiver } = this.config;
    if (source.device === "receiver") return available(this.hass, receiver);
    if (!available(this.hass, tv)) return false;
    // An off TV needs Wake-on-LAN or the receiver's HDMI control to wake it.
    return isOn(this.entity(tv)) || this.canTurnOnTv() || available(this.hass, receiver);
  }
  private selectSource(source: SourceConfig): void {
    if (!this.hass || !this.sourceEnabled(source)) return;
    const { tv, receiver, tv_input } = this.config;
    const audio = tvAudio(this.config);
    const steps: Step[] = [];
    const wake = (id: string) => {
      if (isOn(this.entity(id))) return;
      steps.push(this.call("media_player", "turn_on", { entity_id: id }));
      steps.push(() => this.waitFor(() => isOn(this.entity(id))));
    };
    if (source.device === "receiver") {
      wake(receiver!);
      steps.push(this.call("media_player", "select_source", { entity_id: receiver, source: source.source }));
      const tvOn = isOn(this.entity(tv));
      if (tv && tv_input && tvOn)
        steps.push(this.call("media_player", "select_source", { entity_id: tv, source: tv_input }));
      else if (tv && !tvOn && this.canTurnOnTv())
        steps.push(this.call("media_player", "turn_on", { entity_id: tv }));
      this.send("source", (s) =>
        s[receiver!]?.attributes.source === source.source &&
        (!tv || !tv_input || !tvOn || s[tv]?.attributes.source === tv_input), steps);
      return;
    }
    if (receiver && available(this.hass, receiver)) {
      wake(receiver);
      if (audio) steps.push(this.call("media_player", "select_source", { entity_id: receiver, source: audio }));
    }
    if (!isOn(this.entity(tv))) {
      if (this.canTurnOnTv()) steps.push(this.call("media_player", "turn_on", { entity_id: tv }));
      steps.push(() => this.waitFor(() => isOn(this.entity(tv))));
    }
    steps.push(this.call("media_player", "select_source", { entity_id: tv, source: source.source }));
    const withReceiver = !!receiver && available(this.hass, receiver) && !!audio;
    this.send("source", (s) =>
      s[tv!]?.attributes.source === source.source &&
      (!withReceiver || s[receiver!]?.attributes.source === audio), steps);
  }
  // ----- remote keys, volume, sound

  private dpadTarget(): string | undefined {
    if (this.room) return this.on && available(this.hass, this.remoteId) ? this.remoteId : undefined;
    return isOn(this.entity(this.config.tv)) ? this.config.tv : undefined;
  }
  private press(command: string, button: string): void {
    const target = this.dpadTarget();
    if (!target || !available(this.hass, target)) return;
    this.send("dpad", accepted, [this.room
      ? this.call("remote", "send_command", { entity_id: target, command })
      : this.call("webostv", "button", { entity_id: target, button })]);
  }
  private volumeEnabled(): boolean {
    const id = this.volumeId;
    return available(this.hass, id) && isOn(this.entity(id)) && supports(this.entity(id), Feature.VOLUME_STEP);
  }
  private volume(direction: "up" | "down"): void {
    const id = this.volumeId;
    if (!id || !this.volumeEnabled()) return;
    this.send("volume", accepted, [this.call("media_player", `volume_${direction}`, { entity_id: id })]);
  }
  private toggleMute(): void {
    const id = this.volumeId;
    if (!id || !this.volumeEnabled()) return;
    const target = !muted(this.entity(id));
    this.send("mute", (s) => muted(s[id]) === target,
      [this.call("media_player", "volume_mute", { entity_id: id, is_volume_muted: target })]);
  }
  private selectSoundMode(mode: string): void {
    const id = this.receiverId;
    if (!id || !available(this.hass, id)) return;
    this.send("sound_mode", (s) => s[id]?.attributes.sound_mode === mode,
      [this.call("media_player", "select_sound_mode", { entity_id: id, sound_mode: mode })]);
  }
  private useReceiver(): void {
    const room = this.room;
    const tv = this.tvId;
    if (!tv || !available(this.hass, tv)) return;
    this.send("output", (s) => s[tv]?.attributes.sound_output === RECEIVER_OUTPUT,
      [room
        ? this.call("home_theater", "use_receiver", { entity_id: room })
        : this.call("webostv", "select_sound_output", { entity_id: tv, sound_output: RECEIVER_OUTPUT })]);
  }
  // ----- dialogs and navigation

  private open(kind: "sources" | "configure", event: Event): void {
    this.trigger = event.currentTarget as HTMLElement;
    this.dialogKind = kind;
    this.requestUpdate();
  }
  private close(): void {
    this.renderRoot?.querySelector<HTMLDialogElement>("dialog")?.close();
    this.dialogKind = undefined;
    if (this.trigger?.isConnected) this.trigger.focus();
    this.trigger = undefined;
    this.requestUpdate();
  }
  private more(id: string | undefined): void {
    if (!id || !this.entity(id)) return;
    this.close();
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: id },
      bubbles: true,
      composed: true,
    }));
  }
  private openIntegration(): void {
    this.close();
    history.pushState(null, "", INTEGRATION_PAGE);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }
  // ----- rendering

  private status(): string {
    if (!this.anyAvailable) return this.t("unavailable");
    if (this.requests.pending("power") || this.requests.pending("source")) return this.t("pending");
    if (!this.on) return this.t("off");
    const active = this.chips(false).find((c) => c.active) ?? this.chips(true).find((c) => c.active);
    const parts: string[] = [];
    if (this.room) parts.push(text(this.roomAttr("source")) ?? this.t("on"));
    else parts.push(active?.label ?? activeSource(this.config, this.hass)?.source ?? this.t("on"));
    const player = this.entity(this.volumeId);
    if (isOn(player)) {
      const db = this.receiverId ? volumeDb(player) : undefined;
      if (muted(player)) parts.push(this.t("muted"));
      else if (db !== undefined) parts.push(formatDb(this.hass, db));
    }
    return parts.join(" · ");
  }
  private error() {
    if (this.configError) return html`<p class="error" role="alert">${this.t(this.configError)}</p>`;
    return this.requests.error
      ? html`<p class="error" role="alert">
          ${this.t(this.requests.error)}${this.requests.errorDetail ? html` — ${this.requests.errorDetail}` : nothing}
        </p>`
      : nothing;
  }
  private arcWarning() {
    if (!this.audioProblem()) return nothing;
    return html`<div class="warning" role="status">
      <ha-icon .icon=${"mdi:speaker-off"}></ha-icon>
      <span>${this.t("arcProblem")}</span>
      <button class="action" data-action="use-receiver" ?disabled=${this.busy("output")}
        @click=${() => this.useReceiver()}>${this.t("useReceiver")}</button>
    </div>`;
  }
  private devices() {
    const tv = this.tvId;
    const receiver = this.receiverId;
    if (!tv || !receiver) return nothing;
    const pill = (id: string, label: TextKey, icon: string, isTv: boolean) => {
      const on = isOn(this.entity(id));
      const state = available(this.hass, id) ? (on ? "on" : "off") : "unavailable";
      const status = this.t(state === "unavailable" ? "unavailable" : state);
      // Worth a nudge: the other device is on and this one is not.
      const missing = !on && state !== "unavailable" && this.on;
      return html`<button class="device-pill" data-action=${`device-${label}`} data-state=${state}
        aria-pressed=${String(on)} ?data-missing=${missing}
        aria-label=${`${this.t(on ? "turnOff" : "turnOn")}: ${this.t(label)} (${status})`}
        title=${`${this.t(on ? "turnOff" : "turnOn")}: ${this.t(label)}`}
        ?disabled=${!this.deviceEnabled(id, isTv)} @click=${() => this.toggleDevice(id, isTv)}>
        <ha-icon .icon=${icon}></ha-icon><span>${this.t(label)}</span>
        <span class="dot" aria-hidden="true"></span><span class="state">${status}</span>
      </button>`;
    };
    return html`<div class="devices" role="group" aria-label=${this.t("devices")}>
      ${pill(tv, "tv", "mdi:television", true)}${pill(receiver, "receiver", "mdi:amplifier", false)}
    </div>`;
  }
  private nowPlaying() {
    if (!this.room || !this.on) return nothing;
    const attributes = this.entity(this.room)?.attributes ?? {};
    const title = text(attributes.media_title);
    if (!title) return nothing;
    const episode = [text(attributes.media_series_title), text(attributes.media_artist), text(attributes.app_name)]
      .find((value) => value);
    const picture = text(attributes.entity_picture);
    return html`<div class="now-playing" data-now-playing>
      ${picture ? html`<img src=${picture} alt="" />` : html`<ha-icon .icon=${"mdi:play-circle-outline"}></ha-icon>`}
      <div class="titles"><strong>${title}</strong>${episode ? html`<span class="status">${episode}</span>` : nothing}</div>
    </div>`;
  }
  private chip(chip: Chip) {
    return html`<button class="chip" data-action="source" data-device=${chip.device ?? "room"}
      data-source=${chip.source} aria-pressed=${String(chip.active)}
      aria-label=${chip.active ? `${this.t("playing")}: ${chip.label}` : `${this.t("switchTo")} ${chip.label}`}
      title=${chip.label} ?disabled=${!chip.enabled}
      @click=${() => chip.select()}>
      <ha-icon .icon=${chip.icon}></ha-icon>
      <span>${chip.label}</span>
    </button>`;
  }
  private sources() {
    const list = this.chips(false);
    const more = this.chips(true).some((c) => !list.some((f) => f.key === c.key));
    if (!list.length && !more) return nothing;
    return html`<div class="sources" role="group" aria-label=${this.t("sources")}>
      ${list.map((c) => this.chip(c))}
      ${more ? html`<button class="chip more" data-action="all-sources" title=${this.t("allSources")}
        @click=${(e: Event) => this.open("sources", e)}>
        <ha-icon .icon=${"mdi:dots-horizontal"}></ha-icon><span>${this.t("allSources")}</span>
      </button>` : nothing}
    </div>`;
  }
  private dpad() {
    const target = this.dpadTarget();
    if (!target) return nothing;
    const disabled = !available(this.hass, target);
    return html`<div class="navigation" role="group" aria-label=${this.t("navigation")}>
      <div class="dpad">
        ${DPAD.map(([key, button, icon]) => html`<button class=${`pad ${key}`} data-action=${`dpad-${key}`}
          aria-label=${this.t(key)} title=${this.t(key)} ?disabled=${disabled}
          @click=${() => this.press(key, button)}>${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : this.t("ok")}</button>`)}
      </div>
      <div class="nav-keys">
        <button class="round" data-action="dpad-back" aria-label=${this.t("back")} title=${this.t("back")}
          ?disabled=${disabled} @click=${() => this.press("back", "BACK")}><ha-icon .icon=${"mdi:arrow-u-left-top"}></ha-icon></button>
        <button class="round" data-action="dpad-home" aria-label=${this.t("home")} title=${this.t("home")}
          ?disabled=${disabled} @click=${() => this.press("home", "HOME")}><ha-icon .icon=${"mdi:home-outline"}></ha-icon></button>
      </div>
    </div>`;
  }
  private volumeControls() {
    const player = this.entity(this.volumeId);
    if (!isOn(player) || !supports(player, Feature.VOLUME_STEP)) return nothing;
    const enabled = this.volumeEnabled();
    const db = this.receiverId ? volumeDb(player) : undefined;
    const isMuted = muted(player);
    return html`<div class="volume" role="group" aria-label=${this.t("volume")}>
      <button class="round" data-action="volume-up" aria-label=${this.t("volumeUp")} title=${this.t("volumeUp")}
        ?disabled=${!enabled} @click=${() => this.volume("up")}><ha-icon .icon=${"mdi:plus"}></ha-icon></button>
      <output aria-live="polite">${isMuted ? this.t("muted") : db !== undefined ? formatDb(this.hass, db) : this.t("volume")}</output>
      <button class="round" data-action="volume-down" aria-label=${this.t("volumeDown")} title=${this.t("volumeDown")}
        ?disabled=${!enabled} @click=${() => this.volume("down")}><ha-icon .icon=${"mdi:minus"}></ha-icon></button>
      ${supports(player, Feature.VOLUME_MUTE) ? html`<button class="round mute" data-action="mute"
        aria-pressed=${String(isMuted)} aria-label=${this.t(isMuted ? "unmute" : "mute")} title=${this.t(isMuted ? "unmute" : "mute")}
        ?disabled=${!enabled || this.busy("mute")} @click=${() => this.toggleMute()}>
        <ha-icon .icon=${isMuted ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon></button>` : nothing}
    </div>`;
  }
  private sourcesDialog() {
    const all = this.chips(true);
    if (this.room) return html`<div class="sources">${all.map((c) => this.chip(c))}</div>`;
    const group = (device: SourceConfig["device"], label: TextKey) => {
      const list = all.filter((c) => c.device === device);
      return list.length ? html`<h3>${this.t(label)}</h3>
        <div class="sources">${list.map((c) => this.chip(c))}</div>` : nothing;
    };
    return html`${group("receiver", "receiverInputs")}${group("tv", "tvSources")}`;
  }
  private configureDialog() {
    const tv = this.tvId;
    const receiver = this.receiverId;
    const receiverEntity = this.entity(receiver);
    const modes = soundModes(receiverEntity);
    const mode = currentSoundMode(receiverEntity);
    const output = this.room ? text(this.roomAttr("tv_sound_output")) : soundOutput(this.entity(tv));
    const device = (id: string | undefined, label: TextKey) => id ? html`<div class="device">
      <span><strong>${this.t(label)}</strong><span class="status">${available(this.hass, id)
        ? this.t(isOn(this.entity(id)) ? "on" : "off") : this.t("unavailable")}</span></span>
      <button class="action" data-action=${`more-${label}`} ?disabled=${!this.entity(id)}
        @click=${() => this.more(id)}>${this.t("details")}</button>
    </div>` : nothing;
    return html`
      ${receiver && isOn(receiverEntity) && supports(receiverEntity, Feature.SELECT_SOUND_MODE) && modes.length ? html`
        <h3>${this.t("soundMode")}</h3>
        <div class="sources">${modes.map((m) => html`<button class="chip" data-action="sound-mode" data-mode=${m}
          aria-pressed=${String(m === mode)} ?disabled=${this.busy("sound_mode") || !available(this.hass, receiver)}
          @click=${() => this.selectSoundMode(m)}><span>${m}</span></button>`)}</div>` : nothing}
      ${tv && receiver ? html`<h3>${this.t("tvSound")}</h3>
        <p class="status" data-output=${output ?? ""}>${output ? outputLabel(this.hass, output) : this.t(isOn(this.entity(tv)) ? "unavailable" : "off")}</p>
        ${this.arcWarning()}
        <p class="hint">${this.t("arcHint")}</p>` : nothing}
      ${tv && this.entity(tv) && !this.canTurnOnTv() ? html`<p class="hint" data-hint="tv-power">${this.t(this.room ? "tvPowerHintTheater" : "tvPowerHint")}</p>` : nothing}
      ${this.configured ? html`<h3>${this.t("devices")}</h3>${device(this.room, "room")}${device(tv, "tv")}${device(receiver, "receiver")}` : nothing}
      ${this.room ? html`<div class="controls-row"><button class="action primary" data-action="integration"
        @click=${() => this.openIntegration()}><ha-icon .icon=${"mdi:cog-outline"}></ha-icon>${this.t("integrationSettings")}</button></div>` : nothing}
      <p class="hint">${this.t(this.room ? "configureHelpTheater" : "configureHelp")}</p>`;
  }
  private dialog() {
    if (!this.dialogKind) return nothing;
    const title = this.t(this.dialogKind === "sources" ? "allSources" : "configure");
    return html`<dialog aria-labelledby="dialog-title"
      @cancel=${(e: Event) => { e.preventDefault(); this.close(); }}>
      <header>
        <div class="heading"><h2 id="dialog-title">${title}</h2></div>
        <button class="round" data-action="close" aria-label=${this.t("close")} title=${this.t("close")}
          @click=${() => this.close()}><ha-icon .icon=${"mdi:close"}></ha-icon></button>
      </header>
      ${this.error()}
      ${this.dialogKind === "sources" ? this.sourcesDialog() : this.configureDialog()}
    </dialog>`;
  }
  protected render() {
    const on = this.on;
    const configured = this.configured;
    return html`<ha-card data-state=${on ? "on" : "off"}>
      <header>
        <div class="heading">
          <ha-icon .icon=${this.config.icon || "mdi:television"}></ha-icon>
          <div class="titles">
            <h2>${this.config.title || this.roomName || this.t("title")}</h2>
            <span class="status" aria-live="polite">${configured ? this.status() : nothing}</span>
          </div>
        </div>
        <div class="header-actions">
          ${configured ? html`<button class="round power" data-action="power" aria-pressed=${String(on)}
            aria-label=${this.t(on ? "turnOff" : "turnOn")} title=${this.t(on ? "turnOff" : "turnOn")}
            ?disabled=${!this.powerEnabled()} @click=${() => this.togglePower()}>
            <ha-icon .icon=${"mdi:power"}></ha-icon></button>` : nothing}
          <button class="round" data-action="configure" aria-label=${this.t("configure")} title=${this.t("configure")}
            @click=${(e: Event) => this.open("configure", e)}><ha-icon .icon=${"mdi:cog-outline"}></ha-icon></button>
        </div>
      </header>
      ${this.error()}
      ${!configured ? html`<p class="hint">${this.t("setup")}</p>` : html`
        ${this.devices()}
        ${this.nowPlaying()}
        ${this.arcWarning()}
        ${this.sources()}
        ${on ? html`<div class="controls">${this.dpad()}${this.volumeControls()}</div>` : nothing}`}
      ${this.dialog()}
    </ha-card>`;
  }
}
if (!customElements.get("home-theater-card"))
  customElements.define("home-theater-card", HomeTheaterCard);
const registry = window as unknown as {
  customCards?: Array<Record<string, unknown>>;
};
registry.customCards ??= [];
if (!registry.customCards.some((c) => c.type === "home-theater-card"))
  registry.customCards.push({
    type: "home-theater-card",
    name: "Home Theater Card",
    description: "One power button, sources, arrows and volume for a TV and AV receiver.",
    preview: true,
  });
