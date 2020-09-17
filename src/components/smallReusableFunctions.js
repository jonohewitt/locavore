import { useLayoutEffect, useState } from "react"

export const useWindowWidth = () => {
  const [width, setWidth] = useState(undefined)
  useLayoutEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener("resize", updateWidth)
    updateWidth()
    return () => window.removeEventListener("resize", updateWidth)
  }, [])
  return width
}

export const monthIndexToName = index => {
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
      return false
  }
}
