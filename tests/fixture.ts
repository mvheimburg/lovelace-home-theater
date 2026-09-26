import { vi } from "vitest";
import type { HomeAssistant, CardConfig, HassEntity } from "../src/types";
export const state = (
  id: string,
  value: string,
  attributes: Record<string, unknown> = {},
): HassEntity => ({ entity_id: id, state: value, attributes });
/** TURN_OFF | SELECT_SOURCE | PLAY etc. without TURN_ON, as webOS reports without a Wake-on-LAN automation. */
export const TV_FEATURES = 256 | 2048 | 1 | 16 | 32 | 512 | 4096 | 16384;
export const RECEIVER_FEATURES = 1024 | 8 | 128 | 256 | 2048 | 4 | 65536;
export const tv = (value = "on", attributes: Record<string, unknown> = {}) =>
  state("media_player.tv", value, {
    friendly_name: "LG TV",
    supported_features: TV_FEATURES,
    source_list: ["HDMI 1", "HDMI 2", "Live TV", "Netflix", "NRK TV", "YouTube"],
    source: value === "on" ? "HDMI 1" : undefined,
    sound_output: value === "on" ? "external_arc" : undefined,
    ...attributes,
  });
export const receiver = (value = "on", attributes: Record<string, unknown> = {}) =>
  state("media_player.avr", value, {
    friendly_name: "Denon AVR",
    supported_features: RECEIVER_FEATURES,
    source_list: ["Blu-ray", "Game", "Media Player", "TV Audio"],
    sound_mode_list: ["MOVIE", "MUSIC", "STEREO"],
    ...(value === "on" ? { source: "Media Player", volume_level: 0.45, is_volume_muted: false, sound_mode: "MOVIE" } : {}),
    ...attributes,
  });
export function fixture(tvState = "on", receiverState = "on"): HomeAssistant {
  return {
    language: "en",
    connection: { connected: true },
    states: {
      "media_player.tv": tv(tvState),
      "media_player.avr": receiver(receiverState),
    },
    callService: vi.fn(async () => undefined),
  };
}
export const config = (): CardConfig => ({
  type: "custom:home-theater-card",
  title: "Living room",
  tv: "media_player.tv",
  receiver: "media_player.avr",
  tv_input: "HDMI 1",
});
