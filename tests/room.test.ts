import { it, expect, vi, afterEach } from "vitest";
import { HomeTheaterCard } from "../src/home-theater-card";
import { HomeTheaterEditor } from "../src/editor";
import { room, roomFixture } from "./fixture";
import type { HomeAssistant } from "../src/types";
afterEach(() => document.body.replaceChildren());
const CONFIG = { type: "custom:home-theater-card" as const, title: "Stue", theater: "media_player.stue_theater" };
async function mount(hass: HomeAssistant = roomFixture()) {
  const card = new HomeTheaterCard();
  card.setConfig(CONFIG);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  return card;
}
const $ = <T extends Element = HTMLButtonElement>(card: HTMLElement, selector: string) =>
  card.shadowRoot!.querySelector(selector) as T;
async function settle(card: HomeTheaterCard) {
  for (let i = 0; i < 4; i++) {
    await card.updateComplete;
    await Promise.resolve();
  }
}
async function click(card: HomeTheaterCard, selector: string) {
  $(card, selector).click();
  await settle(card);
}
async function update(card: HomeTheaterCard, id: string, value: ReturnType<typeof room>) {
  card.hass = { ...card.hass!, states: { ...card.hass!.states, [id]: value } };
  await settle(card);
}
const chip = (source: string) => `.sources [data-action="source"][data-source="${source}"]`;
it("shows the room's source, what is playing and its volume", async () => {
  const card = await mount();
  expect($(card, ".titles .status").textContent).toBe("Chromecast · -35 dB");
  expect($(card, chip("Chromecast")).getAttribute("aria-pressed")).toBe("true");
  expect($(card, chip("Chromecast")).querySelector("ha-icon")).toHaveProperty("icon", "mdi:cast");
  expect($(card, "[data-now-playing] strong").textContent).toBe("Episode 4");
  expect($(card, "[data-now-playing] .status").textContent).toBe("A Series");
  expect($<HTMLImageElement>(card, "[data-now-playing] img").getAttribute("src")).toContain("media_player.cast");
});
it("keeps sources while the room is off and sends power to the room", async () => {
  const card = await mount(roomFixture("off"));
  expect($(card, ".titles .status").textContent).toBe("Off");
  expect($(card, chip("NRK TV")).disabled).toBe(false);
  expect($(card, '[data-action="all-sources"]')).not.toBeNull();
  expect($(card, "[data-now-playing]")).toBeNull();
  expect($(card, '[data-action="dpad-up"]')).toBeNull();
  await click(card, '[data-action="power"]');
  expect(card.hass!.callService).toHaveBeenCalledExactlyOnceWith("media_player", "turn_on", { entity_id: "media_player.stue_theater" });
  expect($(card, '[data-action="power"]').disabled).toBe(true);
  await update(card, "media_player.stue_theater", room("on"));
  expect($(card, '[data-action="power"]').disabled).toBe(false);
});
it("lets the integration sequence a source change and waits for it", async () => {
  const card = await mount();
  await click(card, chip("NRK TV"));
  expect(card.hass!.callService).toHaveBeenCalledExactlyOnceWith("media_player", "select_source", { entity_id: "media_player.stue_theater", source: "NRK TV" });
  expect($(card, chip("Netflix")).disabled).toBe(true);
  await update(card, "media_player.stue_theater", room("on", { source: "NRK TV", media_title: undefined }));
  expect($(card, chip("NRK TV")).getAttribute("aria-pressed")).toBe("true");
  expect($(card, chip("Netflix")).disabled).toBe(false);
  await click(card, '[data-action="all-sources"]');
  expect(Array.from(card.shadowRoot!.querySelectorAll(`dialog ${'[data-action="source"]'}`)).map((b) => b.getAttribute("data-source")))
    .toEqual(["Blu-ray", "Chromecast", "PlayStation", "NRK TV", "Netflix", "YouTube"]);
});
it("sends arrow keys to the room's remote and volume to the room", async () => {
  const card = await mount();
  await click(card, '[data-action="dpad-up"]');
  await click(card, '[data-action="dpad-ok"]');
  await click(card, '[data-action="dpad-back"]');
  expect(card.hass!.callService).toHaveBeenCalledWith("remote", "send_command", { entity_id: "remote.stue_remote", command: "up" });
  expect(card.hass!.callService).toHaveBeenCalledWith("remote", "send_command", { entity_id: "remote.stue_remote", command: "ok" });
  expect(card.hass!.callService).toHaveBeenCalledWith("remote", "send_command", { entity_id: "remote.stue_remote", command: "back" });
  await click(card, '[data-action="volume-up"]');
  expect(card.hass!.callService).toHaveBeenCalledWith("media_player", "volume_up", { entity_id: "media_player.stue_theater" });
  card.hass = { ...card.hass!, entities: {} };
  await settle(card);
  expect($(card, '[data-action="dpad-up"]')).toBeNull();
});
it("fixes TV sound through the integration and links to its settings", async () => {
  const hass = roomFixture();
  hass.states["media_player.stue_theater"] = room("playing", { audio_problem: true, tv_sound_output: "tv_speaker" });
  const card = await mount(hass);
  await click(card, '.warning [data-action="use-receiver"]');
  expect(card.hass!.callService).toHaveBeenCalledWith("home_theater", "use_receiver", { entity_id: "media_player.stue_theater" });
  await click(card, '[data-action="configure"]');
  expect($(card, "dialog [data-output]").textContent).toBe("TV speakers");
  await click(card, '[data-action="sound-mode"][data-mode="MUSIC"]');
  expect(card.hass!.callService).toHaveBeenCalledWith("media_player", "select_sound_mode", { entity_id: "media_player.avr", sound_mode: "MUSIC" });
  expect($(card, "[data-hint=\"tv-power\"]")).toBeNull();
  const navigated = vi.fn();
  window.addEventListener("location-changed", navigated);
  const start = location.pathname;
  await click(card, '[data-action="integration"]');
  expect(location.pathname).toBe("/config/integrations/integration/home_theater");
  expect(navigated).toHaveBeenCalled();
  history.replaceState(null, "", start);
  window.removeEventListener("location-changed", navigated);
});
it("explains Wake-on-LAN in the integration and shows Bokmål", async () => {
  const hass = { ...roomFixture(), language: "nb" };
  hass.states["media_player.stue_theater"] = room("playing", { can_turn_on_tv: false });
  const card = await mount(hass);
  await click(card, '[data-action="configure"]');
  expect($(card, '[data-hint="tv-power"]').textContent).toContain("MAC-adresse");
  expect($(card, '[data-action="integration"]').textContent).toContain("Innstillinger for hjemmekino");
});
it("marks the room unavailable and disables its actions", async () => {
  const hass = roomFixture();
  hass.states["media_player.stue_theater"] = { ...room("unavailable"), attributes: { sources: ["Chromecast"] } };
  const card = await mount(hass);
  expect($(card, ".titles .status").textContent).toBe("Unavailable");
  expect($(card, '[data-action="power"]').disabled).toBe(true);
  expect($(card, chip("Chromecast")).disabled).toBe(true);
  expect($(card, '[data-action="configure"]').disabled).toBe(false);
});
it("hides direct device settings in the editor once a room is chosen", async () => {
  const editor = new HomeTheaterEditor();
  editor.hass = roomFixture();
  editor.setConfig({ type: "custom:home-theater-card" });
  document.body.append(editor);
  await editor.updateComplete;
  const changed = vi.fn();
  editor.addEventListener("config-changed", changed);
  const picker = $<HTMLElement & { selector: unknown }>(editor, 'ha-selector[data-field="theater"]');
  expect(picker.selector).toEqual({ entity: { domain: "media_player", integration: "home_theater" } });
  expect($(editor, 'ha-selector[data-field="tv"]')).not.toBeNull();
  picker.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "media_player.stue_theater" } }));
  await editor.updateComplete;
  expect(changed.mock.lastCall![0].detail.config).toEqual({ type: "custom:home-theater-card", theater: "media_player.stue_theater" });
  expect($(editor, 'ha-selector[data-field="tv"]')).toBeNull();
  expect($(editor, '[data-action="add-source"]')).toBeNull();
  expect($(editor, 'input[name="title"]')).not.toBeNull();
});
