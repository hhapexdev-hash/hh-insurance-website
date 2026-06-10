/* HH Insurance — redesign prototype v2 · shared behavior (null-guarded per page) */
(function () {
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // header hairline on scroll
  var hdr = document.getElementById("hdr");
  if (hdr) {
    addEventListener("scroll", function () { hdr.classList.toggle("scrolled", scrollY > 4); }, { passive: true });
  }

  // mobile menu
  var nav = document.getElementById("nav"), menuBtn = document.getElementById("menuBtn");
  if (nav && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.textContent = open ? "Close" : "Menu";
    });
    nav.querySelectorAll("ul a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "Menu";
      });
    });
  }

  // fade-up on scroll, staggered within each parent group
  var fades = document.querySelectorAll(".fade");

  // hero headline: wrap words for the slide-up reveal (text nodes only; <em>/<br> preserved)
  var heroH1 = document.querySelector(".hero h1");
  if (heroH1 && !reduced && "IntersectionObserver" in window) {
    (function wrapWords(el) {
      [].slice.call(el.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          var frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(function (tok) {
            if (tok === "" ) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
            var w = document.createElement("span"); w.className = "w";
            var inner = document.createElement("span"); inner.textContent = tok;
            w.appendChild(inner); frag.appendChild(w);
          });
          el.replaceChild(frag, node);
        } else if (node.nodeType === 1 && node.tagName !== "BR") {
          wrapWords(node);
        }
      });
    })(heroH1);
    [].slice.call(heroH1.querySelectorAll(".w > span")).forEach(function (s, i) {
      s.style.transitionDelay = (80 + i * 60) + "ms";
    });
  }

  if (!reduced && "IntersectionObserver" in window) {
    var groupCount = new Map();
    fades.forEach(function (el) {
      var p = el.parentElement;
      var n = groupCount.get(p) || 0;
      el.style.transitionDelay = (n * 70) + "ms";
      groupCount.set(p, n + 1);
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    fades.forEach(function (el) { io.observe(el); });
  } else {
    fades.forEach(function (el) { el.classList.add("in"); });
  }

  // toast
  var toast = document.getElementById("toast"), tt = null;
  function note(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { toast.classList.remove("show"); }, 3000);
  }

  // links whose production destination isn't built in the prototype
  document.querySelectorAll("[data-proto]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (el.getAttribute("href") === "#") e.preventDefault();
      note("Prototype — in production this opens " + el.getAttribute("data-proto"));
    });
  });

  // quote forms: carry the address into the quote flow
  document.querySelectorAll("form[data-quote]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = f.querySelector("input");
      var addr = input ? input.value.trim() : "";
      location.href = "quote.html" + (addr ? "?addr=" + encodeURIComponent(addr) : "");
    });
  });

  // mock tools (flood-zone lookup etc.)
  document.querySelectorAll("form[data-mock]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      note(f.getAttribute("data-mock"));
    });
  });

  // storm center: print the checklist for real
  var printBtn = document.getElementById("printBtn");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  // review carousel (home)
  var box = document.getElementById("carousel");
  if (box) {
    var slides = [].slice.call(box.querySelectorAll(".slide"));
    var dots = [].slice.call(document.querySelectorAll(".dotb"));
    var idx = 0, timer = null;
    var show = function (i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("active", n === idx); });
      dots.forEach(function (d, n) { n === idx ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current"); });
    };
    var play = function () { if (!reduced) timer = setInterval(function () { show(idx + 1); }, 6500); };
    var stop = function () { clearInterval(timer); };
    dots.forEach(function (d, n) { d.addEventListener("click", function () { stop(); show(n); play(); }); });
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", function () { stop(); play(); });
    play();
  }
})();

