import { CustomComponentMixin, defineComponent } from "./component.js";

export class WishlistButtons extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.init();
  }

  init() {
    this.productId = this.parsedData.productId;

    this.subscribe("button:click:wishlist:add", this.handleWishlistAddButtonClick.bind(this));
    this.subscribe("button:click:wishlist:remove", this.handleWishlistRemoveButtonClick.bind(this));

    this.setState();

    window.requestAnimationFrame(() => {
      this.classList.add("WishlistButtons--Initialized");
    });
  }

  setState() {
    if (!window.wishlist) {
      console.warn("Wishlist module not available");
      return;
    }

    const found = window.wishlist.items.find((item) => {
      return item.productId === this.productId;
    });

    if (found) {
      this.toggleAdded(true);
    }
  }

  handleWishlistAddButtonClick() {
    this.toggleAdded(true);
  }

  handleWishlistRemoveButtonClick() {
    this.toggleAdded(false);
  }

  toggleAdded(force) {
    this.classList.toggle("WishlistButtons--Added", force);
  }
}

defineComponent("wishlist-buttons-component", WishlistButtons, "div");
