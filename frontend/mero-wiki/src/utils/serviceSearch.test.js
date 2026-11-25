import assert from "node:assert/strict";
import test from "node:test";

import { getServiceSuggestions, resolveServiceQuery } from "./serviceSearch.js";

test("service aliases resolve to their matching service category", () => {
  assert.equal(resolveServiceQuery("plumbing").category, "plumber");
  assert.equal(resolveServiceQuery("car hire").category, "car_rental");
});

test("service suggestions handle typos and respect their limit", () => {
  assert.equal(getServiceSuggestions("plumbr", 1)[0].category, "plumber");
  assert.equal(getServiceSuggestions("repair", 2).length, 2);
});

test("unknown and blank searches do not resolve to a category", () => {
  assert.deepEqual(resolveServiceQuery("   "), { query: "", category: "" });
  assert.deepEqual(resolveServiceQuery("zzzz-not-a-service"), {
    query: "zzzz-not-a-service",
    category: "",
  });
  assert.deepEqual(getServiceSuggestions("  "), []);
});
