document.addEventListener("alpine:init", () => {
  Alpine.data("counter", () => ({
    count: 0,
    init() {
      console.log("Klanmedic site ready");
    },
  }));

  Alpine.data("heroIntro", () => ({
    progress: 0,
    navVisible: false,
    bigTextSize: 160,
    _ticking: false,
    init() {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) {
        this.progress = 1;
        this.navVisible = true;
        return;
      }
      this.measureBigText();
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
      window.addEventListener("resize", this._onScroll, { passive: true });
    },
    measureBigText() {
      const el = this.$refs.bigText;
      if (!el) return;
      this.bigTextSize = parseFloat(getComputedStyle(el).fontSize);
    },
    onScroll() {
      this.measureBigText();
      const section = this.$refs.heroSection;
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
      this.navVisible = this.progress > 0.28;
    },
    get bigTextStyle() {
      const p = this.progress;
      const travelFrac = Math.min(1, p / 0.35);
      const targetScale = 28 / this.bigTextSize;
      const scale = 1 - travelFrac * (1 - targetScale);
      const tx = -43 * travelFrac;
      const ty = -47 * travelFrac;
      return {
        transform: `translate(${tx}vw, ${ty}vh) scale(${scale})`,
        opacity: p < 0.35 ? 1 : Math.max(0, 1 - (p - 0.35) / 0.15),
      };
    },
    get introImageStyle() {
      const p = this.progress;
      return {
        opacity: Math.max(0, 1 - p * 2.5),
        transform: `scale(${1 - p * 0.08})`,
      };
    },
    get finalStyle() {
      const p = this.progress;
      const opacity = Math.max(0, Math.min(1, (p - 0.5) / 0.3));
      return { opacity };
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

