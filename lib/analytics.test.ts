import { describe, expect, it } from "vitest";
import { buildTrackingContext } from "./analytics";

describe("analytics attribution", () => {
  it("preserves referral and launch UTM parameters", () => {
    const context = buildTrackingContext("https://questlunch.app/?ref=MANGO42&utm_source=x&utm_medium=social&utm_campaign=launch");

    expect(context).toEqual({
      referral_code: "MANGO42",
      utm_source: "x",
      utm_medium: "social",
      utm_campaign: "launch",
    });
  });

  it("omits absent attribution values", () => {
    expect(buildTrackingContext("https://questlunch.app/")).toEqual({});
  });
});
