import { it, expect, vi, afterEach } from "vitest";
import { HomeTheaterCard } from "../src/home-theater-card";
import { config, fixture, receiver, state, tv } from "./fixture";
import type { CardConfig, HomeAssistant } from "../src/types";
afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});
async function mount(hass: HomeAssistant = fixture(), input: CardConfig = config()) {
  const card = new HomeTheaterCard();
  card.setConfig(input);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  return card;
}
const $ = <T extends Element = HTMLButtonElement>(card: HomeTheaterCard, selector: string) =>
  card.shadowRoot!.querySelector<T & Element>(selector) as T;
async function settle(card: HomeTheaterCard) {
  for (let i = 0; i < 4; i++) {
    await card.updateComplete;
    await Promise.resolve();
  }
  await card.updateComplete;
}
async function click(card: HomeTheaterCard, selector: string) {
  $(card, selector).click();
  await settle(card);
}
async function update(card: HomeTheaterCard, states: Record<string, ReturnType<typeof state>>) {
  card.hass = { ...card.hass!, states: { ...card.hass!.states, ...states } };
  await settle(card);
}
const chip = (source: string) => `.sources [data-action="source"][data-source="${source}"]`;
it("shows the room, the active receiver input and the receiver volume in dB", async () => {
  const card = await mount();
  expect($(card, "h2").textContent).toBe("Living room");
  expect($(card, ".titles .status").textContent).toBe("Media Player · -35 dB");
  expect($(card, '[data-action="power"]').getAttribute("aria-pressed")).toBe("true");
  expect($(card, chip("Media Player")).getAttribute("aria-pressed")).toBe("true");
  expect($(card, chip("Live TV")).getAttribute("aria-pressed")).toBe("false");
  expect($(card, '[data-action="dpad-up"]')).not.toBeNull();
  expect($(card, ".volume output").textContent).toBe("-35 dB");
});
it("turns both devices off together and waits for HA to confirm", async () => {
  const card = await mount();
  await click(card, '[data-action="power"]');
  expect(card.hass!.callService).toHaveBeenNthCalledWith(1, "media_player", "turn_off", { entity_id: "media_player.tv" });
  expect(card.hass!.callService).toHaveBeenNthCalledWith(2, "media_player", "turn_off", { entity_id: "media_player.avr" });
  expect($(card, '[data-action="power"]').disabled).toBe(true);
  expect($(card, chip("Game")).disabled).toBe(true);
  await update(card, { "media_player.tv": tv("off") });
  expect($(card, '[data-action="power"]').disabled).toBe(true);
  await update(card, { "media_player.avr": receiver("off") });
  expect($(card, '[data-action="power"]').disabled).toBe(false);
  expect($(card, ".titles .status").textContent).toBe("Off");
  expect($(card, ".controls")).toBeNull();
});
it("turns on only what HA can turn on, and explains how to wake the TV", async () => {
  const card = await mount(fixture("off", "off"));
  await click(card, '[data-action="power"]');
  expect(card.hass!.callService).toHaveBeenCalledExactlyOnceWith("media_player", "turn_on", { entity_id: "media_player.avr" });
  await update(card, { "media_player.avr": receiver() });
  await click(card, '[data-action="configure"]');
  expect($(card, '[data-hint="tv-power"]').textContent).toContain("Wake-on-LAN");
  await click(card, '[data-action="close"]');
  await update(card, { "media_player.tv": tv("off", { supported_features: 256 | 2048 | 128 }), "media_player.avr": receiver("off") });
  (card.hass!.callService as ReturnType<typeof vi.fn>).mockClear();
  await click(card, '[data-action="power"]');
  expect(card.hass!.callService).toHaveBeenNthCalledWith(2, "media_player", "turn_on", { entity_id: "media_player.tv" });
});
it("plays a TV app through the receiver's TV Audio input", async () => {
  const card = await mount();
  await click(card, '[data-action="all-sources"]');
  await click(card, `dialog ${chip("Netflix")}`);
  expect(card.hass!.callService).toHaveBeenNthCalledWith(1, "media_player", "select_source", { entity_id: "media_player.avr", source: "TV Audio" });
  expect(card.hass!.callService).toHaveBeenNthCalledWith(2, "media_player", "select_source", { entity_id: "media_player.tv", source: "Netflix" });
  expect($(card, `dialog ${chip("Netflix")}`).disabled).toBe(true);
  await update(card, {
    "media_player.avr": receiver("on", { source: "TV Audio" }),
    "media_player.tv": tv("on", { source: "Netflix" }),
  });
  expect($(card, `dialog ${chip("Netflix")}`).getAttribute("aria-pressed")).toBe("true");
  expect($(card, ".titles .status").textContent).toBe("Netflix · -35 dB");
});
it("switches the receiver and puts the TV on the receiver's HDMI input", async () => {
  const hass = fixture();
  hass.states["media_player.tv"] = tv("on", { source: "YouTube" });
  const card = await mount(hass);
  await click(card, chip("Game"));
  expect(card.hass!.callService).toHaveBeenNthCalledWith(1, "media_player", "select_source", { entity_id: "media_player.avr", source: "Game" });
  expect(card.hass!.callService).toHaveBeenNthCalledWith(2, "media_player", "select_source", { entity_id: "media_player.tv", source: "HDMI 1" });
});
it("wakes the room before starting a TV app", async () => {
  const card = await mount(fixture("off", "off"));
  await click(card, chip("Live TV"));
  expect(card.hass!.callService).toHaveBeenNthCalledWith(1, "media_player", "turn_on", { entity_id: "media_player.avr" });
  await update(card, { "media_player.avr": receiver() });
  expect(card.hass!.callService).toHaveBeenNthCalledWith(2, "media_player", "select_source", { entity_id: "media_player.avr", source: "TV Audio" });
  expect(card.hass!.callService).toHaveBeenCalledTimes(2);
  await update(card, { "media_player.tv": tv() });
  expect(card.hass!.callService).toHaveBeenNthCalledWith(3, "media_player", "select_source", { entity_id: "media_player.tv", source: "Live TV" });
});
it("sends arrows to the TV and hides them while the TV is off", async () => {
  const card = await mount();
  await click(card, '[data-action="dpad-left"]');
  await click(card, '[data-action="dpad-ok"]');
  await click(card, '[data-action="dpad-back"]');
  expect(card.hass!.callService).toHaveBeenCalledWith("webostv", "button", { entity_id: "media_player.tv", button: "LEFT" });
  expect(card.hass!.callService).toHaveBeenCalledWith("webostv", "button", { entity_id: "media_player.tv", button: "ENTER" });
  expect(card.hass!.callService).toHaveBeenCalledWith("webostv", "button", { entity_id: "media_player.tv", button: "BACK" });
  await update(card, { "media_player.tv": tv("off") });
  expect($(card, '[data-action="dpad-up"]')).toBeNull();
  expect($(card, '[data-action="volume-up"]')).not.toBeNull();
});
it("steps and mutes the receiver volume, and restores controls after a failure", async () => {
  const card = await mount();
  await click(card, '[data-action="volume-up"]');
  expect(card.hass!.callService).toHaveBeenCalledWith("media_player", "volume_up", { entity_id: "media_player.avr" });
  card.hass!.callService = vi.fn(async () => { throw new Error("receiver busy"); });
  await click(card, '[data-action="mute"]');
  expect(card.hass!.callService).toHaveBeenCalledWith("media_player", "volume_mute", { entity_id: "media_player.avr", is_volume_muted: true });
  await vi.waitFor(() => expect($(card, '[role="alert"]')?.textContent).toContain("receiver busy"));
  expect($(card, '[data-action="mute"]').disabled).toBe(false);
  expect($(card, '[data-action="mute"]').getAttribute("aria-pressed")).toBe("false");
});
it("flags TV sound on the TV speakers and sends it back to the receiver", async () => {
  const hass = fixture();
  hass.states["media_player.tv"] = tv("on", { sound_output: "tv_speaker" });
  const card = await mount(hass);
  expect($(card, ".warning").textContent).toContain("own speakers");
  await click(card, '.warning [data-action="use-receiver"]');
  expect(card.hass!.callService).toHaveBeenCalledWith("webostv", "select_sound_output", { entity_id: "media_player.tv", sound_output: "external_arc" });
  await update(card, { "media_player.tv": tv() });
  expect($(card, ".warning")).toBeNull();
});
it("selects sound modes and opens device details from Configure", async () => {
  const card = await mount();
  const more = vi.fn();
  card.addEventListener("hass-more-info", more);
  await click(card, '[data-action="configure"]');
  expect($(card, 'dialog [data-output]').textContent).toBe("Receiver (HDMI ARC)");
  await click(card, '[data-action="sound-mode"][data-mode="STEREO"]');
  expect(card.hass!.callService).toHaveBeenCalledWith("media_player", "select_sound_mode", { entity_id: "media_player.avr", sound_mode: "STEREO" });
  await click(card, '[data-action="more-receiver"]');
  expect(more.mock.lastCall![0].detail).toEqual({ entityId: "media_player.avr" });
});
it("renders Bokmål, follows language changes and keeps stored source names", async () => {
  const hass = { ...fixture(), language: "nb-NO", locale: { language: "nb-NO" } };
  const card = await mount(hass, { ...config(), title: undefined, sources: [{ device: "receiver", source: "Media Player", name: "Apple TV" }] });
  expect($(card, "h2").textContent).toBe("TV");
  expect($(card, ".titles .status").textContent).toBe("Apple TV · −35 dB");
  expect($(card, '[data-action="power"]').getAttribute("aria-label")).toBe("Slå av");
  expect($(card, '[data-action="all-sources"]').textContent).toContain("Alle kilder");
  card.hass = { ...card.hass!, language: "en", locale: { language: "en-GB" } };
  await settle(card);
  expect($(card, '[data-action="power"]').getAttribute("aria-label")).toBe("Turn off");
});
it("disables actions when unavailable or disconnected, keeping Configure", async () => {
  const hass = fixture();
  hass.states["media_player.tv"] = state("media_player.tv", "unavailable");
  hass.states["media_player.avr"] = state("media_player.avr", "unavailable");
  const card = await mount(hass);
  expect($(card, ".titles .status").textContent).toBe("Unavailable");
  expect($(card, '[data-action="power"]').disabled).toBe(true);
  await update(card, { "media_player.tv": tv(), "media_player.avr": receiver() });
  card.hass = { ...card.hass!, connection: { connected: false } };
  await settle(card);
  expect($(card, '[data-action="power"]').disabled).toBe(true);
  expect($(card, chip("Game")).disabled).toBe(true);
  expect($(card, '[data-action="dpad-up"]').disabled).toBe(true);
  expect($(card, '[data-action="configure"]').disabled).toBe(false);
});
it("reports configuration errors in the card and prompts for setup", async () => {
  const card = await mount(fixture(), { type: "custom:home-theater-card", tv: "light.wrong" } as CardConfig);
  expect($(card, '[role="alert"]').textContent).toContain("media_player");
  card.setConfig({ type: "custom:home-theater-card" });
  await settle(card);
  expect($(card, ".hint").textContent).toContain("visual card editor");
  expect($(card, '[data-action="power"]')).toBeNull();
});
