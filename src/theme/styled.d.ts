import "styled-components"
import { Theme } from "./themeVariables"

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
