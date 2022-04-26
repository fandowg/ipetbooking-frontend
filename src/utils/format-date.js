// https://date-fns.org/docs/parse
import parseDate from 'date-fns/parse'
// https://date-fns.org/docs/format
import format from 'date-fns/format'
import locale from 'date-fns/locale/zh_tw'


export default function formatDate(date, pattern = 'date') {
  if (!date) return
  date = parseDate(date)
  const patternMap = {
    date: 'YYYY/MM/DD',
    'date-dash': 'YYYY-MM-DD',
    dateTime: 'YYYY/MM/DD HH:mm',
    dateWeekDay: 'YYYY/MM/DD (ddd)',
    time: 'HH:mm',
  }
  return format(date, patternMap[pattern] || pattern, { locale })
}

export function formatDateRange(startDate, endDate) {
  return `${formatDate(startDate) || '無開始日期'} ～ ${formatDate(endDate) || '無結束日期'}`
}

export function formatTimeRange(startTime, endTime) {
  return `${startTime}～${endTime}`
}

export function formatDateTimeRange(startDate, endDate, startTime, endTime) {
  const startDateTime = `${formatDate(startDate)} ${startTime}`
  const endDateTime = `${formatDate(endDate)} ${endTime}`
  return startDate === endDate ? (startTime && endTime ? `${startDateTime}～${endTime}` : formatDate(startDate)) : `${startDateTime}～${endDateTime}`
}

export function formatRequestData(date, pattern = 'date') {
  if (!date) return
  date = parseDate(date)
  const patternMap = {
    date: 'YYYY-MM-DD',
    time: 'HH:mm',
  }
  return format(date, patternMap[pattern])
}

export function formatGetTime(date) {
  return Date.parse(date.replace(/-/g, "/"))
}