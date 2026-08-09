document.addEventListener("alpine:init", () => {
  Alpine.store("intro", {
    entered: false,
    ready: false,
  });

  Alpine.data("counter", () => ({
    count: 0,
    init() {
      console.log("Klanmedic site ready");
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
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) {
        this.progress = 1;
        this.entered = true;
        this.$store.intro.entered = true;
        this.$store.intro.ready = true;
        this.navVisible = true;
        return;
      }
      this.measureBigText();
      this.onScroll();
      this._onWheel = () => this.enterIntro(true);
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
});

