export const globalCss = {
  extend: {
    "*": {
      "--global-color-border": "colors.border",
      "--global-color-placeholder": "colors.fg.subtle",
      "--global-color-selection": "colors.colorPalette.subtle.bg",
      "--global-color-focus-ring": "colors.colorPalette.solid.bg",
    },
    html: {
      colorPalette: "gray",
    },
    body: {
      background: "brand.canvas",
      color: "brand.ink",
      fontFamily: '"Avenir Next", "Segoe UI Variable", "Segoe UI", system-ui, sans-serif',
      margin: "0",
      minHeight: "100dvh",
    },
  },
};
