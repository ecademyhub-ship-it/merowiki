import assert from "node:assert/strict";
import test from "node:test";

import { getLocationSuggestions } from "./locationSearch.js";

test("ranks location prefixes before fuzzy matches", () => {
  assert.deepEqual(
    getLocationSuggestions(["Pokhara", "Kathmandu", "Kathmandu Valley"], "kath"),
    ["Kathmandu", "Kathmandu Valley"],
  );
});

test("returns typo suggestions without duplicate locations", () => {
  assert.deepEqual(
    getLocationSuggestions(["Kathmandu", "kathmandu", "Pokhara"], "kathmand"),
    ["Kathmandu"],
  );
});

test("returns no suggestions for blank queries or invalid locations", () => {
  assert.deepEqual(getLocationSuggestions(["Kathmandu"], "  "), []);
  assert.deepEqual(getLocationSuggestions([], "kath"), []);
});
