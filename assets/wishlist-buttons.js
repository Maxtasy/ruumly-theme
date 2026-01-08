import { CustomComponentMixin, defineComponent } from "./component.js";

export class WishlistButtons extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.subscribe("button:click:wishlist:add", this.handleWishlistAddButtonClick.bind(this));
    this.subscribe("button:click:wishlist:remove", this.handleWishlistRemoveButtonClick.bind(this));
  }

  connectedCallback() {
    this.productId = this.parsedData.productId;
    console.log(this.productId);
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
