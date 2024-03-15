// Utility function to convert first letter to uppercase and the rest to lowercase

export function toProperCase(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
