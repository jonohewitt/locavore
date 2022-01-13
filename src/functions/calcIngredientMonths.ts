import { SeasonalIngredient, MonthIndex } from "../../types"

/**
 * Calculates the number of months between the start or end of
 * an ingredient's season and a given month index.
 *
 * @param ingredient - An ingredient object that must include a
 * `season` property with `start` and `end` month index values.
 *
 * @param comparison - Specify whether to calculate the number of
 * months `since` a seasonal event in the past or `until` an event
 * in future.
 *
 * @param seasonalEvent - Specify whether to measure to the `start`
 *  or `end` of an ingredient's season.
 *
 * @param monthIndex - A number from `0-11` specifying which month
 * to compare the seasonal event against. Usually this will be the
 * index current month. *E.g For January, the `monthIndex` would be
 * `0`*
 *
 * @returns A number from `1-11`
 * @example
 * ```
 * const carrot = {
    name: "Carrot",
    season: {
      start: 5,
      end: 2,
    },
  }
 * 
 * calcIngredientMonths(carrot, "since", "start", 6) => 1
 * // In month 6 it would have been 1 month since the start of the carrot's season
 * ```
 */
export const calcIngredientMonths = (
  ingredient: SeasonalIngredient,
  comparison: "since" | "until",
  seasonalEvent: "start" | "end",
  monthIndex: MonthIndex
) => {
  let difference!: number

  switch (comparison) {
    case "since":
      difference = monthIndex - ingredient.season[seasonalEvent]
      break
    case "until":
      difference = ingredient.season[seasonalEvent] - monthIndex
      break
  }

  if (difference < 0) difference += 12
  return difference
}
