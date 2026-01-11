import { CustomComponentMixin, defineComponent } from "./component.js";

class DynamicWishlistIconComponent extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.init();
  }

  init() {
    globalThis.addEventListener("wishlist:update", (event) => {
      const itemCount = event.detail.length;

      if (itemCount > 0) {
        this.showIndicator();
        this.setIndicatorCount(itemCount);
      } else {
        this.hideIndicator();
      }
    });

    this.setState();
  }

  setState() {
    if (!window.wishlist) {
      console.warn("Wishlist module not available");
      return;
    }

    const itemCount = window.wishlist.items.length;

    if (itemCount > 0) {
      this.showIndicator();
      this.setIndicatorCount(itemCount);
    }
  }

  showIndicator() {
    this.indicatorElement?.classList.add("DynamicWishlistIcon__Indicator--Active");
  }

  hideIndicator() {
    this.indicatorElement?.classList.remove("DynamicWishlistIcon__Indicator--Active");
  }

  setIndicatorCount(count) {
    this.indicatorTextElement.textContent = count;
  }

  get indicatorTextElement() {
    return this.querySelector(".DynamicWishlistIcon__Indicator .Text");
  }

  get indicatorElement() {
    return this.querySelector(".DynamicWishlistIcon__Indicator");
  }
}

defineComponent("dynamic-wishlist-icon-component", DynamicWishlistIconComponent, "div");
