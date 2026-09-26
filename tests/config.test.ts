import { it, expect } from "vitest";
import { normalizeConfig, ConfigValidationError } from "../src/config";
import { t, formatDb, outputLabel, language } from "../src/localize";
const code = (input: unknown) => {
  try {
    normalizeConfig(input);
  } catch (error) {
    return (error as ConfigValidationError).code;
  }
};
it("validates players, sources and presentation", () => {
  expect(code(null)).toBe("invalidConfig");
  expect(code({ type: "custom:other" })).toBe("invalidType");
  expect(code({ type: "custom:home-theater-card", tv: "light.x" })).toBe("invalidPlayer");
  expect(code({ type: "custom:home-theater-card", sources: {} })).toBe("invalidSources");
  expect(code({ type: "custom:home-theater-card", sources: [{ device: "dvd", source: "x" }] })).toBe("invalidSource");
  expect(code({ type: "custom:home-theater-card", sources: [{ device: "tv", source: "" }] })).toBe("invalidSource");
  expect(code({ type: "custom:home-theater-card", title: 3 })).toBe("invalidText");
  expect(code({ type: "custom:home-theater-card", appearance: "flat" })).toBe("invalidAppearance");
  expect(code({ type: "custom:home-theater-card", color_scheme: "neon" })).toBe("invalidScheme");
  expect(normalizeConfig({ type: "custom:home-theater-card", tv: "media_player.lg", sources: [{ device: "tv", source: "Netflix", name: "Film" }] }))
    .toEqual({ type: "custom:home-theater-card", tv: "media_player.lg", sources: [{ device: "tv", source: "Netflix", name: "Film" }] });
});
it("normalizes language aliases and formats dB for the regional locale", () => {
  for (const lang of ["nb", "nb-NO", "NB_no", "no", "nn"]) expect(language({ language: lang })).toBe("nb");
  expect(language({ language: "de" })).toBe("en");
  expect(language({ locale: { language: "nb-NO" } })).toBe("nb");
  expect(t({ language: "nb" }, "turnOn")).toBe("Slå på");
  expect(formatDb({ language: "nb", locale: { language: "nb-NO" } }, -35.5)).toBe("−35,5 dB");
  expect(formatDb({ language: "en", locale: { language: "en-GB" } }, -35.5)).toBe("-35.5 dB");
  expect(formatDb({ language: "en", locale: { language: "en", number_format: "decimal_comma" } }, 2)).toBe("+2 dB");
  expect(formatDb({ language: "en", locale: { language: "not a locale!" } }, 0)).toBe("0 dB");
  expect(outputLabel({ language: "nb" }, "tv_speaker")).toBe("TV-høyttalere");
  expect(outputLabel({ language: "en" }, "new_webos_output")).toBe("new_webos_output");
});
