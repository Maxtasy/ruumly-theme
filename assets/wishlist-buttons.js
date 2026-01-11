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
    const iconElement = this.querySelector("[data-action='wishlist:add'] .Icon");
    const destinationElement = document.querySelector("[data-wishlist-page-button] .Icon");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (destinationElement && !prefersReducedMotion) {
      const clonedIconElement = iconElement.cloneNode(true);

      this.appendChild(clonedIconElement);

      clonedIconElement.style.position = "fixed";
      clonedIconElement.style.zIndex = "var(--layer-10)";
      clonedIconElement.style.transition = "transform var(--transition-duration-long) var(--transition-timing)";

      const initialPosition = iconElement.getBoundingClientRect();
      const finalPosition = destinationElement.getBoundingClientRect();

      clonedIconElement.style.top = `${initialPosition.y}px`;
      clonedIconElement.style.left = `${initialPosition.x}px`;

      window.requestAnimationFrame(() => {
        const xDelta = finalPosition.x - initialPosition.x;
        const yDelta = finalPosition.y - initialPosition.y;

        clonedIconElement.style.transform = `translate(${xDelta}px, ${yDelta}px)`;
      });

      clonedIconElement.addEventListener("transitionend", () => {
        clonedIconElement.remove();
      });
    }

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
