import { describe, expect, it } from "vitest";
import { readiness } from "@/lib/pb-data";
import type { Mentorship } from "@/lib/pb-data";

const ms = (a: boolean, b: boolean, c: boolean) => ({ session_1_completed: a, session_2_completed: b, session_3_completed: c }) as Mentorship;

describe("referral readiness", () => {
  it("steps 0 → 33 → 67 → 100 as sessions complete", () => {
    expect(readiness(ms(false, false, false))).toBe(0);
    expect(readiness(ms(true, false, false))).toBe(33);
    expect(readiness(ms(true, true, false))).toBe(67);
    expect(readiness(ms(true, true, true))).toBe(100);
  });
});
