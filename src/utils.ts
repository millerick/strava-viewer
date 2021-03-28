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

/**
 * Converts a Date object into a string of the form YYYY-MM-DD
 * @param inputDate Date to convert
 */
export function getDateStringFromDate(inputDate: Date): string {
  return inputDate.toISOString().split('T')[0];
}

/**
 * Converts a Date into the number of seconds since the Epoch
 * @param inputDate Date to convert.  If it is undefined, returns 0.
 */
export function convertToEpoch(inputDate: Date | undefined): number {
  if (inputDate === undefined) {
    return 0;
  }
  return Math.floor(inputDate.getTime() / 1000);
}

/**
 * Checks to see if the input date is more than an hour in the past.
 * @param inputDate Date to check
 */
export function moreThanAnHourAgo(inputDate: Date): boolean {
  const difference = new Date().getTime() - inputDate.getTime();
  return difference > 60 * 60 * 1000; // more than an hour
}
