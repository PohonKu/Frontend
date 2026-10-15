const fs = require("node:fs");
const ts = require("typescript");
const test = require("node:test");
const assert = require("node:assert/strict");
// Test the actual TS modules without adding a second application build pipeline.
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const model = require("../src/features/adopter/model.ts");
const { messages } = require("../src/features/adopter/messages.ts");
const memory = () => {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    clear: () => data.clear(),
  };
};
global.localStorage = memory();
global.sessionStorage = memory();
global.window = new EventTarget();
process.env.NEXT_PUBLIC_API_URL = "https://api.example.invalid";
const { api } = require("../src/features/adopter/data.ts");
test("1 and 3 year estimates match current backend rule", () => {
  assert.equal(model.estimate(150000, 1), 150000);
  assert.equal(model.estimate(150000, 3), 225000);
});
test("missing measurements stay null, zero remains zero, expiry is not invented", () => {
  const a = model.mapAdoption({
    adoptionId: "a",
    species: { id: "s" },
    tree: { updates: [{ id: "u", heightCm: 0, diameterCm: null }] },
  });
  assert.equal(a.expiresAt, null);
  assert.equal(a.observations[0].height, 0);
  assert.equal(a.observations[0].diameter, null);
});
test("species adapter maps backend spelling and decimal string", () => {
  const s = model.mapSpecies({
    id: "s",
    name: "Sawo",
    availabelStok: 0,
    basePrice: "150000.00",
  });
  assert.equal(s.stock, 0);
  assert.equal(s.price, 150000);
  assert.equal(s.latinName, null);
});
test("unknown payment status is never converted to successful", () => {
  assert.equal(
    model.mapOrder({ id: "a", paymentStatus: "SETTLEMENT" }).status,
    "UNKNOWN",
  );
});
test("story output is plain text; scripts removed and paragraphs retained", () => {
  assert.equal(
    model.storyText(
      "<p>Cerita &amp; akar</p><script>alert(1)</script><p>Hutan</p>",
    ),
    "Cerita & akar\n\nHutan",
  );
});
test("unsafe links and open redirects are rejected", () => {
  assert.equal(model.safeUrl("javascript:alert(1)"), null);
  assert.equal(model.safeUrl("//evil.example"), null);
  for (const path of ["//evil.example", "/en\\evil", "https://evil.example"])
    assert.equal(model.safeReturn(path, "id"), "/id/dashboard");
  assert.equal(
    model.safeReturn("/en/checkout?species=s", "en"),
    "/en/checkout?species=s",
  );
});
test("both locale dictionaries are complete", () => {
  assert.deepEqual(Object.keys(messages("id")), Object.keys(messages("en")));
  assert.ok(Object.values(messages("en")).every((v) => v.length > 0));
});
test("API mode uses real envelope, refreshes once and never falls back to fixtures", async () => {
  process.env.NEXT_PUBLIC_API_URL = "https://api.example.invalid";
  delete require.cache[require.resolve("../src/features/adopter/data.ts")];
  const { api: live, session } = require("../src/features/adopter/data.ts");
  session.save("old", "refresh");
  let refreshes = 0;
  global.fetch = async (url, options) => {
    if (url.endsWith("/auth/refresh")) {
      refreshes++;
      return Response.json({ data: { accestToken: "new" } });
    }
    if (options.headers.get("Authorization") === "Bearer old")
      return new Response("", { status: 401 });
    return Response.json({
      data: [
        {
          id: "api-tree",
          name: "From API",
          availabelStok: 5,
          basePrice: "200000",
        },
      ],
    });
  };
  const data = await live.species();
  assert.equal(data[0].id, "api-tree");
  assert.equal(refreshes, 1);
  global.fetch = async () => new Response("", { status: 503 });
  await assert.rejects(live.species(), (e) => e.status === 503);
  global.fetch = async () => Response.json({ data: { broken: true } });
  await assert.rejects(live.species());
});

test("order payload is validated, and server total/status remain authoritative", async () => {
 let calls=0;
 global.fetch=async(url,options)=>{calls++;assert.equal(url,'https://api.example.invalid/api/v1/orders');assert.deepEqual(JSON.parse(options.body),{speciesId:'s',nameOnTag:'A tree',durationYears:3});return Response.json({success:true,data:{id:'order',paymentStatus:'PENDING',totalAmount:'237000',durationYears:3}});};
 for(const draft of [{speciesId:'s',duration:2,tag:'Tree'},{speciesId:'s',duration:1,tag:' '}])await assert.rejects(api.createOrder(draft));
 assert.equal(calls,0);const order=await api.createOrder({speciesId:'s',duration:3,tag:' A tree '});assert.equal(order.status,'PENDING');assert.equal(order.total,237000);
});
test("API failure states never become empty lists or paid orders",async()=>{
 for(const status of [401,403,404,409,503]){localStorage.clear();global.fetch=async()=>new Response('',{status});await assert.rejects(api.order('missing'),e=>e.status===status);}
 global.fetch=async()=>Response.json({success:true,data:[]});assert.deepEqual(await api.species(),[]);
 for(const status of ['PENDING','PAID','FAILED','CANCELLED','EXPIRED']){global.fetch=async()=>Response.json({success:true,data:{id:'o',paymentStatus:status}});assert.equal((await api.order('o')).status,status);}
});
