import { describe, expect, it } from "@jest/globals";
import { sum } from "../src/add";

describe("sum module", () => {
  it("should adds 1 + 2 ", () => {
    expect(sum(1, 2)).toEqual(3);
  });
});
