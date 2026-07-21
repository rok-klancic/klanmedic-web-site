document.addEventListener("alpine:init", () => {
  Alpine.data("counter", () => ({
    count: 0,
    init() {
      console.log("Klanmedic site ready");
    },
  }));
});
