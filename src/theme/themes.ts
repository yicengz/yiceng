import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

export type ThemeKey = "snow" | "dustless" | "sunrise" | "nightink";

export interface CssVars {
  "--color-bg": string;
  "--color-bg-secondary": string;
  "--color-text": string;
  "--color-text-secondary": string;
  "--color-accent": string;
  "--color-accent-hover": string;
  "--color-border": string;
  "--color-card-bg": string;
  "--color-card-shadow": string;
  "--color-header-bg": string;
  "--color-code-bg": string;
  "--color-code-text": string;
  "--color-milestone": string;
  "--color-milestone-bg": string;
  "--color-pinned-bg": string;
  "--color-tag-divider": string;
}

export interface ThemeDefinition {
  key: ThemeKey;
  label: string;
  fontStack: "serif" | "sans";
  cssVars: CssVars;
  antd: ThemeConfig;
}

export const DEFAULT_THEME: ThemeKey = "dustless";

const FONT_SERIF =
  '"Source Serif 4", "Noto Serif SC", Georgia, "Times New Roman", serif';
const FONT_SANS =
  '"Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const sharedComponents: ThemeConfig["components"] = {
  Button: { primaryShadow: "none" },
  Card: { borderRadiusLG: 12 },
};

export const themes: Record<ThemeKey, ThemeDefinition> = {
  snow: {
    key: "snow",
    label: "听雪",
    fontStack: "serif",
    cssVars: {
      "--color-bg": "#F7F7F7",
      "--color-bg-secondary": "#EFEFEF",
      "--color-text": "#333333",
      "--color-text-secondary": "#888888",
      "--color-accent": "#A0A0A0",
      "--color-accent-hover": "#808080",
      "--color-border": "#EEEEEE",
      "--color-card-bg": "rgba(255, 255, 255, 0.4)",
      "--color-card-shadow": "rgba(0, 0, 0, 0.04)",
      "--color-header-bg": "rgba(247, 247, 247, 0.85)",
      "--color-code-bg": "#2B2B2B",
      "--color-code-text": "#D4D4D4",
      "--color-milestone": "#7a6e8a",
      "--color-milestone-bg": "rgba(122, 110, 138, 0.1)",
      "--color-pinned-bg": "rgba(160, 160, 160, 0.1)",
      "--color-tag-divider": "#E0E0E0",
    },
    antd: {
      token: {
        colorPrimary: "#A0A0A0",
        colorBgBase: "#F7F7F7",
        colorTextBase: "#333333",
        colorLink: "#A0A0A0",
        colorLinkHover: "#808080",
        borderRadius: 12,
        fontFamily: FONT_SERIF,
        fontSize: 16,
        lineHeight: 1.8,
      },
      components: sharedComponents,
    },
  },

  dustless: {
    key: "dustless",
    label: "尘外",
    fontStack: "serif",
    cssVars: {
      "--color-bg": "#F1EFEC",
      "--color-bg-secondary": "#E8E4E0",
      "--color-text": "#504A45",
      "--color-text-secondary": "#8E867E",
      "--color-accent": "#7D746D",
      "--color-accent-hover": "#5F5750",
      "--color-border": "#DFDBD6",
      "--color-card-bg": "rgba(232, 228, 224, 0.5)",
      "--color-card-shadow": "rgba(80, 74, 69, 0.05)",
      "--color-header-bg": "rgba(241, 239, 236, 0.85)",
      "--color-code-bg": "#2E2A26",
      "--color-code-text": "#DDD6CA",
      "--color-milestone": "#7a6e8a",
      "--color-milestone-bg": "rgba(122, 110, 138, 0.1)",
      "--color-pinned-bg": "rgba(125, 116, 109, 0.1)",
      "--color-tag-divider": "#D5D0CB",
    },
    antd: {
      token: {
        colorPrimary: "#7D746D",
        colorBgBase: "#F1EFEC",
        colorTextBase: "#504A45",
        colorLink: "#7D746D",
        colorLinkHover: "#5F5750",
        borderRadius: 12,
        fontFamily: FONT_SERIF,
        fontSize: 16,
        lineHeight: 1.8,
      },
      components: sharedComponents,
    },
  },

  sunrise: {
    key: "sunrise",
    label: "晨曦",
    fontStack: "serif",
    cssVars: {
      "--color-bg": "#FDFDFB",
      "--color-bg-secondary": "#F5F4F0",
      "--color-text": "#1F1F1F",
      "--color-text-secondary": "#7A7A7A",
      "--color-accent": "#D4A373",
      "--color-accent-hover": "#B8884F",
      "--color-border": "#F0EFEB",
      "--color-card-bg": "#FFFFFF",
      "--color-card-shadow": "rgba(0, 0, 0, 0.06)",
      "--color-header-bg": "rgba(253, 253, 251, 0.85)",
      "--color-code-bg": "#1E1E1E",
      "--color-code-text": "#D4D4D4",
      "--color-milestone": "#7a6e8a",
      "--color-milestone-bg": "rgba(122, 110, 138, 0.1)",
      "--color-pinned-bg": "rgba(212, 163, 115, 0.1)",
      "--color-tag-divider": "#E8E8E8",
    },
    antd: {
      token: {
        colorPrimary: "#D4A373",
        colorBgBase: "#FDFDFB",
        colorTextBase: "#1F1F1F",
        colorLink: "#D4A373",
        colorLinkHover: "#B8884F",
        borderRadius: 12,
        fontFamily: FONT_SERIF,
        fontSize: 16,
        lineHeight: 1.8,
      },
      components: sharedComponents,
    },
  },

  nightink: {
    key: "nightink",
    label: "暗光",
    fontStack: "serif",
    cssVars: {
      "--color-bg": "#1A1C1E",
      "--color-bg-secondary": "#25282C",
      "--color-text": "#D1D1D1",
      "--color-text-secondary": "#8C9298",
      "--color-accent": "#8A7560",
      "--color-accent-hover": "#A08B74",
      "--color-border": "#2D3135",
      "--color-card-bg": "rgba(37, 40, 44, 0.6)",
      "--color-card-shadow": "rgba(0, 0, 0, 0.2)",
      "--color-header-bg": "rgba(26, 28, 30, 0.9)",
      "--color-code-bg": "#111315",
      "--color-code-text": "#D4D4D4",
      "--color-milestone": "#A08ABF",
      "--color-milestone-bg": "rgba(160, 138, 191, 0.15)",
      "--color-pinned-bg": "rgba(138, 117, 96, 0.15)",
      "--color-tag-divider": "#3A3E42",
    },
    antd: {
      algorithm: antdTheme.darkAlgorithm,
      token: {
        colorPrimary: "#8A7560",
        colorBgBase: "#1A1C1E",
        colorTextBase: "#D1D1D1",
        colorLink: "#8A7560",
        colorLinkHover: "#A08B74",
        borderRadius: 12,
        fontFamily: FONT_SERIF,
        fontSize: 16,
        lineHeight: 1.8,
      },
      components: sharedComponents,
    },
  },
};
