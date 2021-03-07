export const monthIndexToName = (index: number) => {
  switch (index) {
    case 0:
      return "janvier"
    case 1:
      return "février"
    case 2:
      return "mars"
    case 3:
      return "avril"
    case 4:
      return "mai"
    case 5:
      return "juin"
    case 6:
      return "juillet"
    case 7:
      return "août"
    case 8:
      return "septembre"
    case 9:
      return "octobre"
    case 10:
      return "novembre"
    case 11:
      return "décembre"
    default:
      return undefined
  }
}
