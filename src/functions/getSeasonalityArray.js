export const getSeasonalityArray = ingredient => {
  if (!ingredient.season) return new Array(12).fill(true)
  else {
    const start = ingredient.season.start
    const end = ingredient.season.end
    const array = new Array(12).fill(false)

    if (start - end < 0) {
      array.fill(true, start, end + 1)
    } else {
      array.fill(true, start)
      array.fill(true, 0, end + 1)
    }

    array[start] = "start"
    array[end] = "end"
    return array
  }
}
