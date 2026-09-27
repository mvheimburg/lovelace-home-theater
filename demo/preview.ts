import "../dist/home-theater-card.js";
import * as mdi from "@mdi/js";
import type { HomeTheaterCard } from "../src/home-theater-card";
import type { CardConfig, HassEntity, HomeAssistant } from "../src/types";
/** Resolves "mdi:chevron-up" to mdiChevronUp from @mdi/js. */
function path(icon: string): string {
  const name = "mdi" + icon.replace("mdi:", "").split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
  return (mdi as Record<string, string>)[name] ?? mdi.mdiHelpCircleOutline;
}
customElements.define(
  "ha-icon",
  class extends HTMLElement {
    set icon(value: string) {
      this.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="${path(value)}"/></svg>`;
    }
  },
);
// Generic dummy devices: no real rooms, devices or names.
const TV_FEATURES = 256 | 2048 | 1 | 16 | 32 | 512 | 4096 | 16384 | 128;
const AVR_FEATURES = 1024 | 8 | 128 | 256 | 2048 | 4 | 65536;
const states: Record<string, HassEntity> = {};
function player(id: string, on: boolean, attributes: Record<string, unknown>) {
  states[id] = { entity_id: id, state: on ? "on" : "off", attributes };
}
const tvSources = ["HDMI 1", "HDMI 2", "Live TV", "Netflix", "NRK TV", "YouTube", "Spotify", "Prime Video"];
const avrSources = ["Blu-ray", "CBL/SAT", "Game", "Media Player", "Bluetooth", "TV Audio"];
const modes = ["MOVIE", "MUSIC", "GAME", "DIRECT", "STEREO", "MULTI CH STEREO"];
player("media_player.tv_1", true, { friendly_name: "TV", supported_features: TV_FEATURES, source_list: tvSources, source: "HDMI 1", sound_output: "external_arc" });
player("media_player.avr_1", true, { friendly_name: "Receiver", supported_features: AVR_FEATURES, source_list: avrSources, sound_mode_list: modes, source: "Media Player", sound_mode: "MOVIE", volume_level: 0.43, is_volume_muted: false });
player("media_player.tv_2", true, { friendly_name: "TV", supported_features: TV_FEATURES, source_list: tvSources, source: "NRK TV", sound_output: "external_arc" });
player("media_player.avr_2", true, { friendly_name: "Receiver", supported_features: AVR_FEATURES, source_list: avrSources, sound_mode_list: modes, source: "TV Audio", sound_mode: "STEREO", volume_level: 0.38, is_volume_muted: false });
// A room from the Home Theater integration, with placeholder artwork.
const ART = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3894f"/><stop offset="1" stop-color="#5a3f8f"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="44" cy="20" r="8" fill="#ffd98a"/><path d="M0 50 L22 30 L38 44 L48 36 L64 50 V64 H0Z" fill="#2c2350"/></svg>');
const roomSources = ["Chromecast", "PlayStation", "NRK TV", "Netflix", "YouTube"];
player("media_player.room_3", true, {
  friendly_name: "Hjemmekino", supported_features: 128 | 256 | 2048 | 1024 | 4 | 8 | 1 | 16384,
  source: "Chromecast", volume_level: 0.41, is_volume_muted: false,
  media_title: "Fjellvandring i høstfarger", media_series_title: "Naturserien", entity_picture: ART,
  tv: "media_player.tv_3", receiver: "media_player.avr_3", sources: roomSources,
  all_sources: ["Blu-ray", "Bluetooth", ...roomSources, "Live TV", "Spotify"],
  can_turn_on_tv: true, audio_problem: false, tv_sound_output: "external_arc",
});
player("media_player.tv_3", true, { friendly_name: "TV", supported_features: TV_FEATURES, source: "HDMI 1", sound_output: "external_arc" });
player("media_player.avr_3", false, { friendly_name: "Receiver", supported_features: AVR_FEATURES, sound_mode_list: modes, sound_mode: "MOVIE", source: "Media Player", volume_level: 0.41 });
player("remote.room_3", true, {});
states["scene.film_night"] = { entity_id: "scene.film_night", state: "unknown", attributes: { friendly_name: "Kinokveld", icon: "mdi:movie-open-outline" } };
states["scene.lights_up"] = { entity_id: "scene.lights_up", state: "unknown", attributes: { friendly_name: "Lys på", icon: "mdi:lightbulb-on-outline" } };
const entities = {
  "media_player.room_3": { entity_id: "media_player.room_3", device_id: "room3", platform: "home_theater" },
  "remote.room_3": { entity_id: "remote.room_3", device_id: "room3", platform: "home_theater" },
};
let language = "nb";
let failNext = false;
let delayNext = false;
let connected = true;
const cards: HomeTheaterCard[] = [];
function hass(): HomeAssistant {
  return {
    language,
    locale: { language: language === "nb" ? "nb-NO" : "en-GB" },
    connection: { connected },
    states: { ...states },
    entities,
    callService: async (domain, service, data) => {
      if (failNext) {
        failNext = false;
        throw new Error("Simulated failure");
      }
      const delay = delayNext ? 60000 : 250;
      delayNext = false;
      await new Promise((resolve) => setTimeout(resolve, 60));
      setTimeout(() => apply(domain, service, data), delay);
    },
  };
}
function apply(domain: string, service: string, data: Record<string, unknown>) {
  const id = data.entity_id as string;
  const entity = states[id];
  if (!entity) return;
  const attributes = { ...entity.attributes };
  let state = entity.state;
  if (service === "turn_on") state = "on";
  if (service === "turn_off") state = "off";
  if (service === "select_source") {
    attributes.source = data.source;
    if (id === "media_player.room_3") delete attributes.media_title;
  }
  if (service === "select_sound_mode") attributes.sound_mode = data.sound_mode;
  if (service === "select_sound_output") attributes.sound_output = data.sound_output;
  if (service === "volume_mute") attributes.is_volume_muted = data.is_volume_muted;
  if (service === "volume_up" || service === "volume_down")
    attributes.volume_level = Math.round(((attributes.volume_level as number) + (service === "volume_up" ? 0.005 : -0.005)) * 1000) / 1000;
  if ((domain === "webostv" && service === "button") || domain === "scene") return;
  states[id] = { ...entity, state, attributes };
  render();
}
function render() {
  for (const card of cards) card.hass = hass();
}
const configs: CardConfig[] = [
  {
    type: "custom:home-theater-card",
    title: "Kinorom",
    icon: "mdi:sofa-outline",
    tv: "media_player.tv_1",
    receiver: "media_player.avr_1",
    tv_input: "HDMI 1",
    appearance: "bubble",
    sources: [
      { device: "receiver", source: "Media Player", name: "Apple TV" },
      { device: "receiver", source: "Game", name: "PlayStation" },
      { device: "tv", source: "NRK TV" },
      { device: "tv", source: "Netflix" },
      { device: "tv", source: "YouTube" },
    ],
  },
  {
    type: "custom:home-theater-card",
    title: "Hjemmekino",
    icon: "mdi:theater",
    theater: "media_player.room_3",
    scenes: [{ entity: "scene.film_night" }, { entity: "scene.lights_up" }],
  },
  {
    type: "custom:home-theater-card",
    title: "Loftsstue",
    tv: "media_player.tv_2",
    receiver: "media_player.avr_2",
    tv_input: "HDMI 1",
  },
];
const container = document.querySelector("#cards")!;
for (const config of configs) {
  const card = document.createElement("home-theater-card") as HomeTheaterCard;
  card.setConfig(config);
  container.append(card);
  cards.push(card);
}
render();
const on = (id: string, run: () => void) => document.querySelector(id)!.addEventListener("click", () => { run(); render(); });
on("#theme", () => document.body.classList.toggle("dark"));
on("#language", () => { language = language === "nb" ? "en" : "nb"; });
on("#offline", () => { connected = !connected; });
on("#failure", () => { failNext = true; });
on("#pending", () => { delayNext = true; });
on("#appearance", () => {
  for (const [index, card] of cards.entries()) {
    configs[index] = { ...configs[index], appearance: configs[index].appearance === "bubble" ? "default" : "bubble" };
    card.setConfig(configs[index]);
  }
});
on("#arc", () => {
  const tv = states["media_player.tv_2"];
  states["media_player.tv_2"] = { ...tv, attributes: { ...tv.attributes, sound_output: tv.attributes.sound_output === "tv_speaker" ? "external_arc" : "tv_speaker" } };
});
on("#off", () => {
  for (const id of ["media_player.tv_2", "media_player.avr_2"]) states[id] = { ...states[id], state: "off" };
});
