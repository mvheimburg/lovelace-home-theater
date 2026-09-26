import { css } from "lit";
import { colorSchemeStyles } from "./color-schemes";
export const styles = [
  colorSchemeStyles,
  css`
    :host {
      display: block;
      color: var(--primary-text-color, #262d38);
      font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
      --ht-surface: var(--ha-card-background, var(--card-background-color, #fff));
      --ht-pill: var(--secondary-background-color, #f1f3f6);
      --ht-accent: var(--bubble-accent-color, var(--primary-color, #507b9b));
      --ht-radius: var(--ha-card-border-radius, 16px);
      --ht-muted: var(--secondary-text-color, #626976);
    }
    :host([appearance="bubble"]) {
      --ht-surface: var(
        --bubble-main-background-color,
        var(--ha-card-background, var(--card-background-color, #fff))
      );
      --ht-pill: var(
        --bubble-secondary-background-color,
        var(--secondary-background-color, #f1f3f6)
      );
      --ht-radius: var(--bubble-border-radius, 28px);
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      padding: 16px;
      background: var(--ht-surface);
      border-radius: var(--ht-radius);
      border: 1px solid var(--ha-card-border-color, var(--divider-color, #ddd));
      box-shadow: var(--ha-card-box-shadow, none);
    }
    :host([appearance="bubble"]) ha-card {
      border: var(--bubble-border, none);
      box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow, none));
    }
    button {
      font: inherit;
      color: inherit;
      cursor: pointer;
      border: 0;
      background: none;
      min-height: 44px;
    }
    button:disabled {
      cursor: default;
      opacity: 0.55;
    }
    button:focus-visible {
      outline: 3px solid var(--ht-accent);
      outline-offset: 3px;
    }
    button:hover:not(:disabled) {
      filter: brightness(0.96);
    }
    button:active:not(:disabled) {
      filter: brightness(0.9);
    }
    h2,
    h3,
    p {
      margin: 0;
    }
    header {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 14px;
    }
    h2 {
      font-size: 17px;
      font-weight: 650;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    h3 {
      font-size: 13px;
      font-weight: 650;
      color: var(--ht-muted);
      margin: 18px 0 8px;
    }
    .heading {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }
    .heading > ha-icon {
      flex: none;
      color: var(--ht-muted);
    }
    ha-card[data-state="on"] .heading > ha-icon {
      color: var(--ht-accent);
    }
    .titles {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .titles .status {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .status {
      font-size: 12px;
      color: var(--ht-muted);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
      flex: none;
    }
    ha-icon {
      --mdc-icon-size: 21px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    .round {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      background: var(--ht-pill);
    }
    .power[aria-pressed="true"] {
      background: color-mix(in srgb, var(--ht-accent) 24%, var(--ht-pill));
      color: var(--ht-accent);
    }
    .sources {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 118px), 1fr));
      gap: 8px;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      padding: 0 12px 0 10px;
      border-radius: 22px;
      background: var(--ht-pill);
      font-size: 13px;
      text-align: left;
    }
    .chip span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chip ha-icon {
      flex: none;
      color: var(--ht-muted);
    }
    .chip[aria-pressed="true"] {
      background: color-mix(in srgb, var(--ht-accent) 22%, var(--ht-pill));
      font-weight: 600;
    }
    .chip[aria-pressed="true"] ha-icon {
      color: var(--ht-accent);
    }
    .chip.more {
      color: var(--ht-muted);
    }
    .now-playing {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      margin: 0 0 12px;
      padding: 6px;
      border-radius: 18px;
      background: var(--ht-pill);
    }
    .now-playing img {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 12px;
      flex: none;
    }
    .now-playing > ha-icon {
      width: 64px;
      height: 64px;
      --mdc-icon-size: 32px;
      color: var(--ht-muted);
      flex: none;
    }
    .now-playing strong {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .controls-row {
      display: flex;
      justify-content: flex-start;
      margin-top: 16px;
    }
    .action.primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: color-mix(in srgb, var(--ht-accent) 22%, var(--ht-pill));
    }
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 18px;
    }
    .navigation {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .dpad {
      display: grid;
      grid-template: repeat(3, 56px) / repeat(3, 56px);
      border-radius: 50%;
      background: var(--ht-pill);
      padding: 4px;
    }
    .pad {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .pad ha-icon {
      --mdc-icon-size: 28px;
      width: 30px;
      height: 30px;
    }
    .up { grid-area: 1 / 2; }
    .left { grid-area: 2 / 1; }
    .ok {
      grid-area: 2 / 2;
      background: var(--ht-surface);
      font-weight: 650;
      font-size: 14px;
      box-shadow: 0 1px 4px rgb(0 0 0 / 0.12);
    }
    .right { grid-area: 2 / 3; }
    .down { grid-area: 3 / 2; }
    .nav-keys {
      display: flex;
      gap: 16px;
    }
    .volume {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 6px;
      border-radius: 30px;
      background: var(--ht-pill);
    }
    .volume .round {
      background: var(--ht-surface);
    }
    .volume output {
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      color: var(--ht-muted);
      min-width: 64px;
      text-align: center;
      padding: 4px 0;
    }
    .mute[aria-pressed="true"] {
      color: var(--error-color, #bd2635);
    }
    .hint {
      font-size: 13px;
      line-height: 1.6;
      color: var(--ht-muted);
      margin-top: 12px;
    }
    .error,
    .warning {
      padding: 10px 12px;
      margin: 0 0 12px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
    .error {
      color: var(--error-color, #bd2635);
      background: color-mix(in srgb, var(--error-color, #bd2635) 8%, var(--ht-surface));
    }
    .warning {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      background: color-mix(in srgb, var(--warning-color, #8c6100) 12%, var(--ht-surface));
    }
    .warning > span {
      flex: 1;
      min-width: 150px;
    }
    .warning ha-icon {
      color: var(--warning-color, #8c6100);
    }
    .action {
      padding: 0 16px;
      border-radius: 22px;
      background: var(--ht-pill);
    }
    .warning .action {
      background: var(--ht-surface);
    }
    dialog {
      color: inherit;
      background: var(--ht-surface);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: var(--ht-radius);
      width: min(480px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px);
      padding: 20px;
      box-shadow: 0 16px 60px #0005;
    }
    dialog::backdrop {
      background: rgb(0 0 0 / 0.4);
    }
    dialog header h3:first-child {
      margin-top: 0;
    }
    dialog .warning {
      margin-top: 10px;
    }
    .device {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 0;
    }
    .device > span {
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 400px) {
      ha-card {
        padding: 12px;
      }
      .controls {
        gap: 14px;
      }
      .dpad {
        grid-template: repeat(3, 50px) / repeat(3, 50px);
      }
      .pad {
        width: 50px;
        height: 50px;
      }
    }
  `,
];
