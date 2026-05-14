import assert from "node:assert/strict";
import { buildBusinessStats } from "../src/app/dashboard/business/hooks/businessDataHelpers";
import { requestBusinessMutation } from "../src/app/dashboard/business/hooks/businessMutation";
import { fetchBusinessJsonOrNull, fetchBusinessList } from "../src/app/dashboard/business/hooks/businessQuery";

async function testRequestBusinessMutationSuccess() {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ success: true, value: 7 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const result = await requestBusinessMutation<{ success: boolean; value: number }>(
    "https://example.com/test",
    { method: "POST" },
    "failure"
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data?.success, true);
    assert.equal(result.data?.value, 7);
  }

  globalThis.fetch = originalFetch;
}

async function testRequestBusinessMutationError() {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ error: "Boom" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const result = await requestBusinessMutation("https://example.com/test", { method: "POST" }, "fallback");

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error, "Boom");
  }

  globalThis.fetch = originalFetch;
}

function testBuildBusinessStats() {
  const stats = buildBusinessStats(
    [
      { id: "p1", isActive: true } as any,
      { id: "p2", isActive: false } as any,
    ],
    [
      { id: "i1", status: "NEW" } as any,
      { id: "i2", status: "READ" } as any,
      { id: "i3", status: "REPLIED" } as any,
    ]
  );

  assert.equal(stats.totalProducts, 2);
  assert.equal(stats.activeProducts, 1);
  assert.equal(stats.totalInquiries, 3);
  assert.equal(stats.newInquiries, 1);
  assert.equal(stats.readInquiries, 1);
  assert.equal(stats.repliedInquiries, 1);
}

async function testBusinessQueryHelpers() {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ items: [1, 2, 3] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const list = await fetchBusinessList<{ items: number[] }>("https://example.com/list", new AbortController().signal);
  assert.deepEqual(list, { items: [1, 2, 3] });

  const json = await fetchBusinessJsonOrNull("https://example.com/json", new AbortController().signal);
  assert.deepEqual(json, { items: [1, 2, 3] });

  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ error: "nope" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const failedList = await fetchBusinessList<{ items: number[] }>("https://example.com/list", new AbortController().signal);
  assert.equal(failedList, null);

  const failedJson = await fetchBusinessJsonOrNull("https://example.com/json", new AbortController().signal);
  assert.equal(failedJson, null);

  globalThis.fetch = originalFetch;
}

async function run() {
  await testRequestBusinessMutationSuccess();
  await testRequestBusinessMutationError();
  await testBusinessQueryHelpers();
  testBuildBusinessStats();
  console.log("business-hooks-smoke-tests: all passed");
}

run().catch((error) => {
  console.error("business-hooks-smoke-tests: failed", error);
  process.exit(1);
});
