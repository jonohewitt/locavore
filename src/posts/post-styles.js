import styled from "styled-components"

export const PostStyles = styled.main`
  h1 {
    margin-bottom: 10px;
  }

  h2 {
    margin: 30px 0 10px 0;
  }

  h3 {
    margin: 30px 0 15px 0;
  }

  header {
    margin-bottom: 20px;
  }

  ul {
    list-style: outside;
  }

ul li {
  margin-left: 14px;
}

  ol {
    counter-reset: custom-counter;
  }

  li {
    margin: 6px 0;
  }

  ol li {
    counter-increment: custom-counter;
    margin: 35px 0;
    padding-left: 45px;
    position: relative;
  }

  ol li::before {
    content: counter(custom-counter);
    font-size: 36px;
    margin-right: 10px;
    position: absolute;
    left: 0;
    top: -7px;
    color: var(--color-settingsIcon);
  }

  blockquote {
    font-style: italic;
    background-color: var(--color-graphBackground);
    margin: 40px 0;
    padding: 40px 40px;
    border-radius: 5px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  a {
    color: var(--color-altColor);
    font-weight: 700;
  }
`
