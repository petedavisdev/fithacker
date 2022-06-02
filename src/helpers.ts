import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"

dayjs.extend(isoWeek)

export function shortenDate(date: Date) {
  return date.toISOString().split("T")[0]
}

export function formatDate(date: Date): String {
  const shortDate = shortenDate(date)
  const today = new Date()
  const yesterday = new Date(Date.now() - 864e5)
  const weekAgo = new Date(Date.now() - 7 * 864e5)
  const daynames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  if (shortDate === shortenDate(today)) return "Today"

  if (shortDate === shortenDate(yesterday)) return "Yesterday"

  if (shortDate > shortenDate(weekAgo)) return daynames[date.getDay()]

  return daynames[date.getDay()] + " " + shortenDate(date)
}

export function createWeek(currentDate: Date, log: {}) {
  const endDate = dayjs(currentDate).endOf("isoWeek")
  const dayNames = ["Sun", "Sat", "Fri", "Thu", "Wed", "Tue", "Mon"]
  const weekData = []

  const weekLog = dayNames.map((name, index) => {
    const date = dayjs(endDate).subtract(index, "day").format("YYYY-MM-DD")
    const future = dayjs().isBefore(dayjs(date))
    const data = log[date] || []
    weekData.push(...data)
    return { name, date, future, data }
  })

  const weekTotal = [...new Set(weekData.sort())]

  return [weekLog, weekTotal]
}
