/* Zedia+ — builds every section from data/content.js and drives the animations. */
(() => {
  const D = window.ZEDIA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.remove("no-js");

  /* ---------- Icons (inline SVG, stroke style) ---------- */
  const P = {
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/>',
    star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    screen: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3z"/>',
    print: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    megaphone: '<path d="M3 11v2a2 2 0 0 0 2 2h2l5 4V5L7 9H5a2 2 0 0 0-2 2z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 15l-3-3c2-6 7-9 14-9 0 7-3 12-9 14z"/><circle cx="14.5" cy="9.5" r="1.5"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    folder: '<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10 3 7.5 4.5 9 8 12 8zM12 8s2-5 4.5-3.5S15 8 12 8z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    arrow: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    send: '<path d="M21 3L3 11l7 3 3 7z"/><path d="M10 14l11-11"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    whatsapp: '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1.1 2 1.2.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z"/>',
    linkedin: '<path fill="currentColor" stroke="none" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>',
    facebook: '<path fill="currentColor" stroke="none" d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H16l.5-4h-3V8.8c0-.5.3-.8.5-.8z"/>',
    google: '<path fill="#4285F4" stroke="none" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path fill="#34A853" stroke="none" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" stroke="none" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z"/><path fill="#EA4335" stroke="none" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z"/>',
    behance: '<path fill="currentColor" stroke="none" d="M8.2 11.4c.9-.4 1.4-1.1 1.4-2.2C9.6 7 8 6 5.9 6H1v12h5.1c2.2 0 4.1-1.1 4.1-3.4 0-1.4-.7-2.6-2-3.2zM3.6 8h1.9c.8 0 1.5.2 1.5 1.1s-.6 1.2-1.4 1.2h-2zm2.2 8H3.6v-3.3h2.2c.9 0 1.7.4 1.7 1.7 0 1.2-.8 1.6-1.7 1.6zM15 7h5v1.3h-5zm2.6 2.6c-2.7 0-4.4 1.9-4.4 4.4 0 2.6 1.6 4.4 4.4 4.4 2.1 0 3.4-.9 4.1-2.9h-2.1c-.2.7-1.1 1.1-1.9 1.1-1.4 0-2.1-.8-2.1-2.2h6.2c.1-2.8-1.4-4.8-4.2-4.8zm-2 3.5c.1-1.1.8-1.8 1.9-1.8 1.2 0 1.8.7 1.9 1.8z"/>',
    meta: '<path fill="none" stroke="#0866FF" stroke-width="2.4" d="M3 15c0-4 2-8 4.5-8 3.5 0 6 9 9.5 9 2 0 4-2 4-5s-1.6-4-3.2-4c-3.3 0-6 9-9.8 9C5 16 3 16 3 15z"/>',
  };
  const icon = (n) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;
  const paintIcons = (root = document) => $$("i[data-icon]", root).forEach((el) => { el.outerHTML = icon(el.dataset.icon); });

  /* ---------- Helpers ---------- */
  const C = D.contact;
  const waLink = (text = "") => `https://wa.me/${C.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const fmt = (n) => n.toLocaleString("en-US");
  const fill = (sel, html) => $$(sel).forEach((el) => { el.innerHTML = html; });
  const get = (path) => path.split(".").reduce((o, k) => o?.[k], D);

  /* ---------- Bind simple values ---------- */
  $$("[data-bind]").forEach((el) => {
    const k = el.dataset.bind;
    if (k === "email") { el.textContent = C.email; el.href = "mailto:" + C.email; }
    else if (k === "whatsapp") { el.textContent = C.whatsappDisplay; el.href = waLink(); el.target = "_blank"; el.rel = "noopener"; }
    else el.textContent = get(k) ?? "";
  });
  $$("[data-wa]").forEach((a) => { a.href = waLink(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });

  const socials = [
    ["whatsapp", waLink(), "واتساب"],
    ["linkedin", C.linkedin, "لينكدإن"],
    ["facebook", C.facebook, "فيسبوك"],
    ["behance", C.behance, "بيهانس"],
    ["mail", "mailto:" + C.email, "البريد"],
  ];
  fill("[data-socials]", socials.map(([i, h, l]) => `<a class="soc soc-${i}" href="${h}" target="_blank" rel="noopener" aria-label="${l}" title="${l}">${icon(i)}</a>`).join(""));

  /* ---------- Stats ---------- */
  const statHTML = (s) => `<div class="stat"><b><span data-count="${s.value}">0</span>${s.suffix}</b><small>${s.label}</small></div>`;
  fill("[data-stats]", D.stats.map(statHTML).join(""));
  fill("[data-big-stats]", D.stats.map((s, i) => `<div class="big-stat c${i}" data-anim="up">${icon(["rocket", "user", "briefcase", "award"][i])}<b><span data-count="${s.value}">0</span>${s.suffix}</b><small>${s.label}</small></div>`).join(""));

  /* ---------- Services ---------- */
  fill("[data-services]", D.services.map((s, i) => `
    <article class="service${s.featured ? " featured" : ""}" data-anim="up" style="--d:${(i % 4) * 80}ms" data-tilt>
      ${s.featured ? '<span class="tag">الأكثر طلبًا</span>' : ""}
      <span class="s-icon">${icon(s.icon)}</span>
      <h3>${s.title}</h3><p>${s.text}</p>
      <a class="s-link" href="${s.link || "#contact"}">${s.link ? "اكتشف الخدمة" : "اطلب الخدمة"} ${icon("arrow")}</a>
    </article>`).join(""));
  fill("[data-footer-services]", D.services.slice(0, 5).map((s) => `<li><a href="${s.link || "#services"}">${s.title}</a></li>`).join(""));
  fill("[data-service-options]", D.services.map((s) => `<option>${s.title}</option>`).join("") + "<option>أخرى</option>");

  /* ---------- Google Maps ---------- */
  fill("[data-maps-steps]", D.mapsSteps.map((s, i) => `
    <div class="m-step" data-anim="up" style="--d:${i * 70}ms">
      <span class="m-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="m-ic">${icon(s.icon)}</span>
      <h4>${s.title}</h4><p>${s.text}</p>
    </div>`).join(""));
  fill("[data-maps-proof]", D.mapsProof.map((s) => `<div class="p-stat"><b data-count="${s.value}">0</b><small>${s.label}</small></div>`).join(""));
  const vSlot = $("[data-video]");
  if (D.mapsVideo) {
    const src = D.mapsVideo;
    vSlot.innerHTML = /\.(mp4|webm)$/i.test(src)
      ? `<video src="${src}" controls playsinline preload="metadata"></video>`
      : `<iframe src="${src}" title="فيديو خدمات خرائط جوجل من زيديا" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    vSlot.classList.add("has-video");
    $("[data-phone]").remove();
  } else vSlot.remove();

  /* ---------- Portfolio (Google Drive embed) ---------- */
  const drive = $("[data-drive]");
  drive.src = `https://drive.google.com/embeddedfolderview?id=${D.driveFolderId}#grid`;
  $("[data-drive-open]").href = C.portfolioDrive;

  /* ---------- Testimonials slider ---------- */
  const rv = $("[data-reviews]"), dotsNav = $("[data-dots]");
  rv.innerHTML = D.testimonials.map((t) => `
    <figure class="review">
      <span class="r-quote">”</span>
      <div class="stars">★★★★★</div>
      <blockquote>${t.text}</blockquote>
      <figcaption><span class="r-av">${t.name[0]}</span><div><b>${t.name}</b><small>${t.place}</small></div></figcaption>
    </figure>`).join("");
  dotsNav.innerHTML = D.testimonials.map((_, i) => `<button aria-label="رأي ${i + 1}"></button>`).join("");
  let rIdx = 0, rTimer;
  const perView = () => (innerWidth > 960 ? Math.min(3, D.testimonials.length) : 1);
  const showReview = (i) => {
    const max = D.testimonials.length - perView();
    rIdx = (i + max + 1) % (max + 1);
    rv.style.transform = `translateX(${rIdx * (100 / perView())}%)`;
    $$("button", dotsNav).forEach((b, k) => b.classList.toggle("on", k === rIdx));
    $$("button", dotsNav).forEach((b, k) => { b.hidden = k > max; });
    $(".reviews-nav").hidden = max === 0;
  };
  const autoplay = () => { clearInterval(rTimer); if (!reduce) rTimer = setInterval(() => showReview(rIdx + 1), 6000); };
  $("[data-next]").addEventListener("click", () => { showReview(rIdx + 1); autoplay(); });
  $("[data-prev]").addEventListener("click", () => { showReview(rIdx - 1); autoplay(); });
  dotsNav.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { showReview([...dotsNav.children].indexOf(b)); autoplay(); } });
  addEventListener("resize", () => showReview(rIdx));
  showReview(0); autoplay();

  /* ---------- Process ---------- */
  fill("[data-process]", D.process.map((s, i) => `
    <li class="step" data-anim="up" style="--d:${i * 120}ms">
      <span class="step-ic">${icon(s.icon)}</span>
      <span class="step-n">${i + 1}</span>
      <h3>${s.title}</h3><p>${s.text}</p>
    </li>`).join(""));

  /* ---------- Clients: marquee + grid ---------- */
  const logo = ([f, n]) => `<img src="assets/clients/${f}.webp" alt="${n}" title="${n}" loading="lazy">`;
  const half = Math.ceil(D.clients.length / 2);
  [[D.clients.slice(0, half), 1], [D.clients.slice(half), 2]].forEach(([list, k]) => {
    const row = list.map((c) => `<div class="m-logo">${logo(c)}</div>`).join("");
    fill(`[data-marquee="${k}"]`, `<div class="m-track">${row}${row.replace(/<img /g, '<img aria-hidden="true" ')}</div>`);
  });
  // Third, slower row in the clients section with every logo
  const all = D.clients.map((c) => `<div class="m-logo big">${logo(c)}</div>`).join("");
  fill('[data-marquee="3"]', `<div class="m-track slow">${all}${all.replace(/<img /g, '<img aria-hidden="true" ')}</div>`);

  /* ---------- CV ---------- */
  const cv = D.cv;
  fill("[data-experience]", cv.experience.map((x) => `
    <div class="t-item">
      <span class="t-dot"></span>
      <div class="t-head"><h4>${x.title}</h4><span class="t-period">${x.period}</span></div>
      <p class="t-place">${x.place}</p>
      <ul>${x.points.map((p) => `<li>${p}</li>`).join("")}</ul>
    </div>`).join(""));
  fill("[data-certs]", cv.certificates.filter((c) => c.title).map((c) => `
    <div class="cert" data-tilt><span class="cert-logo cert-${c.logo}">${icon(c.logo)}</span><div><b dir="ltr">${c.title}</b><small>${c.issuer}</small></div><span class="cert-check">${icon("shield")}</span></div>`).join(""));
  fill("[data-skills]", cv.skills.map((s) => `
    <div class="skill"><div class="skill-top"><span>${s.name}</span><b><span data-count="${s.level}">0</span>%</b></div><div class="bar"><i style="--w:${s.level}%"></i></div></div>`).join(""));
  const chips = (arr) => arr.map((t) => `<span class="chip">${t}</span>`).join("");
  fill("[data-software]", chips(cv.software));
  fill("[data-printing]", chips(cv.printing));
  fill("[data-operations]", chips(cv.operations));
  fill("[data-langs]", cv.languages.map(([l, v]) => `<li><b>${l}</b><span>${v}</span></li>`).join(""));
  fill("[data-education]", `<b>${cv.education.title}</b><br>${cv.education.place} — ${cv.education.year}`);

  /* ---------- Why ---------- */
  fill("[data-why]", D.why.map((w, i) => `<div class="why-card" data-anim="up" style="--d:${i * 90}ms"><span class="w-ic">${icon(w.icon)}</span><h3>${w.title}</h3><p>${w.text}</p></div>`).join(""));

  /* ---------- FAQ ---------- */
  fill("[data-faq]", D.faq.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${q}</summary><div class="ans"><p>${a}</p></div></details>`).join(""));
  const faq = $("[data-faq]");
  faq.addEventListener("toggle", (e) => {
    if (e.target.open) $$("details[open]", faq).forEach((d) => d !== e.target && (d.open = false));
  }, true);

  /* ---------- Policies tabs ---------- */
  const tabs = $("[data-policy-tabs]"), panel = $("[data-policy-panel]");
  tabs.innerHTML = D.policies.map((p, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">${p.title}</button>`).join("");
  const showPolicy = (i) => {
    $$("button", tabs).forEach((b) => b.setAttribute("aria-selected", b.dataset.i == i));
    panel.innerHTML = `<dl>${D.policies[i].items.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}</dl>`;
  };
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showPolicy(b.dataset.i); });
  showPolicy(0);

  paintIcons();

  /* ---------- Counters ---------- */
  const countUp = (el) => {
    const end = +el.dataset.count;
    if (reduce) { el.textContent = fmt(end); return; }
    const dur = end > 10000 ? 2600 : 1800, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.round(end * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- Reveal on scroll (+ counters, skill bars) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add("in");
      if (el.dataset.count !== undefined) countUp(el);
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$("[data-anim], [data-count], .skill, .timeline .t-item").forEach((el) => io.observe(el));

  /* ---------- Animated logo: replay when it enters view ---------- */
  const animLogo = $(".anim-logo");
  if (animLogo) new IntersectionObserver((en) => en.forEach((e) => {
    if (e.isIntersecting) { const src = animLogo.getAttribute("src").split("?")[0]; animLogo.src = `${src}?r=${Date.now()}`; }
  }), { threshold: 0.5 }).observe(animLogo);

  /* ---------- Preloader (animated logo) ---------- */
  const loader = $(".loader");
  const hideLoader = () => loader && loader.classList.add("done");
  if (reduce) hideLoader();
  else {
    const t0 = performance.now();
    addEventListener("load", () => setTimeout(hideLoader, Math.max(0, 1500 - (performance.now() - t0))));
    setTimeout(hideLoader, 3500);
  }

  /* ---------- Typed headline ---------- */
  const typed = $(".typed");
  if (reduce) typed.textContent = D.heroWords[0];
  else {
    let w = 0, c = 0, del = false;
    const loop = () => {
      const word = D.heroWords[w];
      typed.textContent = word.slice(0, c);
      if (!del && c < word.length) { c++; setTimeout(loop, 85); }
      else if (!del) { del = true; setTimeout(loop, 1800); }
      else if (c > 0) { c--; setTimeout(loop, 40); }
      else { del = false; w = (w + 1) % D.heroWords.length; setTimeout(loop, 300); }
    };
    loop();
  }

  /* ---------- Header, progress, active nav, parallax ---------- */
  const header = $(".site-header"), bar = $(".progress");
  const links = $$(".nav-menu a[href^='#']");
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const par = $$("[data-parallax]");
  let ticking = false;
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle("scrolled", y > 30);
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    let cur = sections[0];
    sections.forEach((s) => { if (s.getBoundingClientRect().top < 140) cur = s; });
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur.id));
    if (!reduce && y < 1200) par.forEach((el) => { el.style.transform = `translateY(${y * el.dataset.parallax * -1}px)`; });
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Tilt on hover (desktop) ---------- */
  if (!reduce && matchMedia("(hover: hover)").matches) {
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
        el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
      });
      el.addEventListener("pointerleave", () => { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); });
    });
  }

  /* ---------- Mobile nav ---------- */
  const toggle = $(".nav-toggle"), menu = $("#nav-menu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    document.body.classList.toggle("menu-open", open);
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open"); }
  });

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement, tBtn = $(".theme-toggle");
  const isDark = () => root.dataset.theme === "dark" || (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  const syncThemeIcon = () => { tBtn.innerHTML = icon(isDark() ? "sun" : "moon"); };
  tBtn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("zedia-theme", root.dataset.theme); } catch (e) {}
    syncThemeIcon();
  });
  syncThemeIcon();

  /* ---------- Contact form → WhatsApp ---------- */
  const form = $("#contact-form"), note = $(".form-note", form);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements;
    let ok = true;
    [f.name, f.message].forEach((x) => { const bad = !x.value.trim(); x.classList.toggle("invalid", bad); if (bad) ok = false; });
    if (!ok) { note.textContent = "من فضلك أكمل الاسم وتفاصيل المشروع."; return; }
    note.textContent = "";
    const msg = `مرحبًا زيديا 👋\nالاسم: ${f.name.value.trim()}${f.phone.value.trim() ? "\nالجوال: " + f.phone.value.trim() : ""}\nالخدمة: ${f.service.value}\nالتفاصيل: ${f.message.value.trim()}`;
    window.open(waLink(msg), "_blank", "noopener");
  });

  $("#year").textContent = new Date().getFullYear();
})();
