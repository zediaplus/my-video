// Zedia+ site interactions
const WHATSAPP_NUMBER = "249110045011";

const CLIENTS = [
  ["lingo-line", "Lingo Line"], ["baby-joy", "Baby Joy"], ["wd-elbushra", "WD Elbushra Phone Store"],
  ["panda-gifts", "Panda Gifts"], ["sunflower-gifts", "Sunflower Gifts"], ["real-estate", "Real Estate Co. Ltd"],
  ["etkaa-podcast", "بودكاست إتكاءة"], ["kanaba", "كنبة"], ["united-investors", "United Investors LLC"],
  ["library", "شعار مكتبة"], ["beit-alsafia", "معصرة بيت الصافية"], ["colors", "شعار ألوان"],
  ["onaty", "Onaty Beauty & Fashion"], ["atrak-organization", "منظمة أترك بصمة"], ["shams", "شمس"],
  ["alnakhb-alsafy", "مؤسسة النخب الصافي للتجارة"], ["dongola-league", "رابطة طلاب منطقة دنقلا"],
  ["leaf-drop", "شعار ورقة وقطرة"], ["arrow-brand", "شعار سهم"], ["digital-transformation", "Digital Transformation"],
  ["estores", "eStores المتاجر الإلكترونية"], ["fitbox", "FITBOX"], ["accord-stars", "Accord Stars"],
  ["derayah", "دراية للحلول المتكاملة"], ["juhoud", "جهود"], ["charcoals-burgers", "أطعم بيرقر"],
  ["taxation-chamber", "ديوان الضرائب"], ["smrc", "SMRC"], ["zakat-chamber", "ديوان الزكاة"],
  ["usaid", "USAID"], ["safe-space", "المساحة الآمنة Safe Space Program"], ["sails-of-hope", "منظمة أشرعة الأمل"],
  ["sfpa", "SFPA"], ["sroo-sweet", "سرو سويت"], ["saudi-reports", "تقارير سعودية"],
  ["raheeb-restaurant", "مطعم رهيب"], ["retex", "Retex Engineering"],
];

document.documentElement.classList.remove("no-js");

// Client logos
const logos = document.getElementById("logos");
logos.innerHTML = CLIENTS.map(([file, name]) =>
  `<li><img src="assets/clients/${file}.webp" alt="${name}" title="${name}" loading="lazy"></li>`
).join("");

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
});

// Header shadow on scroll
const header = document.querySelector(".site-header");
addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 8), { passive: true });

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Only one FAQ/policy item open at a time per accordion
document.querySelectorAll(".accordion").forEach((acc) => {
  acc.addEventListener("toggle", (e) => {
    if (e.target.open) acc.querySelectorAll("details[open]").forEach((d) => d !== e.target && (d.open = false));
  }, true);
});

// Contact form -> WhatsApp message
const form = document.getElementById("contact-form");
const note = form.querySelector(".form-note");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { name, service, message } = form.elements;
  let ok = true;
  [name, message].forEach((f) => { const bad = !f.value.trim(); f.classList.toggle("invalid", bad); if (bad) ok = false; });
  if (!ok) { note.textContent = "من فضلك أكمل الاسم وتفاصيل المشروع."; return; }
  note.textContent = "";
  const text = `مرحبًا زيديا 👋\nالاسم: ${name.value.trim()}\nالخدمة: ${service.value}\nالتفاصيل: ${message.value.trim()}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();
