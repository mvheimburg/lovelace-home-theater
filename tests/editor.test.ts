import { it, expect, vi, afterEach } from "vitest";
import { HomeTheaterEditor } from "../src/editor";
import { fixture, config } from "./fixture";
import type { CardConfig } from "../src/types";
afterEach(() => document.body.replaceChildren());
async function mount(input: CardConfig = config(), language = "en") {
  const editor = new HomeTheaterEditor();
  editor.hass = { ...fixture(), language };
  editor.setConfig(input);
  document.body.append(editor);
  await editor.updateComplete;
  return editor;
}
const $ = <T extends Element>(editor: HomeTheaterEditor, selector: string) =>
  editor.shadowRoot!.querySelector(selector) as T;
async function select(editor: HomeTheaterEditor, selector: string, value: string) {
  const node = $<HTMLSelectElement | HTMLInputElement>(editor, selector);
  node.value = value;
  node.dispatchEvent(new Event("change", { bubbles: true }));
  await editor.updateComplete;
}
it("picks players with entity selectors and emits HA config events without mutating input", async () => {
  const original: CardConfig = { type: "custom:home-theater-card" };
  const editor = await mount(original);
  const changed = vi.fn();
  editor.addEventListener("config-changed", changed);
  const tv = $<HTMLElement & { selector: unknown }>(editor, 'ha-selector[data-field="tv"]');
  expect(tv.selector).toEqual({ entity: { domain: "media_player", integration: "webostv" } });
  tv.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "media_player.tv" } }));
  const e = changed.mock.lastCall![0];
  expect(e.bubbles && e.composed).toBe(true);
  expect(e.detail.config).toEqual({ type: "custom:home-theater-card", tv: "media_player.tv" });
  expect(original).toEqual({ type: "custom:home-theater-card" });
});
it("offers inputs from the players' own source lists", async () => {
  const editor = await mount();
  const changed = vi.fn();
  editor.addEventListener("config-changed", changed);
  const input = $<HTMLSelectElement>(editor, 'select[name="tv_input"]');
  expect(Array.from(input.options).map((o) => o.value)).toEqual(["", "HDMI 1", "HDMI 2", "Live TV", "Netflix", "NRK TV", "YouTube"]);
  expect($<HTMLSelectElement>(editor, 'select[name="tv_audio"]').value).toBe("TV Audio");
  await select(editor, 'select[name="tv_audio"]', "Game");
  expect(changed.mock.lastCall![0].detail.config.tv_audio).toBe("Game");
  await select(editor, 'select[name="tv_audio"]', "TV Audio");
  expect(changed.mock.lastCall![0].detail.config).not.toHaveProperty("tv_audio");
  await select(editor, 'select[name="tv_input"]', "");
  expect(changed.mock.lastCall![0].detail.config).not.toHaveProperty("tv_input");
});
it("keeps a new favourite as a draft until a source is chosen, then orders and removes it", async () => {
  const editor = await mount({ ...config(), sources: [{ device: "tv", source: "Netflix" }] });
  const changed = vi.fn();
  editor.addEventListener("config-changed", changed);
  $<HTMLButtonElement>(editor, '[data-action="add-source"]').click();
  await editor.updateComplete;
  expect(changed).not.toHaveBeenCalled();
  expect($(editor, '[role="alert"]').textContent).toContain("Choose a source");
  const options = Array.from($<HTMLSelectElement>(editor, 'select[name="source-1"]').options).map((o) => o.value);
  expect(options).toEqual(["", "Blu-ray", "Game", "Media Player", "TV Audio"]);
  await select(editor, 'select[name="source-1"]', "Game");
  await select(editor, 'input[name="source-name-1"]', "PlayStation");
  expect(changed.mock.lastCall![0].detail.config.sources).toEqual([
    { device: "tv", source: "Netflix" },
    { device: "receiver", source: "Game", name: "PlayStation" },
  ]);
  $<HTMLButtonElement>(editor, '[data-source="1"] [data-action="source-up"]').click();
  await editor.updateComplete;
  expect(changed.mock.lastCall![0].detail.config.sources[0].name).toBe("PlayStation");
  for (let i = 0; i < 2; i++) {
    $<HTMLButtonElement>(editor, '[data-action="remove-source"]').click();
    await editor.updateComplete;
  }
  expect(changed.mock.lastCall![0].detail.config).not.toHaveProperty("sources");
});
it("localizes the editor in Bokmål and reports invalid YAML", async () => {
  const editor = await mount(config(), "nb");
  expect(editor.shadowRoot!.textContent).toContain("Favorittkilder");
  expect($(editor, 'ha-selector[data-field="receiver"]')).toHaveProperty("label", "AV-mottaker");
  editor.setConfig({ type: "custom:home-theater-card", sources: "x" } as unknown as CardConfig);
  await editor.updateComplete;
  expect($(editor, '[role="alert"]').textContent).toContain("Kilder må være en liste");
});
