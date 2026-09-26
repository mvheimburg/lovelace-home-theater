import type { SourceConfig } from "./types";
/** Guesses by the names Denon receivers and webOS TVs use; users can override per source. */
const GUESSES: Array<[RegExp, string]> = [
  [/netflix/i, "mdi:netflix"],
  [/youtube/i, "mdi:youtube"],
  [/spotify/i, "mdi:spotify"],
  [/plex/i, "mdi:plex"],
  [/twitch/i, "mdi:twitch"],
  [/apple\s*tv|airplay/i, "mdi:apple"],
  [/live\s*tv|^tv$|tuner|antenna/i, "mdi:television-classic"],
  [/game|playstation|ps\d|xbox|switch|nintendo/i, "mdi:gamepad-variant-outline"],
  [/cbl|sat|cable|decoder|set.?top/i, "mdi:satellite-variant"],
  [/blu.?ray|dvd|disc/i, "mdi:disc-player"],
  [/bluetooth/i, "mdi:bluetooth"],
  [/phono|vinyl|turntable/i, "mdi:record-player"],
  [/^cd$/i, "mdi:disc"],
  [/\b(radio|fm|am|dab|tuner)\b/i, "mdi:radio"],
  [/heos|online|network|music/i, "mdi:music-box-outline"],
  [/tv audio/i, "mdi:television-speaker"],
  [/media player|chromecast|shield|fire\s*tv|roku/i, "mdi:play-box-outline"],
  [/aux|usb/i, "mdi:usb-port"],
  [/hdmi|input|\bav\b/i, "mdi:video-input-hdmi"],
];
export function sourceIcon(source: SourceConfig): string {
  const match = GUESSES.find(([pattern]) => pattern.test(source.name || source.source))
    ?? GUESSES.find(([pattern]) => pattern.test(source.source));
  return match?.[1] ?? (source.device === "tv" ? "mdi:application-outline" : "mdi:video-input-hdmi");
}
