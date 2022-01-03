export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export type ThemeMode = "light" | "dark"

export interface Frontmatter {
  title: string
  vegan: boolean
  vegetarian: boolean
  veganOption: boolean
  prepTime: number
  cookTime: number
  course: string
  ingredients: string[]
  description?: string
  feature?: any
  featureDescription?: string
  feeds?: number
  linkedRecipes?: string[]
  customSlug?: string
}

export interface Ingredient {
  name: string
  type: string
  season?: { start: number; end: number }
  source?: { name: string; link: string }
}

export interface Recipe {
  id: string
  frontmatter: Frontmatter
}
