import { ImageDataLike } from "gatsby-plugin-image"

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
  feature?: ImageDataLike
  featureDescription?: string
  feeds?: number
  linkedRecipes?: string[]
  customSlug?: string
}

export interface BlogFrontmatter {
  title: string
  category: string
  slug: string
  date: string
  header?: ImageDataLike
  headerDescription?: string
  feature?: ImageDataLike
  featureDescription?: string
}

export interface Recipe {
  id: string
  frontmatter: Frontmatter
}

export interface BlogPost {
  id: string
  frontmatter: BlogFrontmatter
}

export interface Ingredient {
  name: string
  type: string
  season?: { start: MonthIndex; end: MonthIndex }
  source?: { name: string; link: string }
}

export interface SeasonalIngredient extends Ingredient {
  season: { start: MonthIndex; end: MonthIndex }
}

export interface UserComment {
  id: number
  user_id: string
  comment_text: string
  slug: string
  date_added: string
  public_user_info: {
    username: string
  }
}
