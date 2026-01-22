module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [
          ".ios.js",
          ".android.js",
          ".ios.jsx",
          ".android.jsx",
          ".js",
          ".jsx",
          ".json",
          ".ts",
          ".tsx",
        ],
        alias: {
          "@components": "./components",
          "@ui": "./ui",
          "@config": "./config",
          "@constants": "./constants",
          "@helpers": "./helpers",
          "@hooks": "./hooks",
          "@interfaces": "./interfaces",
          "@screens": "./screens",
          "@store": "./store",
          "@utils": "./utils",
          "@api": "./api",
          "@features": "./features",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
