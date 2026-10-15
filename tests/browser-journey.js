async (page) => {
  await page.bringToFront(); await page.setDefaultNavigationTimeout(90000);
  await page.unroute("**/api/v1/**");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const checks = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const ok = (v, n) => {
    if (!v) throw Error(n);
    checks.push(n);
  };
  const species = [
    {
      id: "bendo",
      name: "Bendo",
      latinName: "Artocarpus elasticus",
      category: "Native Karst",
      basePrice: "150000",
      availabelStok: 5,
      description: "Data pengujian ekologi.",
      storyContent: "<p>Cerita untuk pengujian alur.</p>",
      mainImageUrl: null,
    },
    {
      id: "gayam",
      name: "Gayam",
      category: "Perspektif Keistimewaan",
      basePrice: "175000",
      availabelStok: 4,
    },
    {
      id: "katimoho",
      name: "Katimoho",
      category: "Sumbu Filosofi",
      basePrice: "180000",
      availabelStok: 3,
    },
    {
      id: "sold-out",
      name: "Stok habis",
      category: "Native Karst",
      basePrice: 150000,
      availabelStok: 0,
    },
    {
      id: "incomplete",
      name: "Informasi belum lengkap",
      category: "Native Karst",
    },
  ];
  let orders = [],
    adoptions = [],
    errorStatus = 0;
  const calls = [];
  await page.route("**/api/v1/**", async (route) => {
    const req = route.request(),
      u = new URL(req.url()),
      path = u.pathname,
      method = req.method();
    calls.push({ path, method });
    const send = (data, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: status < 400, data }),
      });
    if (method === "OPTIONS") return send({});
    if (errorStatus) return send({}, errorStatus);
    if (path.endsWith('/auth/google')) return route.fulfill({status:302,headers:{location:'http://localhost:3000/auth/google/callback?success=true&accessToken=test-only&refreshToken=test-refresh'}});
    if (path.endsWith("/auth/refresh")) return send({}, 401);
    if (path.endsWith("/auth/me"))
      return send({
        id: "test-user",
        fullName: "Penguji",
        email: "test@example.invalid",
        role: "CUSTOMER",
      });
    if (path.endsWith("/trees/species")) return send(species);
    if (path.includes("/trees/species/")) {
      const s = species.find((s) => s.id === path.split("/").pop());
      return send(s || {}, s ? 200 : 404);
    }
    if (path.endsWith("/orders") && method === "POST") {
      const d = req.postDataJSON();
      const order = {
        id: "order-" + (orders.length + 1),
        orderNumber: "TEST-" + (orders.length + 1),
        totalAmount: 237000,
        paymentStatus: "PENDING",
        createdAt: "2026-10-14T00:00:00Z",
        orderItems: d,
      };
      orders.push(order);
      return send(order);
    }
    if (path.endsWith("/orders")) return send(orders);
    if (path.includes("/orders/")) {
      const oid = path.split("/")[4],
        o = orders.find((o) => o.id === oid);
      if (path.endsWith("/cancel") && o) o.paymentStatus = "CANCELLED";
      if (path.endsWith("/payment")) return send({ snapToken: "test-token" });
      return send(o || {}, o ? 200 : 404);
    }
    if (path.endsWith("/adoptions")) return send(adoptions);
    if (path.includes("/adoptions/")) {
      const a = adoptions.find((a) => a.id === path.split("/").pop());
      return send(a || {}, a ? 200 : 404);
    }
    return send({}, 404);
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://localhost:3000/id");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page
    .getByRole("heading", { name: "PohonKu Adopsi Tanaman Langka" })
    .waitFor();
  ok((await page.locator(".pk-demo").count()) === 0, "No demo UI");
  ok(
    (await page.locator(".pk-theme img").count()) === 4,
    "Four original theme assets",
  );
  ok(
    (await page.locator(".pk-hero-slide").count()) === 3,
    "Three original forest images",
  );
  await page.screenshot({ path: "outputs/restoration/hero-desktop.png" });
  await page
    .getByRole("link", { name: "Jelajahi pohon", exact: true })
    .first()
    .click();
  await page.getByRole("searchbox").fill("Bendo");
  await page.waitForURL(/q=Bendo/);
  await page.getByRole("heading", { name: "Bendo", exact: true }).waitFor();
  await page.getByRole("link", { name: "Switch to English" }).click();
  await page.waitForURL(/\/en\/trees/);
  await page
    .getByRole("heading", { name: "Explore trees", exact: true })
    .waitFor();
  ok(
    (await page.getByRole("searchbox").inputValue()) === "Bendo",
    "Language preserves filter",
  );
  await page
    .getByRole("heading", { name: "Bendo", exact: true })
    .getByRole("link")
    .click();
  await page.waitForURL(/\/en\/trees\/bendo/);
  await page.waitForTimeout(600);
  await page.locator(".pk-detail-info select").selectOption("3");
  await page.waitForTimeout(200);
  await page.locator(".pk-detail-info .pk-button").click();
  await page.waitForURL(/checkout/);
  await page.locator('input[maxlength="30"]').fill("Hutan Kita");
  await page.locator("form .pk-button").click();
  await page.locator(".pk-panel .pk-button").first().click();
  await page.waitForURL(/login/);
  await page.getByRole('button',{name:'Continue with Google'}).click();
  await page.waitForURL(/checkout/);
  await page.locator('input[maxlength="30"]').waitFor();
  ok(
    (await page.locator('input[maxlength="30"]').inputValue()) === "Hutan Kita",
    "Tag survives login",
  );
  ok(
    (await page.locator("select").inputValue()) === "3",
    "Duration survives login",
  );
  await page.reload();
  await page.locator('input[maxlength="30"]').waitFor();
  ok(
    (await page.locator('input[maxlength="30"]').inputValue()) === "Hutan Kita",
    "Tag survives reload",
  );
  await page.locator("form .pk-button").click();
  await page.locator(".pk-panel .pk-button").first().click();
  await page.waitForURL(/order=/);
  await page.getByRole("heading", { name: /payment|pending/i }).waitFor();
  ok(orders.length === 1, "One order created through API");
  ok(
    (await page.locator(".pk-facts").innerText()).includes("237"),
    "Authoritative server total displayed",
  );
  await page.screenshot({
    path: "outputs/restoration/checkout.png",
    fullPage: false,
  });
  orders[0].paymentStatus = "PAID";
  adoptions = [
    {
      id: "adoption-1",
      speciesId: "bendo",
      species: species[0],
      nameOnTag: "Hutan Kita",
      adoptedAt: "2026-10-14T00:00:00Z",
      tree: {
        serialNumber: "BND-001",
        updates: [
          {
            id: "obs1",
            createdAt: "2026-10-14T00:00:00Z",
            heightCm: 125,
            diameterCm: 2,
            adminNotes: "Catatan pengujian.",
          },
        ],
      },
    },
  ];
  await page.reload();
  await page
    .getByRole("link", { name: "My trees", exact: true })
    .first()
    .click();
  await page.getByRole("heading", { name: "Bendo", exact: true }).waitFor();
  await page.locator('a[href*="/dashboard/adoptions/"]').click();
  await page.getByText("125 cm", { exact: true }).waitFor();
  ok(
    (await page.locator("a[download]").count()) === 0,
    "No fabricated certificate download",
  );
  await page.screenshot({
    path: "outputs/restoration/adoption.png",
    fullPage: false,
  });
  for (const width of [390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/id",
      "/en/trees",
      "/id/trees/bendo",
      "/en/login",
      "/id/about",
      "/en/contact",
      "/id/dashboard",
    ]) {
      await page.goto("http://localhost:3000" + path);
      await page.locator(".pk").waitFor();
      await page.evaluate(() => document.fonts.ready);
      ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `No overflow ${width} ${path}`,
      );
      if (width === 390 && path === "/id")
        await page.screenshot({
          path: "outputs/restoration/home-mobile.png",
          fullPage: false,
        });
      if (width === 1440 && path === "/en/trees")
        await page.screenshot({
          path: "outputs/restoration/catalog-desktop.png",
          fullPage: false,
        });
      if (width === 1440 && path === "/id/about")
        await page.screenshot({
          path: "outputs/restoration/about.png",
          fullPage: false,
        });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://localhost:3000/id/trees");
  await page.locator(".pk-tree-card").first().waitFor();
  await page.locator(".pk-tree-card").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.locator(".pk-tree-card").first().hover();
  await page.waitForTimeout(300);
  ok(
    await page
      .locator(".pk-tree-card")
      .first()
      .evaluate((el) => getComputedStyle(el).transform !== "none"),
    "Card hover visibly lifts",
  );
  for (const status of [403, 503]) {
    errorStatus = status;
    await page.reload();
    await page.getByRole("alert").waitFor();
    ok(true, `API ${status} is visible`);
  }
  errorStatus = 0;
  await page.goto("http://localhost:3000/id/trees/sold-out");
  await page.getByText("Stok habis", { exact: true }).last().waitFor();
  ok(
    (await page.locator('a[href*="checkout?species="]').count()) === 0,
    "Sold-out species cannot checkout",
  );
  await page.goto("http://localhost:3000/id/trees/incomplete");
  await page.getByText("Harga belum tersedia", { exact: true }).waitFor();
  ok(true, "Incomplete price is not zero");
  await page.goto("http://localhost:3000/id/about#team");
  await page.getByRole("heading", { name: "Tim di balik PohonKu" }).waitFor();
  ok(true, "Team identities restored");
  ok(errors.length === 0, "No uncaught browser errors: " + errors.join("; "));
  return { passed: checks.length, checks, calls: calls.length };
}
