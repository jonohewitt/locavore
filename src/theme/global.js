import { createGlobalStyle } from 'styled-components';

const reset = `html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline
}

article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
  display: block
}

body {
  line-height: 1
}

ol, ul {
  list-style: none
}

blockquote:before, blockquote:after, q:before, q:after {
  content: "";
  content: none
}

table {
  border-collapse: collapse;
  border-spacing: 0
}

img, iframe {
  vertical-align: bottom;
  max-width: 100%
}

input, textarea, select {
  font: inherit
}

* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}`

export const lightTheme = {
  text: "#222",
  background: "hsla(71, 55%, 82%, 1)",
  nav: "hsla(71, 50%, 90%, 0.95)",
  navText: "hsla(155, 51%, 42%, 1)",
  settings: "hsla(17, 40%, 57%, 1)",
  settingsIcon: "hsla(10, 48%, 63%, 1)",
  altColor: "hsla(155, 60%, 35%, 1)",
  graphBackground: "hsla(0, 0%, 100%, 0.6)",
}

export const darkTheme = {
  text: "#ddd",
  background: "hsla(234, 11%, 19%, 1)",
  nav: "hsla(234, 11%, 25%, 0.98)",
  navText: "#ddd",
  settings: "hsla(234, 11%, 15%, 1)",
  settingsIcon: "hsla(10, 48%, 63%, 1)",
  altColor: "hsla(154, 61%, 51%, 1)",
  graphBackground: "hsla(0, 0%, 0%, 0.3)",
}

export const GlobalStyles = createGlobalStyle`
  ${reset}

  html, body {
    font-family: Quicksand, -apple-system, sans-serif;
    font-weight: 500;
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }

  h1 {
  font-size: 64px;
  margin-bottom: 24px;
  }

  h2 {
  font-size: 32px;
  }

  h3 {
  font-size: 24px;
  }

  p {
  line-height: 1.3;
  margin-top: 20px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .italic {
    font-style: italic;
  }

`
