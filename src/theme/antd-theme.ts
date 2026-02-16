import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    // 温暖文艺配色
    colorPrimary: "#C8956C", // 琥珀色
    colorBgBase: "#FEFCF8", // 奶油白
    colorTextBase: "#3D3229", // 暖棕
    colorLink: "#C8956C",
    colorLinkHover: "#B07D56",

    // 圆角
    borderRadius: 12,

    // 字体
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
