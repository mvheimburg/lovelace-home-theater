export const colorSchemes = [
  "home-assistant",
  "bright",
  "warm",
  "mint",
  "sky",
  "lavender",
] as const;
export type ColorScheme = (typeof colorSchemes)[number];
/** Which device a source belongs to: a receiver input or a TV input/app. */
export type SourceDevice = "receiver" | "tv";
export interface SourceConfig {
  device: SourceDevice;
  /** The exact name in that media player's source list. */
  source: string;
  name?: string;
  icon?: string;
}
export interface CardConfig {
  type: "custom:home-theater-card";
  title?: string;
  icon?: string;
  /** LG webOS TV media player. */
  tv?: string;
  /** AV receiver media player (for example Denon AVR). */
  receiver?: string;
  /** The TV input the receiver is connected to, such as "HDMI 1". */
  tv_input?: string;
  /** The receiver input that plays the TV's own sound over ARC, such as "TV Audio". */
  tv_audio?: string;
  sources?: SourceConfig[];
  appearance?: "default" | "bubble";
  color_scheme?: ColorScheme;
  [key: string]: unknown;
}
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}
export interface LanguageContext {
  language?: string;
  locale?: { language?: string; number_format?: string; time_format?: string };
}
export interface HomeAssistant extends LanguageContext {
  connection?: { connected: boolean };
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    data: Record<string, unknown>,
  ): Promise<unknown>;
}