/* ============ v4: storm mode demo (site-wide state) ============ */
(function () {
  var KEY = "hh_storm_demo";
  function applyStorm(on) {
    document.documentElement.classList.toggle("storm", on);
    var t = document.getElementById("stormToggle");
    if (t) { t.textContent = "Storm Mode demo: " + (on ? "ON" : "off"); t.setAttribute("aria-pressed", String(on)); }
  }

  // controls injected into the prototype banner on every page
  var proto = document.querySelector(".proto");
  if (proto) {
    var tog = document.createElement("button");
    tog.id = "stormToggle"; tog.type = "button"; tog.className = "protobtn";
    proto.appendChild(document.createTextNode(" · "));
    proto.appendChild(tog);
    var sg = document.createElement("a");
    sg.href = "styleguide.html"; sg.className = "protolink"; sg.textContent = "style guide";
    proto.appendChild(document.createTextNode(" · "));
    proto.appendChild(sg);
    tog.addEventListener("click", function () {
      var on = !document.documentElement.classList.contains("storm");
      try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) {}
      applyStorm(on);
    });
  }

  // advisory bar lives directly under the header on every page
  var hdrEl = document.getElementById("hdr");
  if (hdrEl) {
    var ab = document.createElement("div");
    ab.className = "alertbar";
    ab.setAttribute("role", "status");
    ab.innerHTML = '<span class="live" aria-hidden="true"></span><b>Storm advisory (demo):</b> tropical system approaching the Gulf — carriers have paused new binding. Claims &amp; help: <a href="tel:7274985551">(727) 498-5551</a> · <a href="storm-center.html#claims">First-48-hours guide</a>';
    hdrEl.insertAdjacentElement("afterend", ab);
  }

  var on0 = false;
  try { on0 = localStorage.getItem(KEY) === "1"; } catch (e) {}
  applyStorm(on0);
})();

