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
  volumePlayer,
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
const DPAD = [
  ["up", "UP", "mdi:chevron-up"],
  ["left", "LEFT", "mdi:chevron-left"],
  ["ok", "ENTER", ""],
  ["right", "RIGHT", "mdi:chevron-right"],
  ["down", "DOWN", "mdi:chevron-down"],
] as const;
export class HomeTheaterCard extends LitElement {
  static styles = styles;
  static properties = { hass: { attribute: false } };
  hass?: HomeAssistant;
  private config: CardConfig = { type: TYPE };
  private configError?: ConfigErrorCode;
  private dialogKind?: "sources" | "configure";
  private trigger?: HTMLElement;
  private waiters = new Set<Waiter>();
  private requests = new Requests(() => this.requestUpdate(), 30000);
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
  static getStubConfig(): CardConfig {
    return { type: TYPE };
  }
  static async getConfigElement(): Promise<HTMLElement> {
    await import("./editor");
    return document.createElement("home-theater-card-editor");
  }
  getCardSize(): number {
    return roomOn(this.config, this.hass) ? 7 : 3;
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
  private entity(id?: string) {
    return entityOf(this.hass, id);
  }
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
  private sourceName(source: SourceConfig): string {
    return source.name || source.source;
  }
  private canTurnOnTv(): boolean {
    return supports(this.entity(this.config.tv), Feature.TURN_ON);
  }
  private powerEnabled(): boolean {
    const { tv, receiver } = this.config;
    if (this.busy("power") || (!available(this.hass, tv) && !available(this.hass, receiver))) return false;
    if (roomOn(this.config, this.hass)) return true;
    return available(this.hass, receiver) || (available(this.hass, tv) && this.canTurnOnTv());
  }
  private togglePower(): void {
    const { tv, receiver } = this.config;
    const on = roomOn(this.config, this.hass);
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
  private press(button: string): void {
    const tv = this.config.tv;
    if (!tv || !available(this.hass, tv)) return;
    this.send("dpad", accepted, [this.call("webostv", "button", { entity_id: tv, button })]);
  }
  private volume(direction: "up" | "down"): void {
    const id = volumePlayer(this.config);
    if (!id || !this.volumeEnabled()) return;
    this.send("volume", accepted, [this.call("media_player", `volume_${direction}`, { entity_id: id })]);
  }
  private toggleMute(): void {
    const id = volumePlayer(this.config);
    if (!id || !this.volumeEnabled()) return;
    const target = !muted(this.entity(id));
    this.send("mute", (s) => muted(s[id]) === target,
      [this.call("media_player", "volume_mute", { entity_id: id, is_volume_muted: target })]);
  }
  private volumeEnabled(): boolean {
    const id = volumePlayer(this.config);
    return available(this.hass, id) && isOn(this.entity(id)) && supports(this.entity(id), Feature.VOLUME_STEP);
  }
  private selectSoundMode(mode: string): void {
    const id = this.config.receiver;
    if (!id || !available(this.hass, id)) return;
    this.send("sound_mode", (s) => s[id]?.attributes.sound_mode === mode,
      [this.call("media_player", "select_sound_mode", { entity_id: id, sound_mode: mode })]);
  }
  private useReceiver(): void {
    const tv = this.config.tv;
    if (!tv || !available(this.hass, tv)) return;
    this.send("output", (s) => s[tv]?.attributes.sound_output === RECEIVER_OUTPUT,
      [this.call("webostv", "select_sound_output", { entity_id: tv, sound_output: RECEIVER_OUTPUT })]);
  }
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
  private status(): string {
    const { tv, receiver } = this.config;
    if (!available(this.hass, tv) && !available(this.hass, receiver)) return this.t("unavailable");
    if (this.requests.pending("power") || this.requests.pending("source")) return this.t("pending");
    if (!roomOn(this.config, this.hass)) return this.t("off");
    const active = activeSource(this.config, this.hass);
    const known = active && favourites(this.config, this.hass).find((s) => sameSource(active, s));
    const parts = [known ? this.sourceName(known) : active?.source ?? this.t("on")];
    const player = this.entity(volumePlayer(this.config));
    if (isOn(player)) {
      const db = volumeDb(player);
      if (muted(player)) parts.push(this.t("muted"));
      else if (this.config.receiver && db !== undefined) parts.push(formatDb(this.hass, db));
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
    if (!arcProblem(this.config, this.hass)) return nothing;
    return html`<div class="warning" role="status">
      <ha-icon .icon=${"mdi:speaker-off"}></ha-icon>
      <span>${this.t("arcProblem")}</span>
      <button class="action" data-action="use-receiver" ?disabled=${this.busy("output")}
        @click=${() => this.useReceiver()}>${this.t("useReceiver")}</button>
    </div>`;
  }
  private chip(source: SourceConfig, active: boolean) {
    const name = this.sourceName(source);
    return html`<button class="chip" data-action="source" data-device=${source.device}
      data-source=${source.source} aria-pressed=${String(active)}
      aria-label=${active ? `${this.t("playing")}: ${name}` : `${this.t("switchTo")} ${name}`}
      title=${name} ?disabled=${!this.sourceEnabled(source)}
      @click=${() => this.selectSource(source)}>
      <ha-icon .icon=${source.icon || sourceIcon(source)}></ha-icon>
      <span>${name}</span>
    </button>`;
  }
  private sources() {
    const list = favourites(this.config, this.hass);
    const active = roomOn(this.config, this.hass) ? activeSource(this.config, this.hass) : undefined;
    const more = allSources(this.config, this.hass).length > list.length;
    if (!list.length && !more) return nothing;
    return html`<div class="sources" role="group" aria-label=${this.t("sources")}>
      ${list.map((s) => this.chip(s, sameSource(active, s)))}
      ${more ? html`<button class="chip more" data-action="all-sources" title=${this.t("allSources")}
        @click=${(e: Event) => this.open("sources", e)}>
        <ha-icon .icon=${"mdi:dots-horizontal"}></ha-icon><span>${this.t("allSources")}</span>
      </button>` : nothing}
    </div>`;
  }
  private dpad() {
    const tv = this.config.tv;
    if (!tv || !isOn(this.entity(tv))) return nothing;
    const disabled = !available(this.hass, tv);
    return html`<div class="navigation" role="group" aria-label=${this.t("navigation")}>
      <div class="dpad">
        ${DPAD.map(([key, button, icon]) => html`<button class=${`pad ${key}`} data-action=${`dpad-${key}`}
          aria-label=${this.t(key)} title=${this.t(key)} ?disabled=${disabled}
          @click=${() => this.press(button)}>${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : this.t("ok")}</button>`)}
      </div>
      <div class="nav-keys">
        <button class="round" data-action="dpad-back" aria-label=${this.t("back")} title=${this.t("back")}
          ?disabled=${disabled} @click=${() => this.press("BACK")}><ha-icon .icon=${"mdi:arrow-u-left-top"}></ha-icon></button>
        <button class="round" data-action="dpad-home" aria-label=${this.t("home")} title=${this.t("home")}
          ?disabled=${disabled} @click=${() => this.press("HOME")}><ha-icon .icon=${"mdi:home-outline"}></ha-icon></button>
      </div>
    </div>`;
  }
  private volumeControls() {
    const id = volumePlayer(this.config);
    const player = this.entity(id);
    if (!isOn(player) || !supports(player, Feature.VOLUME_STEP)) return nothing;
    const enabled = this.volumeEnabled();
    const db = this.config.receiver ? volumeDb(player) : undefined;
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
    const active = roomOn(this.config, this.hass) ? activeSource(this.config, this.hass) : undefined;
    const all = allSources(this.config, this.hass);
    const group = (device: SourceConfig["device"], label: TextKey) => {
      const list = all.filter((s) => s.device === device);
      return list.length ? html`<h3>${this.t(label)}</h3>
        <div class="sources">${list.map((s) => {
          const named = this.config.sources?.find((f) => sameSource(s, f)) ?? s;
          return this.chip(named, sameSource(active, s));
        })}</div>` : nothing;
    };
    return html`${group("receiver", "receiverInputs")}${group("tv", "tvSources")}`;
  }
  private configureDialog() {
    const { tv, receiver } = this.config;
    const receiverEntity = this.entity(receiver);
    const modes = soundModes(receiverEntity);
    const mode = currentSoundMode(receiverEntity);
    const output = soundOutput(this.entity(tv));
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
      ${tv && this.entity(tv) && !this.canTurnOnTv() ? html`<p class="hint" data-hint="tv-power">${this.t("tvPowerHint")}</p>` : nothing}
      ${tv || receiver ? html`<h3>${this.t("devices")}</h3>${device(tv, "tv")}${device(receiver, "receiver")}` : nothing}
      <p class="hint">${this.t("configureHelp")}</p>`;
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
    const { tv, receiver } = this.config;
    const on = roomOn(this.config, this.hass);
    const configured = !!(tv || receiver);
    return html`<ha-card data-state=${on ? "on" : "off"}>
      <header>
        <div class="heading">
          <ha-icon .icon=${this.config.icon || "mdi:television"}></ha-icon>
          <div class="titles">
            <h2>${this.config.title || this.t("title")}</h2>
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
