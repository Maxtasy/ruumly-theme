import { CustomComponentMixin, defineComponent } from "./component.js";

export class WishlistSection extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.wishlistButtonEnabled = this.parsedData.wishlistButtonEnabled;
    this.quickAddButtonEnabled = this.parsedData.quickAddButtonEnabled;

    this.handleWishlistRemove = this.handleWishlistRemove.bind(this);

    (globalThis.wishlist.items.length < 1
      ? this.showEmptyState()
      : this.renderSkeletons(globalThis.wishlist.items.length),
      this.rerender(globalThis.wishlist.items));
  }

  connectedCallback() {
    this.subscribe("button:click:wishlist:remove", this.handleWishlistRemove);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:wishlist:remove", this.handleWishlistRemove);
  }

  rerender(items) {
    const skeletonListElements = this.querySelectorAll("li:has(.ProductCardSkeleton)");

    skeletonListElements.forEach((skeletonListElement, index) => {
      if (index + 1 > items.length) {
        skeletonListElement.remove();
      }
    });

    items.forEach(async (item, index) => {
      const response = await fetch(
        `${window.routes.home === "/" ? "" : window.routes.home}/products/${item.handle}?section_id=product-data`,
      );

      const data = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");

      const productCardElement = doc.querySelector(".ProductCard");

      if (!this.quickAddButtonEnabled) {
        const quickAddButtonElement = productCardElement.querySelector("[data-action='quick-add']");
        quickAddButtonElement?.remove();
      }

      if (!this.wishlistButtonEnabled) {
        const wishlistButtonElement = productCardElement.querySelector("wishlist-buttons-component");
        wishlistButtonElement?.remove();
      }

      skeletonListElements[index].innerHTML = productCardElement.outerHTML;
    });
  }

  handleWishlistRemove(_, event) {
    event.target.closest("li:has(.ProductCard)")?.remove();
  }

  showEmptyState() {
    this.emptyStateElement.classList.add("WishlistSection__EmptyState--Active");
  }

  renderSkeletons(count) {
    for (let index = 0; index < count; index++) {
      const skeletonTemplateElement = this.querySelector("#product-card-skeleton");
      const clone = document.importNode(skeletonTemplateElement.content, true);
      const listItemElement = clone.querySelector("li:has(.ProductCardSkeleton)");

      this.productListElement.appendChild(listItemElement);
    }
  }

  get productListElement() {
    return this.querySelector(".ProductList");
  }

  get emptyStateElement() {
    return this.querySelector(".WishlistSection__EmptyState");
  }
}

defineComponent("wishlist-section-component", WishlistSection);
