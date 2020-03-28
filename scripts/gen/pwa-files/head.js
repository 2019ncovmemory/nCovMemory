"use strict";

const { iconList } = require("../../icon-list");

const appleSplashScreen = iconList
  .filter(i => i[0] === "splash")
  .map(splash =>
    splash.slice(1).map(([w, h, r]) => [
      "link",
      {
        href: `icons/splash-screen-${w * r}x${h * r}.png`,
        media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r})`,
        rel: "apple-touch-startup-image",
      },
    ]),
  )
  .flat(1);

exports.head = () => [
  ...appleSplashScreen,
  ["link", { rel: "icon", href: "/icons/icon-32.ico" }],
  ["link", { rel: "manifest", href: "/manifest.webmanifest" }],
  ["meta", { name: "theme-color", content: "#0366d6" }],
  ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
  ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "white" }],
  ["link", { rel: "apple-touch-icon", href: "/icons/icon-180x180.png" }],
  ["link", { rel: "mask-icon", href: "/icon.svg", color: "#0366d6" }],
  [
    "meta",
    { name: "msapplication-TileImage", content: "/icons/icon-144x144.png" },
  ],
  ["meta", { name: "msapplication-TileColor", content: "#0366d6" }],
];
