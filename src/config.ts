import {
  colorSchemes,
  type CardConfig,
  type SceneConfig,
  type SourceConfig,
} from "./types";
export type ConfigErrorCode =
  | "invalidConfig"
  | "invalidType"
  | "invalidAppearance"
  | "invalidScheme"
  | "invalidPlayer"
  | "invalidSources"
  | "invalidSource"
  | "invalidText"
  | "invalidScenes"
  | "invalidScene";
export class ConfigValidationError extends Error {
  constructor(readonly code: ConfigErrorCode) {
    super(code);
  }
}
export const TYPE = "custom:home-theater-card" as const;
const PLAYER = /^media_player\.[a-z0-9_]+$/;
function object(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new ConfigValidationError("invalidConfig");
  return input as Record<string, unknown>;
}
function optional(input: Record<string, unknown>, key: string): void {
  if (input[key] !== undefined && typeof input[key] !== "string")
    throw new ConfigValidationError("invalidText");
}
export function normalizeConfig(input: unknown): CardConfig {
  const c = object(input);
  if (c.type !== TYPE) throw new ConfigValidationError("invalidType");
  for (const key of ["title", "icon", "tv_input", "tv_audio"]) optional(c, key);
  for (const key of ["theater", "tv", "receiver"])
    if (c[key] !== undefined && (typeof c[key] !== "string" || !PLAYER.test(c[key] as string)))
      throw new ConfigValidationError("invalidPlayer");
  if (
    c.appearance !== undefined &&
    !["default", "bubble"].includes(String(c.appearance))
  )
    throw new ConfigValidationError("invalidAppearance");
  if (
    c.color_scheme !== undefined &&
    !colorSchemes.includes(c.color_scheme as (typeof colorSchemes)[number])
  )
    throw new ConfigValidationError("invalidScheme");
  if (c.sources !== undefined && !Array.isArray(c.sources))
    throw new ConfigValidationError("invalidSources");
  const sources = (c.sources as unknown[] | undefined)?.map((value): SourceConfig => {
    const s = object(value);
    if (!["receiver", "tv"].includes(String(s.device)) || typeof s.source !== "string" || !s.source)
      throw new ConfigValidationError("invalidSource");
    optional(s, "name");
    optional(s, "icon");
    return { ...s, device: s.device as SourceConfig["device"], source: s.source };
  });
  if (c.scenes !== undefined && !Array.isArray(c.scenes))
    throw new ConfigValidationError("invalidScenes");
  const scenes = (c.scenes as unknown[] | undefined)?.map((value): SceneConfig => {
    const s = object(value);
    if (typeof s.entity !== "string" || !/^(scene|script)\.[a-z0-9_]+$/.test(s.entity))
      throw new ConfigValidationError("invalidScene");
    optional(s, "name");
    optional(s, "icon");
    return { ...s, entity: s.entity };
  });
  const config: CardConfig = { ...c, type: TYPE };
  if (scenes) config.scenes = scenes;
  if (sources) config.sources = sources;
  return config;
}
