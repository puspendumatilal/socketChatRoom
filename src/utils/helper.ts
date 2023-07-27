export const isEmpty = (parameter: any) => {
  // Check if parameter is null or undefined
  if (parameter == null) {
    return true
  }

  // Check if parameter is an empty string
  if (typeof parameter === 'string' && parameter.trim().length === 0) {
    return true
  }

  // Check if parameter is an empty array
  if (Array.isArray(parameter) && parameter.length === 0) {
    return true
  }

  // Check if parameter is an empty object
  if (typeof parameter === 'object' && Object.keys(parameter).length === 0) {
    return true
  }

  // Check if parameter is a number (0)
  if (typeof parameter === 'number' && parameter === 0) {
    return true
  }

  // Parameter is not empty
  return false
}
