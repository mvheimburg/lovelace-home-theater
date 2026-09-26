import type {
  CardConfig,
  HassEntity,
  HomeAssistant,
  SourceConfig,
  SourceDevice,
} from "./types";
/** media_player supported_features bits used by this card. */
export const Feature = {
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  TURN_ON: 128,
  TURN_OFF: 256,
  VOLUME_STEP: 1024,
  SELECT_SOURCE: 2048,
  SELECT_SOUND_MODE: 65536,
} as const;
/** Default receiver input that plays the TV's own sound (Denon/Marantz naming). */
export const DEFAULT_TV_AUDIO = "TV Audio";
/** webOS names for sending the TV's sound to an ARC/eARC or optical receiver. */
export const RECEIVER_OUTPUT = "external_arc";
const OFF = ["off", "standby"];
const MISSING = ["unavailable", "unknown"];
export function entityOf(hass: HomeAssistant | undefined, id: string | undefined): HassEntity | undefined {
  return id ? hass?.states[id] : undefined;
}
export function available(hass: HomeAssistant | undefined, id: string | undefined): boolean {
  const entity = entityOf(hass, id);
  return !!entity && hass!.connection?.connected !== false && !MISSING.includes(entity.state);
}
export function isOn(entity: HassEntity | undefined): boolean {
  return !!entity && !OFF.includes(entity.state) && !MISSING.includes(entity.state);
}
export function supports(entity: HassEntity | undefined, feature: number): boolean {
  const value = entity?.attributes.supported_features;
  return typeof value === "number" && (value & feature) === feature;
}
export function sourceList(entity: HassEntity | undefined): string[] {
  const list = entity?.attributes.source_list;
  return Array.isArray(list) ? list.filter((s): s is string => typeof s === "string") : [];
}
export function soundModes(entity: HassEntity | undefined): string[] {
  const list = entity?.attributes.sound_mode_list;
  return Array.isArray(list) ? list.filter((s): s is string => typeof s === "string") : [];
}
function text(entity: HassEntity | undefined, key: string): string | undefined {
  const value = entity?.attributes[key];
  return typeof value === "string" && value ? value : undefined;
}
export const currentSource = (entity?: HassEntity) => text(entity, "source");
export const currentSoundMode = (entity?: HassEntity) => text(entity, "sound_mode");
export const soundOutput = (entity?: HassEntity) => text(entity, "sound_output");
export function tvAudio(config: CardConfig): string | undefined {
  return config.receiver ? config.tv_audio || DEFAULT_TV_AUDIO : undefined;
}
/**
 * Configured favourites, or a short default: the receiver's own inputs (without
 * the TV audio input) and the TV's Live TV. Every source stays reachable in the
 * full source list.
 */
export function favourites(config: CardConfig, hass: HomeAssistant | undefined): SourceConfig[] {
  if (config.sources?.length) return config.sources;
  const receiver = entityOf(hass, config.receiver);
  const tv = entityOf(hass, config.tv);
  const audio = tvAudio(config);
  const result: SourceConfig[] = sourceList(receiver)
    .filter((source) => source !== audio)
    .map((source) => ({ device: "receiver", source }));
  const tvSources = sourceList(tv);
  if (config.receiver) {
    if (tvSources.includes("Live TV")) result.push({ device: "tv", source: "Live TV" });
  } else result.push(...tvSources.map((source): SourceConfig => ({ device: "tv", source })));
  return result;
}
/** Every source the two players offer, receiver inputs first. */
export function allSources(config: CardConfig, hass: HomeAssistant | undefined): SourceConfig[] {
  const audio = tvAudio(config);
  return [
    ...sourceList(entityOf(hass, config.receiver))
      .filter((source) => source !== audio)
      .map((source): SourceConfig => ({ device: "receiver", source })),
    ...sourceList(entityOf(hass, config.tv))
      .filter((source) => source !== config.tv_input)
      .map((source): SourceConfig => ({ device: "tv", source })),
  ];
}
/**
 * What the room is showing. A receiver on its TV audio input means the TV's own
 * input or app is playing; any other receiver input is a player on the receiver.
 */
export function activeSource(config: CardConfig, hass: HomeAssistant | undefined):
  { device: SourceDevice; source: string } | undefined {
  const receiver = entityOf(hass, config.receiver);
  const tv = entityOf(hass, config.tv);
  const input = isOn(receiver) ? currentSource(receiver) : undefined;
  if (input && input !== tvAudio(config)) return { device: "receiver", source: input };
  const app = isOn(tv) ? currentSource(tv) : undefined;
  if (app && app !== config.tv_input) return { device: "tv", source: app };
  if (input) return { device: "receiver", source: input };
  return undefined;
}
export function sameSource(a: { device: SourceDevice; source: string } | undefined, b: SourceConfig): boolean {
  return !!a && a.device === b.device && a.source === b.source;
}
/** The player whose volume the room uses: the receiver when there is one. */
export function volumePlayer(config: CardConfig): string | undefined {
  return config.receiver || config.tv;
}
/** Denon/Marantz map 0..1 onto -80..+18 dB; show the receiver's own dB figure. */
export function volumeDb(entity: HassEntity | undefined): number | undefined {
  const level = entity?.attributes.volume_level;
  return typeof level === "number" && Number.isFinite(level) ? Math.round((level * 100 - 80) * 2) / 2 : undefined;
}
export function muted(entity: HassEntity | undefined): boolean {
  return entity?.attributes.is_volume_muted === true;
}
/**
 * The TV's sound should reach the receiver over ARC whenever a receiver is
 * configured. A TV reporting its own speakers or headphones is misrouted.
 */
export function arcProblem(config: CardConfig, hass: HomeAssistant | undefined): boolean {
  const tv = entityOf(hass, config.tv);
  const output = soundOutput(tv);
  return !!config.receiver && isOn(tv) && !!output &&
    (output.startsWith("tv_speaker") || output === "headphone");
}
export function roomOn(config: CardConfig, hass: HomeAssistant | undefined): boolean {
  return isOn(entityOf(hass, config.tv)) || isOn(entityOf(hass, config.receiver));
}
