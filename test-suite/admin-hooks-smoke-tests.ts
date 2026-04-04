import assert from "node:assert/strict";
import { buildAdminStats, getCollectionFromResponse } from "../src/app/dashboard/admin/hooks/adminDataHelpers";
import { requestAdminMutation } from "../src/app/dashboard/admin/hooks/adminMutation";
import { fetchAdminJsonOrNull, fetchAdminList } from "../src/app/dashboard/admin/hooks/adminQuery";

async function testRequestAdminMutationSuccess() {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ success: true, value: 42 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const result = await requestAdminMutation<{ success: boolean; value: number }>(
    "https://example.com/test",
    { method: "POST" },
    "failure"
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data?.success, true);
    assert.equal(result.data?.value, 42);
  }

  globalThis.fetch = originalFetch;
}

async function testRequestAdminMutationError() {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ error: "Boom" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const result = await requestAdminMutation("https://example.com/test", { method: "POST" }, "fallback");

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error, "Boom");
  }

  globalThis.fetch = originalFetch;
}

function testGetCollectionFromResponse() {
  const keyed = getCollectionFromResponse<{ id: number }>({ inquiries: [{ id: 1 }] }, "inquiries");
  assert.deepEqual(keyed, [{ id: 1 }]);

  const arrayPayload = getCollectionFromResponse<number[]>([1, 2, 3], "ignored");
  assert.deepEqual(arrayPayload, [1, 2, 3]);

  const empty = getCollectionFromResponse<{ id: number }>({ bad: true }, "inquiries");
  assert.deepEqual(empty, []);
}

function testBuildAdminStats() {
  const stats = buildAdminStats(
    [
      { id: "1", isActive: true, _count: { products: 3 } } as any,
      { id: "2", isActive: false, _count: { products: 2 } } as any,
    ],
    [
      { id: "p1", isActive: true } as any,
      { id: "p2", isActive: false } as any,
    ],
    [{ id: "r1" }, { id: "r2" }]
  );

  assert.equal(stats.totalBusinesses, 2);
  assert.equal(stats.activeBusinesses, 1);
  assert.equal(stats.totalProducts, 5);
  assert.equal(stats.totalActiveProducts, 3);
  assert.equal(stats.totalProfessionals, 2);
  assert.equal(stats.activeProfessionals, 1);
  assert.equal(stats.totalInquiries, 2);
}

async function testAdminQueryHelpers() {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ items: [1, 2, 3] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const list = await fetchAdminList<{ items: number[] }>("https://example.com/list", new AbortController().signal);
  assert.deepEqual(list, { items: [1, 2, 3] });

  const json = await fetchAdminJsonOrNull("https://example.com/json", new AbortController().signal);
  assert.deepEqual(json, { items: [1, 2, 3] });

  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ error: "nope" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const failedList = await fetchAdminList<{ items: number[] }>("https://example.com/list", new AbortController().signal);
  assert.equal(failedList, null);

  const failedJson = await fetchAdminJsonOrNull("https://example.com/json", new AbortController().signal);
  assert.equal(failedJson, null);

  globalThis.fetch = originalFetch;
}

async function run() {
  await testRequestAdminMutationSuccess();
  await testRequestAdminMutationError();
  await testAdminQueryHelpers();
  testGetCollectionFromResponse();
  testBuildAdminStats();
  console.log("admin-hooks-smoke-tests: all passed");
}

run().catch((error) => {
  console.error("admin-hooks-smoke-tests: failed", error);
  process.exit(1);
});
