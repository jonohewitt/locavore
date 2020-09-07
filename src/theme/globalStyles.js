import { createGlobalStyle } from 'styled-components';

const reset = `html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote:before,blockquote:after,q:before,q:after{content:"";content:none}table{border-collapse:collapse;border-spacing:0}img,iframe{vertical-align:bottom;max-width:100%}input,textarea,select{font:inherit}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}`

export const GlobalStyles = createGlobalStyle`
  ${reset}

  html, body, button {
    font-family: Quicksand, -apple-system, sans-serif;
    font-weight: 500;
    background: var(--color-background);
    color: var(--color-text);
  }

  h1 {
  font-size: 32px;
  }

  h2 {
  font-size: 24px;
  }

  h3 {
  font-size: 24px;
  }

  p, li {
  line-height: 1.4;
  }

  p {
  margin-bottom: 20px;
  }

  a {
    text-decoration: none;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  button {
    -webkit-tap-highlight-color: transparent;
  }

  .italic {
    font-style: italic;
  }

  hr {
    border: 0;
    height: 2px;
    background: var(--color-hr);
  }
`
