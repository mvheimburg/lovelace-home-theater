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
/** A room from the Home Theater integration, as its media player reports it. */
export const room = (value = "playing", attributes: Record<string, unknown> = {}) =>
  state("media_player.stue_theater", value, {
    friendly_name: "Stue Home theater",
    supported_features: 128 | 256 | 2048 | 1024 | 4 | 8 | 1 | 16384,
    ...(value === "off" ? {} : {
      source: "Chromecast",
      source_list: ["Chromecast", "PlayStation", "NRK TV", "Netflix"],
      volume_level: 0.45,
      is_volume_muted: false,
      media_title: "Episode 4",
      media_series_title: "A Series",
      app_name: "YouTube",
      entity_picture: "/api/media_player_proxy/media_player.cast?token=x",
    }),
    tv: "media_player.tv",
    receiver: "media_player.avr",
    sources: ["Chromecast", "PlayStation", "NRK TV", "Netflix"],
    all_sources: ["Blu-ray", "Chromecast", "PlayStation", "NRK TV", "Netflix", "YouTube"],
    can_turn_on_tv: true,
    audio_problem: false,
    tv_sound_output: "external_arc",
    ...attributes,
  });
export function roomFixture(value = "playing"): HomeAssistant {
  const hass = fixture();
  hass.states["media_player.stue_theater"] = room(value);
  hass.states["remote.stue_remote"] = state("remote.stue_remote", value === "off" ? "off" : "on");
  hass.entities = {
    "media_player.stue_theater": { entity_id: "media_player.stue_theater", device_id: "room1", platform: "home_theater", translation_key: "theater" },
    "remote.stue_remote": { entity_id: "remote.stue_remote", device_id: "room1", platform: "home_theater", translation_key: "remote" },
    "remote.other": { entity_id: "remote.other", device_id: "room2", platform: "home_theater", translation_key: "remote" },
    "media_player.stue_2": { entity_id: "media_player.stue_2", device_id: "cast1", platform: "music_assistant" },
  };
  hass.devices = { room1: { name: "Stue", name_by_user: null }, room2: { name: "Herjerom" } };
  return hass;
}
