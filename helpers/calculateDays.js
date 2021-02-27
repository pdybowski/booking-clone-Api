exports.calculateDays = (startDate) => {
  const startDate = new Date(startDate)
  const currentDate = new Date('<YYYY-mm-ddTHH:MM:ssZ>')

  const msPerDay = 1000 * 60 * 60 * 24
  const msBetween = startDate.getTime() - currentDate.getTime()
  const days = Math.floor(msBetween / msPerDay)

  return days
}
