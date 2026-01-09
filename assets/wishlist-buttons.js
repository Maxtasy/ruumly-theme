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
    //TODO Duplicate add icon
    const iconElement = this.querySelector("[data-action='wishlist:add'] .Icon");
    const finalPositionIconElement = document.querySelector("[aria-label='Open wishlist'] .Icon");

    const clonedIconElement = iconElement.cloneNode(true);

    this.appendChild(clonedIconElement);
    //TODO Set initial position of duplicate
    clonedIconElement.style.position = "fixed";
    clonedIconElement.style.zIndex = "9000";
    clonedIconElement.style.transition = "all 1s linear";

    const initialPosition = iconElement.getBoundingClientRect();
    const finalPosition = finalPositionIconElement.getBoundingClientRect();

    clonedIconElement.style.top = `${initialPosition.y}px`;
    clonedIconElement.style.left = `${initialPosition.x}px`;
    //TODO Set final position of duplicate
    window.requestAnimationFrame(() => {
      clonedIconElement.style.top = `${finalPosition.y}px`;
      clonedIconElement.style.left = `${finalPosition.x}px`;
    });
    //TODO Delete duplicate from dom
    clonedIconElement.addEventListener("transitionend", () => {
      clonedIconElement.remove();
    });
    //TODO Use translate instead of top left (performance)

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
