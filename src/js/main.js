// Path prefix from the current page back to the site root ("./", "../" or
// "../../"), read from this script's own src. Must run synchronously: after
// the page has loaded, document.currentScript is null.
const SITE_ROOT =
  (document.currentScript?.getAttribute("src") ?? "").replace(
    /src\/js\/main\.js.*$/,
    ""
  ) || "./";

document.addEventListener("alpine:init", () => {
  // The intro plays only on a session's first visit to the top of the
  // landing page. Returning visits (sessionStorage flag) and deep links
  // to any anchor other than #home land directly on the hero.
  const INTRO_SEEN_KEY = "klanmedic-intro-seen";

  const isIntroSeen = () => {
    try {
      return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {
      return false;
    }
  };

  const markIntroSeen = () => {
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // Private browsing etc. — the intro replaying is the safe fallback.
    }
  };

  const isDeepLink = () => {
    const hash = window.location.hash;
    return hash !== "" && hash !== "#home";
  };

  Alpine.store("intro", {
    entered: false,
    ready: false,
    compact: false,
    hasIntro: false, // true on the landing page, where heroIntro gates the header
  });

  // ---- Site search ------------------------------------------------------
  // The index lives in src/js/search-index.js (window.KLANMEDIC_SEARCH, edited
  // by hand). It is loaded on the first click on the search icon, so pages
  // that never search never download it. Matching ignores case and
  // diacritics, and every typed word has to match somewhere in an entry.
  const MAX_SEARCH_RESULTS = 8;

  const normalize = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

  let searchIndex = null; // prepared entries, null until the file has loaded
  let searchLoading = null; // in-flight load, shared by repeated clicks

  const prepareIndex = (entries) =>
    entries.map((entry) => ({
      entry,
      title: normalize(entry.title),
      section: normalize(entry.section ?? ""),
      extra: normalize(`${entry.keywords ?? ""} ${entry.syn ?? ""}`),
      desc: normalize(entry.desc ?? ""),
    }));

  const loadSearchIndex = () => {
    if (searchIndex) return Promise.resolve(searchIndex);
    if (!searchLoading) {
      searchLoading = new Promise((resolve, reject) => {
        const finish = () => {
          searchIndex = prepareIndex(window.KLANMEDIC_SEARCH ?? []);
          resolve(searchIndex);
        };
        if (window.KLANMEDIC_SEARCH) return finish();
        const script = document.createElement("script");
        script.src = `${SITE_ROOT}src/js/search-index.js`;
        script.onload = finish;
        script.onerror = () => {
          searchLoading = null; // allow a retry on the next open
          script.remove();
          reject(new Error("search index failed to load"));
        };
        document.head.appendChild(script);
      });
    }
    return searchLoading;
  };

  // Ranking: each typed word scores in every field it appears in — title
  // (starts with it / has it at a word start 30, otherwise contains it 20),
  // section 12, keywords + synonyms 10, description 6 — so an entry that
  // matches in several places outranks one that matches in one. Ties keep the
  // order of the index file.
  const searchEntries = (query) => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length || !searchIndex) return [];
    const scored = [];
    searchIndex.forEach((item, order) => {
      let score = 0;
      for (const term of terms) {
        let termScore = 0;
        if (item.title.startsWith(term) || item.title.includes(` ${term}`))
          termScore += 30;
        else if (item.title.includes(term)) termScore += 20;
        if (item.section.includes(term)) termScore += 12;
        if (item.extra.includes(term)) termScore += 10;
        if (item.desc.includes(term)) termScore += 6;
        if (!termScore) return; // a word that matches nowhere drops the entry
        score += termScore;
      }
      scored.push({ entry: item.entry, score, order });
    });
    scored.sort((a, b) => b.score - a.score || a.order - b.order);
    return scored.slice(0, MAX_SEARCH_RESULTS).map((item) => item.entry);
  };

  // Site header: mobile menu state (open / servicesOpen / estetikaOpen) plus
  // the desktop mega-menu. `desk` is the panel that is open, `shown` is the
  // panel whose content stays rendered, so the content doesn't vanish while
  // the header is still sliding shut. The search drop panel (searchOpen,
  // query, active) lives here too, so the three can close one another.
  Alpine.data("siteHeader", () => ({
    open: false,
    servicesOpen: false,
    estetikaOpen: false,
    desk: null,
    shown: null,
    deskEst: false, // Estetika subpages expanded inside the services panel
    closeTimer: null,
    hoverable: window.matchMedia("(hover: hover)").matches,
    searchOpen: false,
    query: "",
    active: 0, // highlighted result (keyboard / hover)
    indexReady: false,
    searchFailed: false,
    siteRoot: SITE_ROOT,

    init() {
      this.$watch("query", () => {
        this.active = 0;
      });

      // Collapse the logo wordmark once the page is scrolled. Runs on every
      // page; on the landing page it waits until the intro has finished.
      let ticking = false;
      const syncCompact = () => {
        ticking = false;
        const intro = this.$store.intro;
        if (!intro.hasIntro || intro.ready) {
          intro.compact = window.scrollY > 0;
        }
      };
      window.addEventListener(
        "scroll",
        () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(syncCompact);
        },
        { passive: true }
      );
      syncCompact();
    },
    // indexReady is read so the list is recomputed once the index arrives.
    get results() {
      return this.indexReady ? searchEntries(this.query) : [];
    },
    openSearch() {
      this.closeDesk();
      this.open = false;
      this.servicesOpen = false;
      this.estetikaOpen = false;
      this.searchOpen = true;
      this.searchFailed = false;
      loadSearchIndex().then(
        () => {
          this.indexReady = true;
        },
        () => {
          this.searchFailed = true;
        }
      );
      this.$nextTick(() =>
        this.$refs.searchInput?.focus({ preventScroll: true })
      );
    },
    closeSearch(refocus = false) {
      if (!this.searchOpen) return;
      this.searchOpen = false;
      this.query = "";
      if (refocus) this.$refs.searchButton?.focus();
    },
    toggleSearch() {
      if (this.searchOpen) this.closeSearch();
      else this.openSearch();
    },
    moveActive(step) {
      const count = this.results.length;
      if (!count) return;
      this.active = (this.active + step + count) % count;
      this.$nextTick(() =>
        document
          .getElementById(`search-option-${this.active}`)
          ?.scrollIntoView({ block: "nearest" })
      );
    },
    goActive() {
      const entry = this.results[this.active];
      if (entry) this.go(null, entry);
    },
    // Follow a result. A different page navigates normally (the link's own
    // click, or location for Enter). On the same page nothing would reload, so
    // the hash is set by hand: that scrolls to section anchors, and the
    // subservices component listens for hashchange to open a card.
    go(event, entry) {
      const target = new URL(SITE_ROOT + entry.url, window.location.href);
      const here = window.location;
      const samePage =
        target.pathname === here.pathname && target.search === here.search;
      if (!samePage) {
        if (!event) here.href = target.href;
        // Closing re-renders the list; let the navigation start first.
        window.setTimeout(() => this.closeSearch(), 0);
        return;
      }
      event?.preventDefault();
      this.closeSearch();
      if (target.hash && target.hash !== here.hash) {
        here.hash = target.hash;
      } else {
        // Same hash again (e.g. the card was closed meanwhile): hashchange
        // will not fire by itself, so re-run it and scroll manually.
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        const section = target.hash
          ? document.querySelector(target.hash)
          : null;
        if (section && !target.hash.startsWith("#sub-"))
          section.scrollIntoView();
        else if (!target.hash) window.scrollTo(0, 0);
      }
    },

    openDesk(key) {
      clearTimeout(this.closeTimer);
      this.closeSearch();
      // switching panels (or reopening) always starts with Estetika collapsed
      if (this.desk !== key) this.deskEst = false;
      this.desk = this.shown = key;
    },
    toggleDesk(key) {
      if (this.desk === key) this.closeDesk();
      else this.openDesk(key);
    },
    closeDesk() {
      clearTimeout(this.closeTimer);
      this.desk = null;
      this.deskEst = false;
    },
    toggleEst() {
      this.deskEst = !this.deskEst;
    },
    closeDeskSoon() {
      clearTimeout(this.closeTimer);
      this.closeTimer = setTimeout(() => this.closeDesk(), 150);
    },
  }));

  Alpine.data("heroIntro", () => ({
    progress: 0,
    clicked: false,
    entered: false,
    navVisible: false,
    bigTextSize: 160,
    _ticking: false,
    init() {
      this.$store.intro.hasIntro = true;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const skip = reduced || isIntroSeen() || isDeepLink();
      if (skip) {
        this.progress = 1;
        this.entered = true;
        this.$store.intro.entered = true;
        this.$store.intro.ready = true;
        this.navVisible = true;
        markIntroSeen();
        if (reduced) return;
      }
      this.measureBigText();
      this.onScroll();
      this._onWheel = (event) => {
        if (this.$store.intro.ready) {
          if (event.deltaY > 0) this.$store.intro.compact = true;
        } else {
          this.enterIntro(true);
        }
      };
      window.addEventListener("wheel", this._onWheel, { passive: true });
      window.addEventListener("touchmove", this._onWheel, { passive: true });
      this._onScroll = () => {
        if (!this._ticking) {
          requestAnimationFrame(() => {
            this.onScroll();
            this._ticking = false;
          });
          this._ticking = true;
        }
      };
      window.addEventListener("scroll", this._onScroll, { passive: true });
      window.addEventListener("resize", this._onScroll, { passive: true });
    },
    measureBigText() {
      const el = this.$refs.bigText;
      if (!el) return;
      this.bigTextSize = parseFloat(getComputedStyle(el).fontSize);
    },
    onScroll() {
      // Once entered, siteHeader owns the logo's compact state.
      if (this.entered) return;
      this.measureBigText();
      const section = this.$refs.heroSection;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = sectionHeight - viewportHeight;
      const scrolled = -rect.top;

      // Any scroll gesture enters the hero using the same transition as a click.
      if (scrolled > 0) {
        this.enterIntro(true);
        return;
      }

      this.progress =
        scrollable > 0
          ? Math.max(0, Math.min(1, scrolled / scrollable))
          : 0;
      this.navVisible = this.progress >= 0.82;
      if (this.progress >= 0.98) this.enterIntro(true);
    },
    enterIntro(clicked = true) {
      if (this.entered) return;
      this.entered = true;
      this.$store.intro.entered = true;
      markIntroSeen();
      window.setTimeout(() => {
        this.$store.intro.ready = true;
        document.documentElement.classList.remove("overflow-hidden");
      }, 1200);
      this.clicked = clicked;
      this.progress = 1;
      this.navVisible = clicked || this.progress >= 0.82;
    },
    get bigTextStyle() {
      return { opacity: 1 };
    },
    get introLayerStyle() {
      return {
        opacity: this.entered
          ? 0
          : Math.max(0, 1 - Math.max(0, this.progress - 0.55) / 0.2),
      };
    },
    get introImageStyle() {
      return { opacity: 1 };
    },
    get finalStyle() {
      if (this.clicked) {
        return { opacity: 1 };
      }
      return {
        opacity: this.entered
          ? 1
          : Math.max(0, Math.min(1, (this.progress - 0.82) / 0.16)),
      };
    },
  }));

  Alpine.data("heroIntro2", () => ({
    progress: 0,
    minFontSize: 0,
    maxFontSize: 0,
    _ticking: false,
    init() {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) {
        this.progress = 1;
        return;
      }
      this.computeFontSizes();
      this.onScroll();
      this._onScroll = () => {
        if (!this._ticking) {
          requestAnimationFrame(() => {
            this.onScroll();
            this._ticking = false;
          });
          this._ticking = true;
        }
      };
      window.addEventListener("scroll", this._onScroll, { passive: true });
      window.addEventListener("resize", () => {
        this.computeFontSizes();
        this._onScroll();
      }, { passive: true });
    },
    computeFontSizes() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // "Klanmedic" (9 chars) at Fraunces 700, letter-spacing -0.04em
      // width ≈ 4.14 * fontSize; height = fontSize * 0.85
      const forWidth = vw / 4.14;
      const forHeight = vh / 0.85;
      this.maxFontSize = Math.max(forWidth, forHeight) * 1.05;
      this.minFontSize = vw * 0.08;
    },
    onScroll() {
      const section = this.$refs.hero2Section;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = sectionHeight - viewportHeight;
      const scrolled = -rect.top;
      this.progress =
        scrollable > 0
          ? Math.max(0, Math.min(1, scrolled / scrollable))
          : 0;
    },
    get textStyle() {
      const p = this.progress;
      const scaleP = Math.min(1, p / 0.5);
      const fontSize =
        this.minFontSize + scaleP * (this.maxFontSize - this.minFontSize);
      const opacity = p < 0.65 ? 1 : Math.max(0, 1 - (p - 0.65) / 0.15);
      return {
        fontSize: `${fontSize}px`,
        opacity,
      };
    },
    get sageStyle() {
      const p = this.progress;
      if (p < 0.5) return { opacity: 1 };
      return { opacity: Math.max(0, 1 - (p - 0.5) / 0.15) };
    },
    get heroStyle() {
      const p = this.progress;
      return {
        opacity: Math.max(0, Math.min(1, (p - 0.7) / 0.3)),
      };
    },
  }));

  Alpine.data("teamShowcase", () => ({
    selected: null,
    hovered: null,
    pulsing: false,
    displayedImage: "./src/images/meet_the_team.png",
    transitionTimer: null,
    _dwell: null,
    _observer: null,
    people: [
      {
        id: "ak",
        name: "Killy Aman",
        role: "Zdravnica",
        image: "./src/images/meet_the_team_ak.png",
        hotspot: "left-[43.5%] top-[34%] h-[50%] w-[15%]",
      },
      {
        id: "marko",
        name: "Dr. Anakhona",
        role: "Zdravnik",
        image: "./src/images/meet_the_team_marko.png",
        hotspot: "right-[5.5%] top-[20%] h-[70%] w-[15%]",
      },
      {
        id: "maja",
        name: "Maja Kovač",
        role: "Medicinska sestra",
      },
      {
        id: "jure",
        name: "Dr. Jure Novak",
        role: "Zobozdravnik",
      },
      {
        id: "ana",
        name: "Ana Horvat",
        role: "Fizioterapevtka",
      },
    ],
    get activePerson() {
      return this.people.find((person) => person.id === (this.hovered || this.selected));
    },
    get activeImage() {
      return this.activePerson?.image || "./src/images/meet_the_team.png";
    },
    init() {
      this.$watch("activeImage", (image) => {
        if (image === this.displayedImage) return;

        window.clearTimeout(this.transitionTimer);

        const intermediate = this.activePerson?.image
          ? this.activePerson.image.replace(".png", "_2.png")
          : "./src/images/meet_the_team.png";

        this.displayedImage = intermediate;
        this.transitionTimer = window.setTimeout(() => {
          this.displayedImage = image;
        }, 400);
      });
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this._observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this._observer.disconnect();
            this.pulsing = true;
            window.setTimeout(() => {
              this.pulsing = false;
            }, 1500);
          }
        }, { threshold: 0.5 });
        this._observer.observe(this.$refs.nameRow);
      }
    },
    preview(id) {
      window.clearTimeout(this._dwell);
      this._dwell = window.setTimeout(() => {
        this.hovered = id;
      }, 500);
    },
    cancelPreview() {
      window.clearTimeout(this._dwell);
      this.hovered = null;
    },
    select(person) {
      this.selected = this.selected === person.id ? null : person.id;
    },
  }));

  // Expandable subservice card grid used on storitve/*.html pages.
  // Items are passed inline from each page: x-data="subservices([...])".
  //
  // Interaction model: the selected card expands in place (it keeps its
  // row and becomes full-width) and the sibling cards glide out of the
  // way; the expanded panel then sits top-aligned just below the fixed
  // header. The card's own opacity is never cross-faded by Alpine
  // x-transition directives (the double fade caused the ghosting
  // flashes) — faces fade through CSS classes instead, and the layout
  // change is FLIP-animated in JS.
  //
  // NOTE: $el inside event handlers is the element the handler is on (a
  // card button), so the component root (the grid) is captured at init.
  Alpine.data("subservices", (items) => ({
    items,
    selected: null,
    shown: false,
    closing: false,
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    _root: null,
    _returnFocus: null,
    _scrollRaf: 0,
    _gen: 0,
    _animating: false,
    _settleTimer: 0,
    init() {
      this._root = this.$el;
      // A link to "#sub-<slug>" (search results, shared links) opens that
      // card: on load, and whenever the hash changes on this page. The
      // x-for cards render right after init, hence the deferred call. It is a
      // timeout rather than $nextTick on purpose: select() queues its own
      // $nextTick, and one queued from inside a $nextTick callback runs
      // before Alpine has applied the state change, so the panel would still
      // be hidden when select() measures where to scroll.
      window.addEventListener("hashchange", () => this.openFromHash());
      window.setTimeout(() => this.openFromHash(), 0);
      if (this.reduced) {
        this.shown = true;
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.shown = true;
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(this.$el);
    },
    openFromHash() {
      const match = /^#sub-(.+)$/.exec(window.location.hash);
      if (!match) return;
      const index = this.items.findIndex((item) => item.slug === match[1]);
      if (index === -1) return;
      this.shown = true; // do not wait for the scroll reveal
      this.select(index);
    },
    isOpen(index) {
      return this.selected === index;
    },
    cards() {
      return Array.from(this._root.querySelectorAll("[data-card]"));
    },
    glideScroll(targetY) {
      const target = Math.max(0, targetY);
      window.cancelAnimationFrame(this._scrollRaf);
      if (this.reduced) {
        window.scrollTo(0, target);
        return;
      }
      const startY = window.scrollY;
      const delta = target - startY;
      if (Math.abs(delta) < 1) return;
      const duration = 1000;
      const started = performance.now();
      const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
      const step = (now) => {
        const p = Math.min(1, (now - started) / duration);
        window.scrollTo(0, startY + delta * ease(p));
        if (p < 1) this._scrollRaf = window.requestAnimationFrame(step);
      };
      this._scrollRaf = window.requestAnimationFrame(step);
    },
    // FLIP the grid reflow: every card's viewport rect is captured
    // before the state change; the returned callback runs in $nextTick —
    // after Alpine has applied the new layout, still before the next
    // paint. There:
    //   - sibling cards are inverted with translate(x, y) only, so they
    //     glide to their new slots on both axes (the old version saved
    //     just `.top`, which made horizontal moves jump);
    //   - the guard (the card being expanded/collapsed) flies from its
    //     old rect to the new one with translate+scale, pivoting on its
    //     top-left corner, above the siblings.
    // The inversions are applied synchronously before the next paint, so
    // the morphing card never flashes at full size. A short settle
    // window ignores new clicks, so quick selections cannot race the
    // flight, and stale flights are aborted through the generation
    // counter. Card content crossfades are CSS-only (`.card-face` /
    // `.panel-inner` keyed off the `.is-open` class).
    planFlip(guard) {
      if (this.reduced || !this._root || !guard) return null;
      const gen = (this._gen += 1);
      const rects = new Map(
        this.cards().map((card) => [card, card.getBoundingClientRect()])
      );
      const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
      const clear = () => {
        this.cards().forEach((card) => {
          card.style.transform = "";
          card.style.transition = "";
          card.style.transformOrigin = "";
          card.style.zIndex = "";
        });
        this._root.classList.remove("is-animating");
        this._animating = false;
      };
      return () => {
        if (gen !== this._gen) return;
        this._root.classList.add("is-animating");
        this._animating = true;
        const siblings = [];
        let shell = null;
        this.cards().forEach((card) => {
          const from = rects.get(card);
          const to = card.getBoundingClientRect();
          const dx = from.left - to.left;
          const dy = from.top - to.top;
          if (card === guard) {
            const sx = from.width / to.width;
            const sy = from.height / to.height;
            if (
              Math.abs(dx) + Math.abs(dy) < 1 &&
              Math.abs(1 - sx) < 0.01 &&
              Math.abs(1 - sy) < 0.01
            )
              return;
            shell = card;
            card.style.transformOrigin = "top left";
            card.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
            // Fly over the siblings (DOM paint order would otherwise put
            // the first card underneath the rest).
            card.style.zIndex = "30";
          } else {
            if (Math.abs(dx) + Math.abs(dy) < 1) return;
            siblings.push(card);
            card.style.transform = `translate(${dx}px, ${dy}px)`;
          }
        });
        void this._root.offsetWidth; // commit the inversions
        window.requestAnimationFrame(() => {
          if (gen !== this._gen) return;
          if (shell) {
            shell.style.transition = `transform 880ms ${ease}`;
            shell.style.transform = "";
          }
          siblings.forEach((card) => {
            card.style.transition = `transform 880ms ${ease}`;
            card.style.transform = "";
          });
        });
        window.clearTimeout(this._settleTimer);
        this._settleTimer = window.setTimeout(() => {
          if (gen !== this._gen) return;
          clear();
        }, 1000);
      };
    },
    select(index) {
      if (this.isOpen(index) || this._animating || this.closing) return;
      const card = this.cards()[index];
      if (!card) return;
      if (this.selected === null) this._returnFocus = document.activeElement;
      const finishFlip = this.planFlip(card);
      this.selected = index;
      const panel = card.querySelector(".sub-panel");
      if (!panel) return;
      const land = (framesLeft) => {
        if (this.selected !== index) return;
        // Right after a page load (a search result or shared link) the
        // x-show update can still be pending here. A hidden panel has no
        // position to scroll to, so wait for it to be laid out.
        if (panel.offsetParent === null && framesLeft > 0) {
          window.requestAnimationFrame(() => land(framesLeft - 1));
          return;
        }
        panel.focus({ preventScroll: true });
        // Document-space target measured before the flight: transforms
        // and scroll never change layout coordinates, so the flight and
        // the glide can run together and still land top-aligned with the
        // viewport, just below the fixed header. It is read from offsetTop
        // (layout) rather than getBoundingClientRect(), which would include
        // the card's reveal transform (translateY) while the cards are
        // still fading in after a page load.
        let top = 0;
        for (let el = panel; el; el = el.offsetParent) top += el.offsetTop;
        finishFlip?.();
        this.glideScroll(top - 88);
      };
      this.$nextTick(() => land(10));
    },
    // Close uses the same FLIP as open, in reverse. Keep the expanded
    // panel visible but out of flow while the grid returns to its compact
    // layout, so it can crossfade over the compact face during the flight.
    // The page then glides so the closed card is centered in the area
    // below the fixed header.
    close() {
      if (this.selected === null || this._animating || this.closing) return;
      const card = this.cards()[this.selected];
      if (!card) return;
      const finishFlip = this.planFlip(card);
      if (!this.reduced) {
        this.closing = true;
        card.classList.add("is-closing");
      }
      this.selected = null;
      this.$nextTick(() => {
        // Measure before finishFlip() applies its inversion transforms, so
        // the rect is the card's final compact layout box.
        const rect = card.getBoundingClientRect();
        const header = 88; // fixed header height, same offset select() uses
        const target =
          window.scrollY +
          rect.top +
          rect.height / 2 -
          (header + (window.innerHeight - header) / 2);
        finishFlip?.();
        const el = this._returnFocus;
        this._returnFocus = null;
        if (el && document.contains(el)) el.focus({ preventScroll: true });
        this.glideScroll(target);
        if (!this.reduced) {
          // Keep in sync with the close crossfade in input.css.
          window.setTimeout(() => {
            this.closing = false;
            card.classList.remove("is-closing");
          }, 450);
        }
      });
    },
  }));
});

