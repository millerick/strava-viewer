export function convertMetersToFeet(meters: number): number {
  return meters * 3.28084;
}

export function convertMetersToMiles(meters: number): number {
  return convertMetersToFeet(meters) / 5280.0;
}
