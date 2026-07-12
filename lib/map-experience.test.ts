import { describe, expect, it } from "vitest";
import { mapZoomForRadius, shouldShowMapNudge, SINGAPORE_CENTER } from "./map-experience";

it("falls back to central Singapore", () => {
  expect(SINGAPORE_CENTER).toEqual([1.2834, 103.8516]);
});

describe("quest map radius", () => {
  it.each([
    [2, 14],
    [5, 13],
    [10, 12],
  ])("uses a useful zoom level for a %i km radius", (radiusKm, zoom) => {
    expect(mapZoomForRadius(radiusKm)).toBe(zoom);
  });
});

describe("restaurant-pin nudge", () => {
  it("shows immediately for a first-time visitor", () => {
    expect(shouldShowMapNudge(true, 0)).toBe(true);
  });

  it("shows again for a returning visitor after 30 seconds idle", () => {
    expect(shouldShowMapNudge(false, 30_000)).toBe(true);
  });

  it("stays hidden before a returning visitor has been idle for 30 seconds", () => {
    expect(shouldShowMapNudge(false, 29_999)).toBe(false);
  });
});
