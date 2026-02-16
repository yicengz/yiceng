import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#8B7355",
    colorBgBase: "#F5F1EA",
    colorTextBase: "#2C2418",
    colorLink: "#8B7355",
    colorLinkHover: "#6F5B43",

    borderRadius: 12,

    fontFamily:
      '"Source Serif 4", "Noto Serif SC", Georgia, "Times New Roman", serif',
    fontSize: 16,
    lineHeight: 1.8,
  },
  components: {
    Button: {
      primaryShadow: "none",
    },
    Card: {
      borderRadiusLG: 12,
    },
  },
};

export default theme;