/* ============ v5: Ask HH — instant answers (curated demo of the production RAG engine) ============ */
(function () {
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SITE = "https://www.hhinsgroup.com";

  var KB = [
    { q: "Do I need flood insurance if I'm not in a flood zone?",
      k: ["flood","zone","need","low","risk","rising","water"],
      a: "Every Florida address is in a flood zone — just zones with different letters. FEMA says <b>20–25% of flood claims come from outside high-risk zones</b>, and homeowners policies never cover rising water. The upside: in lower-risk zones, flood coverage is usually at its cheapest.",
      src: { label: "How flood insurance works", href: SITE + "/how-does-flood-insurance-work/", ext: true } },
    { q: "What is a hurricane deductible?",
      k: ["hurricane","deductible","percent","wind","named"],
      a: "A separate deductible — usually <b>2%, 5%, or 10% of your dwelling coverage</b>, not a flat dollar amount — that applies when a named hurricane causes the damage. On a $400k home, 2% means $8,000 out of pocket. In Florida it applies once per calendar year, not per storm.",
      src: { label: "Buying your first Florida homeowners policy", href: SITE + "/first-homeowners-insurance-policy/", ext: true } },
    { q: "Why do Florida premiums keep rising?",
      k: ["premium","rising","expensive","rates","increase","crisis","cost","high"],
      a: "A decade of litigation abuse, costly reinsurance, and back-to-back storm years pushed Florida's average premium to roughly <b>4× the national average</b>. The 2022–23 legal reforms are showing early signs of stabilizing rates, but relief reaches renewals slowly. Shopping 40+ carriers each renewal is the practical countermove.",
      src: { label: "Florida's market: from rate hikes to stability", href: SITE + "/floridas-2025-insurance-market/", ext: true } },
    { q: "What's an AOB — should I sign one after a storm?",
      k: ["aob","assignment","benefits","sign","contractor","roofer","door"],
      a: "An assignment of benefits hands a contractor the right to bill — and sue — your insurer directly under your policy. Florida's 2023 reforms banned AOBs on new property policies, but post-storm door-knockers still push lookalike contracts. <b>Don't sign anything on the driveway</b> — send it to us first; reading it is free.",
      src: { label: "Claims: the first 48 hours", href: "storm-center.html#claims" } },
    { q: "What is a wind mitigation inspection?",
      k: ["wind","mitigation","inspection","credits","discount","mit"],
      a: "A ~$150 inspection documenting how your home resists wind — roof shape, attachments, opening protection. Florida law requires carriers to credit what it finds, and <b>10–20% savings are common</b>. It usually pays for itself in the first month.",
      src: { label: "Run a quote and see the credits applied", href: "quote.html" } },
    { q: "NFIP or private flood — which should I buy?",
      k: ["nfip","private","flood","excess","compare","fema"],
      a: "NFIP is standardized and never non-renews you for claims, but caps at <b>$250k building / $100k contents</b> with no loss-of-use coverage. Private flood can offer higher limits, living-expense coverage, and faster start dates. We quote both side by side; excess flood stacks above whichever you pick.",
      src: { label: "Flood coverage at HH", href: "flood.html" } },
    { q: "What does “binding suspended” mean during a storm?",
      k: ["binding","box","pause","suspended","buy","storm","tropical"],
      a: "When a named storm enters the “box” near Florida, carriers temporarily stop issuing <b>new</b> coverage until it passes. Quotes still run, and we queue bind requests in order — coverage issues the moment carriers reopen. The lesson: buy on a calm Tuesday, not when a cone is on the news.",
      src: { label: "The Storm Center", href: "storm-center.html" } },
    { q: "What is Citizens — and is a takeout offer good or bad?",
      k: ["citizens","state","takeout","depopulation","last","resort"],
      a: "Citizens is Florida's state-backed insurer of last resort — real coverage, but by law it pushes policies back to private carriers. If a takeout offer lands <b>within 20% of your Citizens premium</b>, declining it can cost you Citizens eligibility. We compare the takeout against the whole market before you decide.",
      src: { label: "Why premiums keep rising (and what reform changed)", href: SITE + "/the-florida-insurance-crisis-explained-why-premiums-keep-rising/", ext: true } },
    { q: "How much does umbrella insurance cost?",
      k: ["umbrella","million","liability","cost","cheap","extra"],
      a: "Most $1M personal umbrellas run about <b>$150–$200 a year</b> — the cheapest serious protection in insurance. It stacks liability coverage above your home, auto, and boat policies. Pool, boat, dock, or teen driver? It's rarely optional in practice.",
      src: { label: "Is an umbrella policy right for me?", href: SITE + "/what-is-umbrella-insurance-and-is-it-right-for-me/", ext: true } },
    { q: "How fast can I get a certificate of insurance?",
      k: ["coi","certificate","holder","additional","insured","fast"],
      a: "Through our business portal: <b>minutes, not days</b>. The platform drafts it from your live policy data, a licensed agent approves, and the holder gets it correctly named with the right endorsements — archived for your audit trail.",
      src: { label: "For business: skip the certificate wait", href: "business.html" } },
    { q: "What is a four-point inspection?",
      k: ["four","point","inspection","older","home","roof","electrical","plumbing","hvac"],
      a: "For older Florida homes (typically 30–40+ years), carriers want a snapshot of four systems: <b>roof, electrical, plumbing, and HVAC</b>. It's how older homes qualify for standard markets instead of last-resort pricing. We'll tell you what inspectors flag most before you book one.",
      src: { label: "Buying your first Florida homeowners policy", href: SITE + "/first-homeowners-insurance-policy/", ext: true } },
    { q: "Is my screened enclosure covered?",
      k: ["screen","enclosure","lanai","pool","cage","carport"],
      a: "Often not the way people assume. Many Florida policies <b>exclude or sharply limit screened enclosures</b> for wind, and flood policies treat enclosure contents as mostly uncovered. After Helene and Milton this was the most common bad surprise — it's an easy endorsement to check.",
      src: { label: "Hurricane prep: flood & screen enclosures", href: SITE + "/flood-and-screen-enclosure/", ext: true } },
    { q: "What boat insurance do I actually need?",
      k: ["boat","marine","yacht","agreed","value","layup","haul"],
      a: "The big choice is <b>agreed value</b> (you get the number on the policy) versus actual cash value (depreciation applies). Florida specifics worth checking: named-storm haul-out plans, lay-up periods, and liability that matches your marina contract. We write everything from skiffs to boat builders.",
      src: { label: "Boat insurance, soup to nuts", href: SITE + "/boat-insurance-information/", ext: true } }
  ];

  /* shared brain: Ask HH overlay + the Concierge both match against this */
  function matchKB(q) {
    var toks = q.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
    var best = null, bestScore = 0;
    KB.forEach(function (e) {
      var s = 0;
      toks.forEach(function (t) { if (e.k.indexOf(t) !== -1) s++; });
      if (s > bestScore) { bestScore = s; best = e; }
    });
    return bestScore > 0 ? best : null;
  }
  window.HHKB = { entries: KB, match: matchKB };

  /* overlay markup */
  var ov = document.createElement("div");
  ov.className = "ask-overlay";
  ov.innerHTML =
    '<div class="ask-modal" role="dialog" aria-modal="true" aria-label="Ask HH">' +
      '<div class="ask-head">' +
        '<span class="mark" aria-hidden="true">HH?</span>' +
        '<input type="text" id="askInput" placeholder="Ask anything about Florida insurance…" aria-label="Your question">' +
        '<button class="ask-close" type="button" id="askClose">esc</button>' +
      '</div>' +
      '<div class="ask-body" id="askBody"></div>' +
      '<div class="ask-foot">' +
        '<span>Demo — curated answers; production draws on the full HH library. Educational, not advice.</span>' +
        '<span>Rather talk? <a href="tel:7274985551">(727) 498-5551</a> · 7am</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(ov);

  var input = ov.querySelector("#askInput");
  var body = ov.querySelector("#askBody");
  var lastFocus = null;

  function chipsHTML(label, items) {
    return '<p class="ask-label">' + label + '</p><div class="ask-chips">' +
      items.map(function (e) { return '<button type="button" data-q="' + e.q.replace(/"/g, "&quot;") + '">' + e.q + '</button>'; }).join("") +
      '</div>';
  }
  function home() {
    body.innerHTML = chipsHTML("People ask us", KB.slice(0, 6).concat(KB.slice(8, 10)));
  }
  function srcHTML(src) {
    return '<p class="ask-src">Source: <a href="' + src.href + '"' + (src.ext ? ' target="_blank" rel="noopener"' : "") + '>' + src.label + ' →</a></p>';
  }
  function answer(q) {
    var best = matchKB(q);
    if (best) {
      body.innerHTML =
        '<div class="ask-ans"><p class="qecho">You asked</p><h3>' + best.q + '</h3>' +
        '<p>' + best.a + '</p>' + srcHTML(best.src) +
        '<div class="ask-more">' + chipsHTML("Keep going", KB.filter(function (e) { return e !== best; }).slice(0, 3)) + '</div></div>';
    } else {
      body.innerHTML =
        '<div class="ask-ans"><p class="qecho">You asked</p><h3>That one deserves a human.</h3>' +
        '<p>We\'d rather connect you than guess. Call <b>(727) 498-5551</b> — phones open at 7am and a licensed agent answers, not a queue. Or start a quote and leave a note with your question.</p>' +
        '<p class="ask-src"><a href="quote.html">Start an instant quote →</a></p>' +
        '<div class="ask-more">' + chipsHTML("Or try one of these", KB.slice(0, 4)) + '</div></div>';
    }
  }

  body.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-q]");
    if (b) { input.value = b.getAttribute("data-q"); answer(input.value); input.focus(); }
  });

  var debounce = null;
  input.addEventListener("input", function () {
    clearTimeout(debounce);
    var v = input.value.trim();
    debounce = setTimeout(function () { v.length >= 3 ? answer(v) : home(); }, reduced ? 0 : 220);
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); if (input.value.trim()) answer(input.value.trim()); }
  });

  function open() {
    lastFocus = document.activeElement;
    ov.classList.add("open");
    input.value = "";
    home();
    input.focus();
  }
  function close() {
    ov.classList.remove("open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  ov.addEventListener("mousedown", function (e) { if (e.target === ov) close(); });
  ov.querySelector("#askClose").addEventListener("click", close);

  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); ov.classList.contains("open") ? close() : open(); return; }
    if (e.key === "Escape" && ov.classList.contains("open")) { close(); return; }
    if (e.key === "/" && !ov.classList.contains("open")) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      e.preventDefault(); open();
    }
    /* focus trap */
    if (e.key === "Tab" && ov.classList.contains("open")) {
      var els = ov.querySelectorAll("button, input, a[href]");
      if (!els.length) return;
      var first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* entry point in the main nav (pages with the standard menu) */
  var navList = document.getElementById("navList");
  if (navList) {
    var li = document.createElement("li");
    var b = document.createElement("button");
    b.type = "button"; b.className = "ask-open";
    b.innerHTML = 'Ask a question<kbd>⌘K</kbd>';
    li.appendChild(b);
    navList.appendChild(li);
  }
  /* any in-page .ask-open triggers */
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".ask-open");
    if (t) { e.preventDefault(); open(); }
  });
})();

