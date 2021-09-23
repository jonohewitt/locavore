export const getTimestamp = (ts: string, options?: { vague: boolean }) => {
  const time = new Date(ts).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "numeric",
  })
  const date = new Date(ts).toLocaleDateString("fr", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const exact = `${time} - ${date}`

  const currentTime = Date.now()
  const postTime = Date.parse(ts)
  let text: string

  if (currentTime - postTime < 1000 * 15) {
    text = "Just now"
  } else if (currentTime - postTime < 1000 * 60) {
    text = "Less than a minute ago"
  } else if (currentTime - postTime < 1000 * 60 * 2) {
    text = "About a minute ago"
  } else if (currentTime - postTime < 1000 * 60 * 50) {
    text = `${Math.round((currentTime - postTime) / (1000 * 60))} minutes ago`
  } else if (currentTime - postTime < 1000 * 60 * 90) {
    text = "About an hour ago"
  } else if (currentTime - postTime < 1000 * 60 * 150) {
    text = "About two hours ago"
  } else if (currentTime - postTime < 1000 * 60 * 210) {
    text = "About three hours ago"
  } else if (currentTime - postTime < 1000 * 60 * 60 * 12) {
    text = `${time} - ${date}`
  } else text = date

  return options?.vague ? text : exact
}
