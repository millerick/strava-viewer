/**
 * Convert an input number of meters into feet.
 * @param meters Meters
 * @returns Feet
 */
export function convertMetersToFeet(meters: number): number {
  return meters * 3.28084;
}

/**
 * Convert an input number of meters to miles.
 * @param meters Meters
 * @returns Miles
 */
export function convertMetersToMiles(meters: number): number {
  return convertMetersToFeet(meters) / 5280.0;
}
