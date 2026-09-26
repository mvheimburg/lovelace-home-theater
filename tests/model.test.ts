import { it, expect } from "vitest";
import {
  activeSource,
  allSources,
  arcProblem,
  favourites,
  roomOn,
  volumeDb,
} from "../src/model";
import { sourceIcon } from "../src/icons";
import { config, fixture, receiver, tv } from "./fixture";
it("treats a receiver input other than TV Audio as the active source", () => {
  expect(activeSource(config(), fixture())).toEqual({ device: "receiver", source: "Media Player" });
});
it("treats the TV's app as active while the receiver plays TV Audio", () => {
  const hass = fixture();
  hass.states["media_player.avr"] = receiver("on", { source: "TV Audio" });
  hass.states["media_player.tv"] = tv("on", { source: "Netflix" });
  expect(activeSource(config(), hass)).toEqual({ device: "tv", source: "Netflix" });
});
it("ignores the TV input that only carries the receiver's picture", () => {
  const hass = fixture("on", "off");
  expect(activeSource(config(), hass)).toBeUndefined();
  expect(roomOn(config(), hass)).toBe(true);
  expect(roomOn(config(), fixture("off", "off"))).toBe(false);
});
it("defaults favourites to receiver inputs and Live TV, and lists every source", () => {
  const hass = fixture();
  expect(favourites(config(), hass).map((s) => s.source)).toEqual(["Blu-ray", "Game", "Media Player", "Live TV"]);
  expect(allSources(config(), hass).map((s) => `${s.device}:${s.source}`)).toEqual([
    "receiver:Blu-ray", "receiver:Game", "receiver:Media Player",
    "tv:HDMI 2", "tv:Live TV", "tv:Netflix", "tv:NRK TV", "tv:YouTube",
  ]);
  const custom = { ...config(), sources: [{ device: "tv" as const, source: "Netflix" }] };
  expect(favourites(custom, hass)).toEqual(custom.sources);
  const tvOnly = { type: "custom:home-theater-card" as const, tv: "media_player.tv" };
  expect(favourites(tvOnly, hass)).toHaveLength(6);
});
it("converts Denon volume to dB and flags TV speakers as an ARC problem", () => {
  expect(volumeDb(receiver())).toBe(-35);
  expect(volumeDb(receiver("on", { volume_level: 0.455 }))).toBe(-34.5);
  expect(volumeDb(receiver("off"))).toBeUndefined();
  const hass = fixture();
  expect(arcProblem(config(), hass)).toBe(false);
  hass.states["media_player.tv"] = tv("on", { sound_output: "tv_speaker" });
  expect(arcProblem(config(), hass)).toBe(true);
  expect(arcProblem({ ...config(), receiver: undefined }, hass)).toBe(false);
});
it("guesses source icons without mistaking unrelated names", () => {
  expect(sourceIcon({ device: "tv", source: "Netflix" })).toBe("mdi:netflix");
  expect(sourceIcon({ device: "receiver", source: "Game" })).toBe("mdi:gamepad-variant-outline");
  expect(sourceIcon({ device: "tv", source: "Amazon Prime Video" })).toBe("mdi:application-outline");
  expect(sourceIcon({ device: "receiver", source: "Media Player", name: "Apple TV" })).toBe("mdi:apple");
  expect(sourceIcon({ device: "receiver", source: "Something" })).toBe("mdi:video-input-hdmi");
});
