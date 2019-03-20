export const capitalize = ([first, ...rest]) => `${first.toUpperCase()}${rest.join('')}`

export const getRidOfObjProp = (obj, prop, { [prop]: _, ...rest } = obj) => rest
