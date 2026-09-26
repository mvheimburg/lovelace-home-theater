import type { LanguageContext } from "./types";
const en = {
  invalidConfig: "Check the card configuration in the dashboard code editor.",
  invalidType: "Use type: custom:home-theater-card.",
  invalidAppearance: "Choose Default or Bubble appearance.",
  invalidScheme: "Choose a listed color scheme.",
  invalidPlayer: "Choose a media player entity (media_player.*).",
  invalidSources: "Sources must be a list.",
  invalidSource: "Each source needs a device (receiver or tv) and a source name.",
  invalidText: "Names, titles, inputs and icons must be text.",
  title: "TV",
  on: "On",
  off: "Off",
  unavailable: "Unavailable",
  turnOn: "Turn on",
  turnOff: "Turn off",
  pending: "Updating…",
  failed: "The TV or receiver did not accept the command",
  timeout: "No confirmation from the TV or receiver. Check them and try again.",
  configure: "Configure",
  close: "Close",
  setup: "Choose a Home Theater room in the visual card editor.",
  withoutIntegration: "Without the Home Theater integration",
  directHelp:
    "Bind a TV and receiver directly. Sources are then hidden while the devices are off, and arrow keys always go to the TV.",
  sources: "Sources",
  allSources: "All sources",
  receiverInputs: "Receiver inputs",
  tvSources: "TV inputs and apps",
  switchTo: "Switch to",
  playing: "Playing",
  navigation: "Navigation",
  up: "Up",
  down: "Down",
  left: "Left",
  right: "Right",
  ok: "OK",
  back: "Back",
  home: "Home",
  volume: "Volume",
  volumeUp: "Volume up",
  volumeDown: "Volume down",
  mute: "Mute",
  unmute: "Unmute",
  muted: "Muted",
  soundMode: "Sound mode",
  tvSound: "TV sound",
  arcProblem: "The TV is playing through its own speakers, not the receiver.",
  useReceiver: "Send to receiver",
  arcHint:
    "If the receiver stays silent on TV apps, turn on HDMI control (CEC/SIMPLINK) and ARC on both the TV and the receiver, and connect the receiver's ARC output to the TV's ARC/eARC input.",
  tvPowerHint:
    "Home Assistant cannot turn this TV on yet. Add an automation for the TV's “Device is requested to turn on” trigger that sends a Wake-on-LAN packet.",
  theaterEntity: "Home Theater room",
  theaterHelp:
    "A room from the Home Theater integration shows what is playing, keeps sources while the room is off and sends arrow keys to the active player. The integration then owns the TV, receiver, sources and linked players: set them under Settings → Devices & services → Home Theater → Configure.",
  integrationSettings: "Home Theater settings",
  room: "Room",
  tvPowerHintTheater:
    "Home Assistant cannot turn this TV on yet. Add the TV's MAC address under the Home Theater integration's Configure.",
  configureHelpTheater:
    "Sources, their names and the players linked to them are set in the Home Theater integration. Title and appearance are set in this card's visual editor.",
  devices: "Devices",
  tv: "TV",
  receiver: "Receiver",
  details: "Details",
  configureHelp:
    "To choose the TV, receiver, favourite sources and appearance, edit this dashboard, select Edit on this card, and use the visual editor. Save the dashboard to keep your changes; Cancel leaves saved settings unchanged.",
  editorHelp:
    "Choose the Home Theater room this card shows. Changes are saved with the dashboard.",
  cardTitle: "Title",
  icon: "Icon",
  name: "Name",
  tvEntity: "TV (LG webOS)",
  receiverEntity: "AV receiver",
  tvInput: "TV input the receiver is connected to",
  tvInputHelp:
    "Selecting a receiver source also switches the TV to this input.",
  tvAudio: "Receiver input for the TV's own sound",
  tvAudioHelp:
    "Selecting a TV app also switches the receiver to this input (usually TV Audio).",
  none: "None",
  favourites: "Favourite sources",
  favouritesHelp:
    "Leave empty to show the receiver's inputs and Live TV. All sources stay available under All sources.",
  addSource: "Add source",
  device: "Device",
  source: "Source",
  remove: "Remove",
  moveUp: "Move up",
  moveDown: "Move down",
  incomplete:
    "Choose a source or remove each empty source row. Until then, your latest editor changes are not passed to the dashboard.",
  appearance: "Appearance",
  default: "Default",
  bubble: "Bubble",
  colorScheme: "Color scheme",
  "home-assistant": "Home Assistant",
  bright: "Bright",
  warm: "Warm",
  mint: "Mint",
  sky: "Sky",
  lavender: "Lavender",
  "output.tv_speaker": "TV speakers",
  "output.external_arc": "Receiver (HDMI ARC)",
  "output.external_optical": "Receiver (optical)",
  "output.external_speaker": "Receiver (optical/ARC)",
  "output.tv_external_speaker": "TV speakers and receiver",
  "output.tv_speaker_headphone": "TV speakers and headphones",
  "output.bt_soundbar": "Bluetooth",
  "output.headphone": "Headphones",
  "output.lineout": "Line out",
};
const nb: Record<keyof typeof en, string> = {
  invalidConfig: "Kontroller kortoppsettet i dashbordets kodeeditor.",
  invalidType: "Bruk type: custom:home-theater-card.",
  invalidAppearance: "Velg Standard eller Bubble som utseende.",
  invalidScheme: "Velg et fargevalg fra listen.",
  invalidPlayer: "Velg en mediespillerenhet (media_player.*).",
  invalidSources: "Kilder må være en liste.",
  invalidSource: "Hver kilde trenger en enhet (receiver eller tv) og et kildenavn.",
  invalidText: "Navn, titler, innganger og ikoner må være tekst.",
  title: "TV",
  on: "På",
  off: "Av",
  unavailable: "Utilgjengelig",
  turnOn: "Slå på",
  turnOff: "Slå av",
  pending: "Oppdaterer …",
  failed: "TV-en eller mottakeren godtok ikke kommandoen",
  timeout: "Ingen bekreftelse fra TV-en eller mottakeren. Kontroller dem og prøv igjen.",
  configure: "Konfigurer",
  close: "Lukk",
  setup: "Velg et hjemmekino-rom i den visuelle korteditoren.",
  withoutIntegration: "Uten Hjemmekino-integrasjonen",
  directHelp:
    "Koble TV og mottaker direkte. Kildene skjules da mens enhetene er av, og piltastene går alltid til TV-en.",
  sources: "Kilder",
  allSources: "Alle kilder",
  receiverInputs: "Innganger på mottakeren",
  tvSources: "TV-innganger og apper",
  switchTo: "Bytt til",
  playing: "Spiller",
  navigation: "Navigasjon",
  up: "Opp",
  down: "Ned",
  left: "Venstre",
  right: "Høyre",
  ok: "OK",
  back: "Tilbake",
  home: "Hjem",
  volume: "Volum",
  volumeUp: "Volum opp",
  volumeDown: "Volum ned",
  mute: "Demp",
  unmute: "Slå på lyden",
  muted: "Dempet",
  soundMode: "Lydmodus",
  tvSound: "TV-lyd",
  arcProblem: "TV-en spiller gjennom egne høyttalere, ikke mottakeren.",
  useReceiver: "Send til mottakeren",
  arcHint:
    "Hvis mottakeren er stille på TV-apper: slå på HDMI-styring (CEC/SIMPLINK) og ARC både på TV-en og mottakeren, og koble mottakerens ARC-utgang til TV-ens ARC/eARC-inngang.",
  tvPowerHint:
    "Home Assistant kan ikke slå på denne TV-en ennå. Legg til en automasjon for TV-ens utløser «Enheten blir bedt om å slå seg på» som sender en Wake-on-LAN-pakke.",
  theaterEntity: "Hjemmekino-rom",
  theaterHelp:
    "Et rom fra Hjemmekino-integrasjonen viser hva som spilles, beholder kildene mens rommet er av og sender piltastene til spilleren som er i bruk. Integrasjonen eier da TV, mottaker, kilder og koblede spillere: sett dem under Innstillinger → Enheter og tjenester → Hjemmekino → Konfigurer.",
  integrationSettings: "Innstillinger for hjemmekino",
  room: "Rom",
  tvPowerHintTheater:
    "Home Assistant kan ikke slå på denne TV-en ennå. Legg inn TV-ens MAC-adresse under Konfigurer for Hjemmekino-integrasjonen.",
  configureHelpTheater:
    "Kilder, navnene deres og spillerne som er koblet til dem, settes i Hjemmekino-integrasjonen. Tittel og utseende settes i kortets visuelle editor.",
  devices: "Enheter",
  tv: "TV",
  receiver: "Mottaker",
  details: "Detaljer",
  configureHelp:
    "For å velge TV, mottaker, favorittkilder og utseende, rediger dashbordet, velg Rediger på dette kortet og bruk den visuelle editoren. Lagre dashbordet for å beholde endringene. Avbryt lar lagrede innstillinger være uendret.",
  editorHelp:
    "Velg hjemmekino-rommet dette kortet viser. Endringer lagres med dashbordet.",
  cardTitle: "Tittel",
  icon: "Ikon",
  name: "Navn",
  tvEntity: "TV (LG webOS)",
  receiverEntity: "AV-mottaker",
  tvInput: "TV-inngangen mottakeren er koblet til",
  tvInputHelp: "Når du velger en kilde på mottakeren, bytter TV-en også til denne inngangen.",
  tvAudio: "Inngang på mottakeren for TV-ens egen lyd",
  tvAudioHelp:
    "Når du velger en TV-app, bytter mottakeren også til denne inngangen (vanligvis TV Audio).",
  none: "Ingen",
  favourites: "Favorittkilder",
  favouritesHelp:
    "La stå tomt for å vise mottakerens innganger og Live TV. Alle kilder er fortsatt tilgjengelige under Alle kilder.",
  addSource: "Legg til kilde",
  device: "Enhet",
  source: "Kilde",
  remove: "Fjern",
  moveUp: "Flytt opp",
  moveDown: "Flytt ned",
  incomplete:
    "Velg en kilde eller fjern hver tomme kilderad. Frem til da blir de siste endringene i editoren ikke sendt til dashbordet.",
  appearance: "Utseende",
  default: "Standard",
  bubble: "Bubble",
  colorScheme: "Fargevalg",
  "home-assistant": "Home Assistant",
  bright: "Lys",
  warm: "Varm",
  mint: "Mint",
  sky: "Himmelblå",
  lavender: "Lavendel",
  "output.tv_speaker": "TV-høyttalere",
  "output.external_arc": "Mottaker (HDMI ARC)",
  "output.external_optical": "Mottaker (optisk)",
  "output.external_speaker": "Mottaker (optisk/ARC)",
  "output.tv_external_speaker": "TV-høyttalere og mottaker",
  "output.tv_speaker_headphone": "TV-høyttalere og hodetelefoner",
  "output.bt_soundbar": "Bluetooth",
  "output.headphone": "Hodetelefoner",
  "output.lineout": "Linjeutgang",
};
export type TextKey = keyof typeof en;
export function language(hass: LanguageContext | undefined): "en" | "nb" {
  const lang = (hass?.language || hass?.locale?.language || "en")
    .toLowerCase()
    .replace(/_/g, "-")
    .split("-")[0];
  return ["nb", "no", "nn"].includes(lang) ? "nb" : "en";
}
export function t(hass: LanguageContext | undefined, key: TextKey): string {
  return (language(hass) === "nb" ? nb : en)[key];
}
/** Known webOS sound outputs get a label; unknown values stay recognizable. */
export function outputLabel(hass: LanguageContext | undefined, output: string): string {
  const key = `output.${output}`;
  return key in en ? t(hass, key as TextKey) : output;
}
function formatLocale(hass: LanguageContext | undefined): { locale: string; grouping: boolean } {
  const preference = hass?.locale?.number_format;
  const formats: Record<string, string> = {
    comma_decimal: "en-US",
    decimal_comma: "de-DE",
    space_comma: "nb-NO",
    none: "en-US",
  };
  const locale = (hass?.locale?.language || hass?.language || "en")
    .replace(/_/g, "-")
    .replace(/^(no|nn)(?=-|$)/i, "nb");
  return { locale: formats[preference ?? ""] ?? locale, grouping: preference !== "none" };
}
/** Formats a receiver volume in dB for display only. */
export function formatDb(hass: LanguageContext | undefined, value: number): string {
  const { locale, grouping } = formatLocale(hass);
  const options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
    useGrouping: grouping,
  };
  let number: string;
  try {
    number = new Intl.NumberFormat(locale, options).format(value);
  } catch {
    number = new Intl.NumberFormat("en", options).format(value);
  }
  return `${number} dB`;
}
