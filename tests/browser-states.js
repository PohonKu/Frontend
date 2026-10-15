async (page) => {
  await page.bringToFront(); await page.setDefaultNavigationTimeout(90000);
  const capture = async (path) => {
    await page.evaluate(async () => {
      const images = [...document.images];
      images.forEach((img) => (img.loading = "eager"));
      await Promise.all(images.map((img) => img.decode().catch(() => {})));
      await document.fonts.ready;
    });
    await page.screenshot({ path, fullPage: true });
  };
  const checks = [];
  const ok = (v, n) => {
    if (!v) throw Error(n);
    checks.push(n);
  };
  await page.unroute("**/api/v1/**");
  let status = "PENDING",
    responseStatus = 200;
  const order = {
    id: "state-order",
    orderNumber: "TEST",
    totalAmount: 150000,
    orderItems: { speciesId: "bendo", durationYears: 1, nameOnTag: "Test" },
  };
  await page.route("**/api/v1/**", async (route) => {
    const p = new URL(route.request().url()).pathname;
    let data = [];
    let code = responseStatus;
    if (p.endsWith("/auth/me"))
      data = {
        id: "test",
        fullName: "Penguji",
        email: "test@example.invalid",
        role: "ADMIN",
      };
    else if (p.endsWith("/auth/refresh")) code = 401;
    else if (p.includes("/orders/state-order"))
      data = { ...order, paymentStatus: status };
    await route.fulfill({
      status: code,
      contentType: "application/json",
      body: JSON.stringify({ success: code < 400, data }),
    });
  });
  await page.goto("http://localhost:3000/id");
  await page.evaluate(() => {
    localStorage.setItem("access_token", "test-only");
    localStorage.removeItem("refresh_token");
  });
  for (const locale of ["id", "en"]) {
    for (const state of ["PENDING", "PAID", "FAILED", "CANCELLED", "EXPIRED"]) {
      status = state;
      await page.goto(
        `http://localhost:3000/${locale}/checkout?order=state-order`,
      );
      await page.locator(".pk-facts").waitFor();
      ok(
        (await page.locator(".pk-panel h1").innerText()) !== "",
        `${locale} ${state} displays status`,
      );
      ok(
        (await page.locator(".pk-simulation").count()) === 0,
        `${locale} ${state} no payment simulation`,
      );
    }
    await page.goto(`http://localhost:3000/${locale}/dashboard`);
    await page.locator(".pk-empty").waitFor();
    ok(true, `${locale} new adopter empty dashboard`);
  }
  responseStatus = 401;
  await page.goto("http://localhost:3000/id/dashboard");
  await page
    .getByRole("link", { name: "Masuk", exact: true })
    .first()
    .waitFor();
  ok(true, "Expired session requests sign-in");
  responseStatus = 200;
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://localhost:3000/id");
  await page.locator('.pk-forest-hero').waitFor();
  ok(await page.locator('.pk-hero-controls').count() === 0, 'Hero has no visible slideshow controls');
  await page.mouse.click(800, 400);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(900);
  ok(
    await page.evaluate(() => scrollY > 500),
    "ScrollSmoother permits normal scrolling",
  );
  ok(
    (await page.locator(".pk-header-clear").count()) === 0,
    "Header becomes solid on scroll",
  );
  await page
    .getByRole("link", { name: "Tentang program", exact: true })
    .first()
    .click();
  await page.waitForURL(/about/);
  await page.goBack();
  await page.waitForURL(/\/id$/);
  await page.waitForTimeout(1000);
  ok(
    await page.evaluate(() => scrollY > 500),
    "Back navigation restores scroll",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://localhost:3000/id");
  await page.locator(".pk-forest-hero").waitFor();
  ok(
    (await page
      .getByRole("button", { name: "Jeda pergantian gambar" })
      .count()) === 0,
    "Reduced motion removes autoplay",
  );
  ok(
    await page
      .locator(".pk-motion-wrapper")
      .evaluate((el) => getComputedStyle(el).position !== "fixed"),
    "Reduced motion uses native scrolling",
  );
  await capture("outputs/restoration/home-desktop.png");
  await page.keyboard.press("Tab");
  ok(
    await page.evaluate(() =>
      document.activeElement?.classList.contains("pk-skip"),
    ),
    "Skip link is first keyboard target",
  );
  await page.keyboard.press("Enter");
  ok(
    await page.evaluate(() => document.activeElement?.id === "pk-content"),
    "Skip link focuses content",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/id");
  await page.getByRole("button", { name: "Menu navigasi" }).click();
  ok(await page.getByRole("navigation").isVisible(), "Mobile menu is readable");
  await page.getByRole("button", { name: "Tutup", exact: true }).click();
  await capture("outputs/restoration/home-mobile.png");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://localhost:3000/id/about");
  await capture("outputs/restoration/about.png");
  await page.evaluate(() => (document.documentElement.style.zoom = "2"));
  ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "About page at 200% zoom has no horizontal overflow",
  );
  await page.evaluate(() => (document.documentElement.style.zoom = ""));
  await page.goto("http://localhost:3000/id/contact");
  ok((await page.locator("form").count()) === 0, "No unsupported contact form");
  await page.evaluate(() => localStorage.setItem("access_token", "test-only"));
  for (const route of [
    "addSpecies",
    "updateTree",
    "daftarCustomer",
    "riwayatOrder",
    "daftarrAdopsi",
  ]) {
    await page.goto("http://localhost:3000/admin/" + route);
    await page.locator("h1").waitFor();
    ok(!page.url().includes("/login"), `Admin route preserved: ${route}`);
  }
  await page.evaluate(() => localStorage.clear());
  await page.unroute("**/api/v1/**");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  return { passed: checks.length, checks };
}
