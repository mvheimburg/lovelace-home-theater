import { it, expect, vi, afterEach } from "vitest";
import { HomeTheaterCard } from "../src/home-theater-card";
import { HomeTheaterEditor } from "../src/editor";
import { normalizeConfig } from "../src/config";
import { roomFixture, state } from "./fixture";
import type { CardConfig, HomeAssistant } from "../src/types";
afterEach(() => document.body.replaceChildren());
const CONFIG: CardConfig = {
  type: "custom:home-theater-card",
  theater: "media_player.stue_theater",
  scenes: [
    { entity: "scene.kinokveld" },
    { entity: "script.dim_lights", name: "Dempet", icon: "mdi:lightbulb-night" },
  ],
};
function hass(): HomeAssistant {
  const h = roomFixture();
  // A scene that has never been activated reports "unknown".
  h.states["scene.kinokveld"] = state("scene.kinokveld", "unknown", { friendly_name: "Kinokveld", icon: "mdi:movie-open" });
  h.states["script.dim_lights"] = state("script.dim_lights", "off", { friendly_name: "Dim lights" });
  return h;
}
async function mount(config: CardConfig = CONFIG, h: HomeAssistant = hass()) {
  const card = new HomeTheaterCard();
  card.setConfig(config);
  card.hass = h;
  document.body.append(card);
  await card.updateComplete;
  return card;
}
const $ = <T extends Element = HTMLButtonElement>(el: HTMLElement, selector: string) =>
  el.shadowRoot!.querySelector(selector) as T;
async function settle(card: HomeTheaterCard) {
  for (let i = 0; i < 4; i++) {
    await card.updateComplete;
    await Promise.resolve();
  }
}
it("shows scene buttons only when some are configured", async () => {
  const card = await mount({ ...CONFIG, scenes: undefined });
  expect($(card, ".scenes")).toBeNull();
  const withScenes = await mount();
  const buttons = withScenes.shadowRoot!.querySelectorAll('[data-action="scene"]');
  expect(Array.from(buttons).map((b) => b.textContent!.trim())).toEqual(["Kinokveld", "Dempet"]);
  expect(buttons[0].querySelector("ha-icon")).toHaveProperty("icon", "mdi:movie-open");
  expect(buttons[1].querySelector("ha-icon")).toHaveProperty("icon", "mdi:lightbulb-night");
  expect(buttons[0].getAttribute("aria-label")).toBe("Activate: Kinokveld");
});
it("activates scenes and scripts, even a scene never used before", async () => {
  const card = await mount();
  expect($(card, '[data-entity="scene.kinokveld"]').disabled).toBe(false);
  $(card, '[data-entity="scene.kinokveld"]').click();
  await settle(card);
  $(card, '[data-entity="script.dim_lights"]').click();
  await settle(card);
  expect(card.hass!.callService).toHaveBeenCalledWith("scene", "turn_on", { entity_id: "scene.kinokveld" });
  expect(card.hass!.callService).toHaveBeenCalledWith("script", "turn_on", { entity_id: "script.dim_lights" });
});
it("reports a failed scene and disables missing ones, in Bokmål", async () => {
  const h = { ...hass(), language: "nb" };
  h.callService = vi.fn(async () => { throw new Error("scene failed"); });
  delete h.states["script.dim_lights"];
  const card = await mount(CONFIG, h);
  expect($(card, '[data-entity="script.dim_lights"]').disabled).toBe(true);
  expect($(card, '[data-entity="scene.kinokveld"]').getAttribute("aria-label")).toBe("Aktiver: Kinokveld");
  $(card, '[data-entity="scene.kinokveld"]').click();
  await vi.waitFor(() => expect($(card, '[role="alert"]')?.textContent).toContain("scene failed"));
  expect($(card, '[data-entity="scene.kinokveld"]').disabled).toBe(false);
});
it("validates scene entities", () => {
  expect(() => normalizeConfig({ type: "custom:home-theater-card", scenes: {} })).toThrow("invalidScenes");
  expect(() => normalizeConfig({ type: "custom:home-theater-card", scenes: [{ entity: "light.x" }] })).toThrow("invalidScene");
});
it("edits scenes in the card editor, keeping empty rows as drafts", async () => {
  const editor = new HomeTheaterEditor();
  editor.hass = hass();
  editor.setConfig({ type: "custom:home-theater-card", theater: "media_player.stue_theater" });
  document.body.append(editor);
  await editor.updateComplete;
  const changed = vi.fn();
  editor.addEventListener("config-changed", changed);
  $(editor, '[data-action="add-scene"]').click();
  await editor.updateComplete;
  expect(changed).not.toHaveBeenCalled();
  expect($(editor, '[role="alert"]').textContent).toContain("Choose a scene");
  const picker = $<HTMLElement & { selector: unknown }>(editor, '[data-scene="0"] ha-selector');
  expect(picker.selector).toEqual({ entity: { domain: ["scene", "script"] } });
  picker.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "scene.kinokveld" } }));
  await editor.updateComplete;
  expect(changed.mock.lastCall![0].detail.config.scenes).toEqual([{ entity: "scene.kinokveld" }]);
  $(editor, '[data-action="remove-scene"]').click();
  await editor.updateComplete;
  expect(changed.mock.lastCall![0].detail.config).not.toHaveProperty("scenes");
});
