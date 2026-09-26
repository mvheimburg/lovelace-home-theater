import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import {
  normalizeConfig,
  ConfigValidationError,
  type ConfigErrorCode,
  TYPE,
} from "./config";
import { t, type TextKey } from "./localize";
import { DEFAULT_TV_AUDIO, entityOf, sourceList } from "./model";
import {
  colorSchemes,
  type CardConfig,
  type HomeAssistant,
  type SourceConfig,
} from "./types";
/** Edits only Lovelace configuration. HA's dashboard owns Save and Cancel. */
export class HomeTheaterEditor extends LitElement {
  static properties = { hass: { attribute: false } };
  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #202b36);
      font: inherit;
    }
    * {
      box-sizing: border-box;
    }
    p {
      line-height: 1.5;
      color: var(--secondary-text-color, #626976);
    }
    small {
      color: var(--secondary-text-color, #626976);
      line-height: 1.4;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
    }
    input,
    select,
    button {
      font: inherit;
      color: inherit;
      min-height: 44px;
      border-radius: 10px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      padding: 8px 10px;
    }
    button {
      cursor: pointer;
      background: var(--secondary-background-color, #f1f3f6);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    input:focus-visible,
    select:focus-visible,
    button:focus-visible {
      outline: 3px solid var(--primary-color, #507b9b);
      outline-offset: 2px;
    }
    .fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
      gap: 12px;
      margin: 12px 0;
    }
    fieldset {
      min-width: 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 14px;
      padding: 12px;
      margin: 16px 0;
    }
    legend {
      padding: 0 6px;
      font-weight: 600;
    }
    .tools {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0;
    }
    .source-row {
      border-top: 1px solid var(--divider-color, #ccc);
      padding: 12px 0;
    }
    .error {
      color: var(--error-color, #bd2635);
    }
    ha-selector {
      display: block;
      width: 100%;
      margin: 8px 0;
    }
    .icon-button {
      min-width: 44px;
    }
    ha-icon {
      --mdc-icon-size: 20px;
    }
    .add {
      width: 100%;
      margin-top: 8px;
    }
  `;
  hass?: HomeAssistant;
  private config: CardConfig = { type: TYPE };
  private configError?: ConfigErrorCode;
  setConfig(config: CardConfig): void {
    this.configError = undefined;
    try {
      this.config = normalizeConfig(config);
    } catch (error) {
      if (!(error instanceof ConfigValidationError)) throw error;
      this.configError = error.code;
    }
    this.requestUpdate();
  }
  private t(key: TextKey) {
    return t(this.hass, key);
  }
  private change(update: (next: CardConfig) => void): void {
    const next = structuredClone(this.config);
    update(next);
    for (const key of ["title", "icon", "tv", "receiver", "tv_input", "tv_audio"])
      if (next[key] === "" || next[key] === undefined) delete next[key];
    this.config = next;
    try {
      const valid = normalizeConfig(next);
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: valid },
          bubbles: true,
          composed: true,
        }),
      );
    } catch {
      // An empty source row remains a local draft until the user picks a source.
    }
    this.requestUpdate();
  }
  private text(name: string, label: TextKey, value: string | undefined, change: (value: string) => void): TemplateResult {
    return html`<label>${this.t(label)}<input name=${name} .value=${live(value ?? "")}
      @change=${(e: Event) => change((e.target as HTMLInputElement).value)} /></label>`;
  }
  /** A choice from the player's live source list; the saved value stays listed even when the player is off. */
  private choice(name: string, label: TextKey, options: string[], value: string | undefined,
    change: (value: string) => void, empty?: TextKey, help?: TextKey): TemplateResult {
    const list = value && !options.includes(value) ? [value, ...options] : options;
    if (!list.length && !empty) return this.text(name, label, value, change);
    return html`<label>${this.t(label)}
      <select name=${name} .value=${live(value ?? "")}
        @change=${(e: Event) => change((e.target as HTMLSelectElement).value)}>
        ${empty ? html`<option value="" ?selected=${!value}>${this.t(empty)}</option>` : nothing}
        ${!empty && !value ? html`<option value="" selected disabled>${this.t("source")}</option>` : nothing}
        ${list.map((option) => html`<option value=${option} ?selected=${option === value}>${option}</option>`)}
      </select>
      ${help ? html`<small>${this.t(help)}</small>` : nothing}
    </label>`;
  }
  private player(key: "tv" | "receiver", label: TextKey): TemplateResult {
    return html`<ha-selector data-field=${key} .hass=${this.hass}
      .selector=${{ entity: key === "tv" ? { domain: "media_player", integration: "webostv" } : { domain: "media_player" } }}
      .value=${this.config[key] || undefined} .label=${this.t(label)}
      @value-changed=${(e: CustomEvent<{ value?: string }>) => {
        e.stopPropagation();
        this.change((c) => { c[key] = e.detail.value ?? ""; });
      }}></ha-selector>`;
  }
  private move<T>(list: T[], index: number, offset: number): void {
    const to = index + offset;
    if (to < 0 || to >= list.length) return;
    [list[index], list[to]] = [list[to], list[index]];
  }
  private tool(action: string, label: TextKey, icon: string, disabled: boolean, run: () => void, context: string) {
    return html`<button class="icon-button" data-action=${action} ?disabled=${disabled}
      title=${this.t(label)} aria-label=${`${this.t(label)}: ${context}`} @click=${run}>
      <ha-icon .icon=${icon}></ha-icon>
    </button>`;
  }
  private sourceRow(source: SourceConfig, index: number, count: number) {
    const options = sourceList(entityOf(this.hass, source.device === "tv" ? this.config.tv : this.config.receiver));
    const name = source.name || source.source || this.t("source");
    const edit = (update: (s: SourceConfig) => void) => this.change((c) => update(c.sources![index]));
    return html`<div class="source-row" data-source=${index}>
      <div class="fields">
        <label>${this.t("device")}
          <select name=${`source-device-${index}`} .value=${live(source.device)}
            @change=${(e: Event) => edit((s) => {
              s.device = (e.target as HTMLSelectElement).value as SourceConfig["device"];
              s.source = "";
            })}>
            ${(["receiver", "tv"] as const).map((d) => html`<option value=${d} ?selected=${d === source.device}>${this.t(d)}</option>`)}
          </select>
        </label>
        ${this.choice(`source-${index}`, "source", options, source.source, (value) => edit((s) => { s.source = value; }))}
        ${this.text(`source-name-${index}`, "name", source.name, (value) => edit((s) => { if (value) s.name = value; else delete s.name; }))}
        ${this.text(`source-icon-${index}`, "icon", source.icon, (value) => edit((s) => { if (value) s.icon = value; else delete s.icon; }))}
      </div>
      <div class="tools">
        ${this.tool("source-up", "moveUp", "mdi:arrow-up", index === 0, () => this.change((c) => this.move(c.sources!, index, -1)), name)}
        ${this.tool("source-down", "moveDown", "mdi:arrow-down", index === count - 1, () => this.change((c) => this.move(c.sources!, index, 1)), name)}
        ${this.tool("remove-source", "remove", "mdi:delete-outline", false, () => this.change((c) => {
          c.sources!.splice(index, 1);
          if (!c.sources!.length) delete c.sources;
        }), name)}
      </div>
    </div>`;
  }
  protected render() {
    if (this.configError)
      return html`<p class="error" role="alert">${this.t(this.configError)} ${this.t("invalidConfig")}</p>`;
    const sources = this.config.sources ?? [];
    const tvSources = sourceList(entityOf(this.hass, this.config.tv));
    const receiverSources = sourceList(entityOf(this.hass, this.config.receiver));
    return html`
      <p>${this.t("editorHelp")}</p>
      ${this.player("tv", "tvEntity")}
      ${this.player("receiver", "receiverEntity")}
      ${this.config.tv && this.config.receiver ? html`<div class="fields">
        ${this.choice("tv_input", "tvInput", tvSources, this.config.tv_input,
          (value) => this.change((c) => { c.tv_input = value; }), "none", "tvInputHelp")}
        ${this.choice("tv_audio", "tvAudio", receiverSources, this.config.tv_audio ?? DEFAULT_TV_AUDIO,
          (value) => this.change((c) => { if (value === DEFAULT_TV_AUDIO) delete c.tv_audio; else c.tv_audio = value; }), undefined, "tvAudioHelp")}
      </div>` : nothing}
      <div class="fields">
        ${this.text("title", "cardTitle", this.config.title, (value) => this.change((c) => { c.title = value; }))}
        ${this.text("icon", "icon", this.config.icon, (value) => this.change((c) => { c.icon = value; }))}
        <label>${this.t("appearance")}
          <select name="appearance" .value=${live(this.config.appearance ?? "default")}
            @change=${(e: Event) => this.change((c) => {
              c.appearance = (e.target as HTMLSelectElement).value as CardConfig["appearance"];
            })}>
            ${(["default", "bubble"] as const).map((v) => html`<option value=${v} ?selected=${v === (this.config.appearance ?? "default")}>${this.t(v)}</option>`)}
          </select>
        </label>
        <label>${this.t("colorScheme")}
          <select name="color_scheme" .value=${live(this.config.color_scheme ?? "home-assistant")}
            @change=${(e: Event) => this.change((c) => {
              c.color_scheme = (e.target as HTMLSelectElement).value as CardConfig["color_scheme"];
            })}>
            ${colorSchemes.map((v) => html`<option value=${v} ?selected=${v === (this.config.color_scheme ?? "home-assistant")}>${this.t(v)}</option>`)}
          </select>
        </label>
      </div>
      <fieldset>
        <legend>${this.t("favourites")}</legend>
        <small>${this.t("favouritesHelp")}</small>
        ${sources.some((s) => !s.source) ? html`<p class="error" role="alert">${this.t("incomplete")}</p>` : nothing}
        ${sources.map((s, i) => this.sourceRow(s, i, sources.length))}
        <button class="add" data-action="add-source"
          @click=${() => this.change((c) => {
            c.sources = [...(c.sources ?? []), { device: c.receiver ? "receiver" : "tv", source: "" }];
          })}>${this.t("addSource")}</button>
      </fieldset>
    `;
  }
}
if (!customElements.get("home-theater-card-editor"))
  customElements.define("home-theater-card-editor", HomeTheaterEditor);
