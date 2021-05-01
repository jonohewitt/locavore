import "styled-components"
import { lightTheme } from "./themeVariables"

declare module "styled-components" {
  type Theme = typeof lightTheme
  export interface DefaultTheme extends Partial<Theme> {}
}
