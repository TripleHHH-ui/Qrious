export type MapRadiusKm = 2 | 5 | 10;
export const SINGAPORE_CENTER: [number, number] = [1.2834, 103.8516];

export function mapZoomForRadius(radiusKm: number): number {
  if (radiusKm <= 2) return 14;
  if (radiusKm <= 5) return 13;
  return 12;
}

export function shouldShowMapNudge(firstVisit: boolean, idleMs: number): boolean {
  return firstVisit || idleMs >= 30_000;
}
