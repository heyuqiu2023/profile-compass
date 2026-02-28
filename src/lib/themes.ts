export type ThemeId = "navy" | "forest" | "slate" | "midnight";

export interface ThemeColors {
  accent: string;
  secondary: string;
  bg: string;
  text: string;
  muted: string;
  isDark: boolean;
}

export const THEMES: Record<ThemeId, { label: string; colors: ThemeColors }> = {
  navy: {
    label: "Navy",
    colors: {
      accent: "#1e3a5f",
      secondary: "#c8b89a",
      bg: "#ffffff",
      text: "#1a1a1a",
      muted: "#6b7280",
      isDark: false,
    },
  },
  forest: {
    label: "Forest",
    colors: {
      accent: "#2d5016",
      secondary: "#d4e4bc",
      bg: "#ffffff",
      text: "#1a1a1a",
      muted: "#6b7280",
      isDark: false,
    },
  },
  slate: {
    label: "Slate",
    colors: {
      accent: "#374151",
      secondary: "#e5e7eb",
      bg: "#ffffff",
      text: "#1a1a1a",
      muted: "#6b7280",
      isDark: false,
    },
  },
  midnight: {
    label: "Midnight",
    colors: {
      accent: "#3b82f6",
      secondary: "#64748b",
      bg: "#0f172a",
      text: "#f8fafc",
      muted: "#94a3b8",
      isDark: true,
    },
  },
};

export const themeIds = Object.keys(THEMES) as ThemeId[];