/* ============ v6.1: Concierge engine — runs wherever #chatlog exists (homepage panel + full page) ============ */
(function () {
  var log = document.getElementById("chatlog");
  if (!log || !window.HHKB) return;

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var KB = window.HHKB;
  var embedded = !!log.closest(".chatpanel");

  /* ---------- rendering ---------- */
  function scrollEnd() {
    requestAnimationFrame(function () {
      if (embedded) log.scrollTo({ top: log.scrollHeight, behavior: reduced ? "auto" : "smooth" });
      else window.scrollTo({ top: document.body.scrollHeight, behavior: reduced ? "auto" : "smooth" });
    });
  }
  function userSay(text) {
    var m = document.createElement("div");
    m.className = "msg user";
    var b = document.createElement("div");
    b.className = "bubble";
    b.textContent = text;
    m.appendChild(b);
    log.appendChild(m);
    scrollEnd();
  }
  function botSay(html, cb) {
    var m = document.createElement("div");
    m.className = "msg bot";
    m.innerHTML = '<span class="ava" aria-hidden="true">HH</span><div class="bubble typing-bubble"><i></i><i></i><i></i></div>';
    log.appendChild(m);
    scrollEnd();
    var delay = reduced ? 0 : Math.min(420 + html.length * 1.4, 1100);
    setTimeout(function () {
      var b = m.querySelector(".bubble");
      b.className = "bubble";
      b.innerHTML = html;
      scrollEnd();
      if (cb) cb();
    }, delay);
  }
  function chips(items) {
    var row = document.createElement("div");
    row.className = "chiprow";
    items.forEach(function (it) {
      var el;
      if (it.href) {
        el = document.createElement("a");
        el.href = it.href;
        if (it.ext) { el.target = "_blank"; el.rel = "noopener"; }
      } else {
        el = document.createElement("button");
        el.type = "button";
        el.addEventListener("click", function () {
          row.classList.add("used");
          userSay(it.label.replace(/\s*→$/, ""));
          it.go();
        });
      }
      if (it.primary) el.className = "primary";
      el.textContent = it.label;
      row.appendChild(el);
    });
    log.appendChild(row);
    scrollEnd();
  }
  function srcLine(src) {
    var ext = src.ext ? ' target="_blank" rel="noopener"' : "";
    return '<span class="src">Source: <a href="' + src.href + '"' + ext + ">" + src.label + " →</a></span>";
  }

  /* ---------- journeys ---------- */
  var storm = document.documentElement.classList.contains("storm");

  function greet() {
    if (storm) {
      botSay("Heads up before anything else: a tropical system is approaching the Gulf <i>(demo)</i>. Carriers have paused <b>new</b> binding — quotes still run, claims lines are open, and the <a class='tlink' href='storm-center.html#claims'>first-48-hours guide</a> is one tap away.", greetMain);
    } else {
      greetMain();
    }
  }
  function greetMain() {
    botSay("Hi — I'm the <b>HH Concierge</b>. Behind me: 45+ licensed humans in St.&nbsp;Pete, phones on at 7am. So I point you the right way — are you a <b>new customer</b>, an <b>existing client</b>, or just <b>looking for information</b>?", function () {
      chips([
        { label: "I'm new — I need coverage", go: journeyNew },
        { label: "I'm an HH client", go: journeyExisting },
        { label: "Just researching", go: journeyResearch }
      ]);
    });
  }

  /* --- new customer --- */
  function journeyNew() {
    botSay("Welcome! What are we covering?", function () {
      chips([
        { label: "Home", go: function () { line("Home"); } },
        { label: "Flood", go: function () { line("Flood"); } },
        { label: "Auto", go: function () { line("Auto"); } },
        { label: "Boat & Marine", go: function () { line("Boat & Marine"); } },
        { label: "Business", go: function () { line("Business"); } },
        { label: "A few things", go: bundle }
      ]);
    });
  }
  function line(l) {
    botSay("Good news — we shop <b>40+ carriers</b> for " + l.toLowerCase() + ". I can get you real numbers with just an address: no SSN, no spam calls, about 3 minutes." + (storm ? " <i>(Binding is paused while the storm is in the box — your quote holds and we bind the moment it lifts.)</i>" : ""), function () {
      chips([
        { label: "Start my instant quote →", primary: true, href: "quote.html?line=" + encodeURIComponent(l) },
        { label: "I have questions first", go: questionsFirst },
        { label: "Talk to a human", go: human }
      ]);
    });
  }
  function bundle() {
    botSay("Bundling is our favorite sport — home + flood + auto + the boat usually beats four separate carriers. Easiest path: start the home quote and tell your agent what else you've got, or just call and we'll do it all in one conversation.", function () {
      chips([
        { label: "Start with the home quote →", primary: true, href: "quote.html?line=Home" },
        { label: "Call (727) 498-5551", href: "tel:7274985551" }
      ]);
    });
  }
  function questionsFirst() {
    botSay("Ask away — flood zones, hurricane deductibles, why premiums went up, anything. I answer from our published guides and hand anything personal straight to a human.", function () {
      chips([
        { label: "Do I need flood insurance?", go: function () { freeText("Do I need flood insurance if I'm not in a flood zone?"); } },
        { label: "What's a hurricane deductible?", go: function () { freeText("What is a hurricane deductible?"); } },
        { label: "Why did premiums go up?", go: function () { freeText("Why do Florida premiums keep rising?"); } }
      ]);
    });
  }

  /* --- existing client --- */
  function journeyExisting() {
    botSay("Welcome back. What do you need today?", function () {
      chips([
        { label: "Certificate of insurance", go: coi },
        { label: "Policy question", go: policyQ },
        { label: "Make a change", go: change },
        { label: "Claim help", go: claim },
        { label: "Billing", go: billing }
      ]);
    });
  }
  function coi() {
    botSay("Fastest path: the <b>business portal</b> — certificates in minutes, drafted from your live policy data and approved by a licensed agent before they send. Email works too: <a class='tlink' href='mailto:csr@hhinsgroup.com'>csr@hhinsgroup.com</a>.", function () {
      chips([
        { label: "See the portal →", primary: true, href: "business.html" },
        { label: "Call (727) 498-5551", href: "tel:7274985551" },
        { label: "Something else", go: journeyExisting }
      ]);
    });
  }
  function policyQ() {
    botSay("Ask here and I'll answer from our guides. One honest limit, by design: <b>I can't read your actual policy in chat</b> — anything specific to your coverage goes to your agent, who can.", function () {
      chips([
        { label: "Is my screened enclosure covered?", go: function () { freeText("Is my screened enclosure covered?"); } },
        { label: "Talk to my agent", go: human }
      ]);
    });
  }
  function change() {
    botSay("Email <a class='tlink' href='mailto:csr@hhinsgroup.com'>csr@hhinsgroup.com</a> with your name and the change — same-day during business hours, and you'll have it in writing. Prefer voices? Phones open at 7am.", function () {
      chips([
        { label: "Email the change", primary: true, href: "mailto:csr@hhinsgroup.com" },
        { label: "Call (727) 498-5551", href: "tel:7274985551" },
        { label: "Something else", go: journeyExisting }
      ]);
    });
  }
  function claim() {
    botSay("First: are you safe? Then <b>document before you clean up</b> — photos of everything. The first-48-hours guide walks every step (including what <i>not</i> to sign on the driveway), and if you call us we'll get the carrier on the line with you.", function () {
      chips([
        { label: "First-48-hours guide →", primary: true, href: "storm-center.html#claims" },
        { label: "Call now", href: "tel:7274985551" }
      ]);
    });
  }
  function billing() {
    botSay("Billing runs through your carrier, but we untangle it daily. Call with your policy number and we'll chase it — or email <a class='tlink' href='mailto:csr@hhinsgroup.com'>csr@hhinsgroup.com</a> and consider it chased.", function () {
      chips([
        { label: "Call (727) 498-5551", primary: true, href: "tel:7274985551" },
        { label: "Email csr@", href: "mailto:csr@hhinsgroup.com" },
        { label: "Something else", go: journeyExisting }
      ]);
    });
  }

  /* --- researching --- */
  function journeyResearch() {
    botSay("Smart — Florida insurance rewards homework. Pick a topic, or just type a question:", function () {
      chips([
        { label: "Flood, explained", go: function () { freeText("Do I need flood insurance if I'm not in a flood zone?"); } },
        { label: "Why premiums are high", go: function () { freeText("Why do Florida premiums keep rising?"); } },
        { label: "Hurricane prep", go: prep },
        { label: "Who is HH?", go: whoHH }
      ]);
    });
  }
  function prep() {
    botSay("The Storm Center has the <b>2026 prep checklist</b> — ten minutes on a calm day, printable, because it's the version you'll still have when the power's out. Plus the flood-zone lookup and the first-48-hours claims guide.", function () {
      chips([
        { label: "Open the Storm Center →", primary: true, href: "storm-center.html" },
        { label: "Another question", go: askMore }
      ]);
    });
  }
  function whoHH() {
    botSay("Family roots in Florida insurance since <b>1979</b>. In 2018, Jake and Ron Holehouse restarted from zero in St.&nbsp;Pete — three people, no policies. Today: <b>45+ licensed pros</b>, a CPCU-led team, our own AI service platform, and the agency Tampa Bay TV calls when the market needs explaining.", function () {
      chips([
        { label: "Meet the team →", href: "about.html" },
        { label: "Read reviews →", href: "reviews.html" },
        { label: "Another question", go: askMore }
      ]);
    });
  }
  function askMore() {
    botSay("Go ahead — type anything.", function () { if (input) input.focus(); });
  }

  /* --- human handoff --- */
  function human() {
    botSay("<b>(727) 498-5551</b> — Mon–Fri, 7:00am–5:30pm ET. A licensed Floridian answers, not a queue. After hours, email <a class='tlink' href='mailto:sales@hhinsgroup.com'>sales@hhinsgroup.com</a> and you'll hear back first thing.", function () {
      chips([
        { label: "Call now", primary: true, href: "tel:7274985551" },
        { label: "Email us", href: "mailto:sales@hhinsgroup.com" },
        { label: "Keep chatting", go: askMore }
      ]);
    });
  }

  /* ---------- free text ---------- */
  var addressish = /\d+\s+\w+.*\b(st|street|ave|avenue|blvd|boulevard|rd|road|dr|drive|way|ln|lane|ct|court|hwy)\b/i;
  function freeText(q) {
    var looksAddress = addressish.test(q) || /\b3[2-4]\d{3}\b/.test(q);
    if (looksAddress) {
      botSay("That looks like an address — want me to run it through the instant quote? Real numbers from 40+ carriers in about 3 minutes.", function () {
        chips([
          { label: "Yes — quote it →", primary: true, href: "quote.html?addr=" + encodeURIComponent(q) },
          { label: "No, I had a question", go: askMore }
        ]);
      });
      return;
    }
    var hit = KB.match(q);
    if (hit) {
      botSay(hit.a + srcLine(hit.src), function () {
        chips([
          { label: "Another question", go: askMore },
          { label: "Start a quote →", href: "quote.html" },
          { label: "Talk to a human", go: human }
        ]);
      });
    } else {
      botSay("That one deserves a human — I'd rather connect you than guess. <b>(727) 498-5551</b>, phones at 7am. Or try one of these:", function () {
        chips([
          { label: "Talk to a human", primary: true, go: human },
          { label: KB.entries[0].q, go: function () { freeText(KB.entries[0].q); } },
          { label: KB.entries[6].q, go: function () { freeText(KB.entries[6].q); } }
        ]);
      });
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) return;
      input.value = "";
      userSay(v);
      freeText(v);
    });
  }

  greet();
})();
