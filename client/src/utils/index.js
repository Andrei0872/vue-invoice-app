export const capitalize = ([first, ...rest]) => `${first.toUpperCase()}${rest.join('')}`

// eslint-disable-next-line
export const getRidOfObjProp = (obj, prop, { [prop]: _, ...rest } = obj) => rest

/**
 * @example
 * returns "30/03/2019"
 * formDate("2019-03-30T15:34:59.000Z")
 */
export const formatDate = dateStr => dateStr.replace(/(?<year>\d{4})\-(?<month>\d{2})\-(?<day>\d{2})([a-zA-Z:0-9.]+)/, '$<day>/$<month>/$<year>')