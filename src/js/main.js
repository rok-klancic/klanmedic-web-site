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
  });

  Alpine.data("heroIntro", () => ({
    progress: 0,
    clicked: false,
    entered: false,
    navVisible: false,
    bigTextSize: 160,
    _ticking: false,
    init() {
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
      if (this.entered) {
        if (this.$store.intro.ready) {
          this.$store.intro.compact = window.scrollY > 0;
        }
        return;
      }
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
      this.$nextTick(() => {
        if (this.selected !== index) return;
        const panel = card.querySelector(".sub-panel");
        if (!panel) return;
        panel.focus({ preventScroll: true });
        // Document-space target measured before the flight: transforms
        // and scroll never change layout coordinates, so the flight and
        // the glide can run together and still land top-aligned with the
        // viewport, just below the fixed header.
        const target =
          panel.getBoundingClientRect().top + window.scrollY - 88;
        finishFlip?.();
        this.glideScroll(target);
      });
    },
    // Close runs as the mirrored twin of the open crossfade: while the
    // card is marked .is-closing, the expanded panel dissolves out
    // (panel-hide) over the compact face that has returned beneath it;
    // only after the dissolve does the layout flip back and the
    // siblings glide home.
    close() {
      if (this.selected === null || this._animating || this.closing) return;
      const card = this.cards()[this.selected];
      if (!card) return;
      const finish = () => {
        this.closing = false;
        card.classList.remove("is-closing");
        const finishFlip = this.planFlip(card);
        this.selected = null;
        this.$nextTick(() => {
          finishFlip?.();
          const el = this._returnFocus;
          this._returnFocus = null;
          if (el && document.contains(el)) el.focus({ preventScroll: true });
          if (this._root) {
            this.glideScroll(
              window.scrollY + this._root.getBoundingClientRect().top - 88
            );
          }
        });
      };
      if (this.reduced) {
        finish();
        return;
      }
      this.closing = true;
      card.classList.add("is-closing");
      window.setTimeout(finish, 440);
    },
  }));
});

