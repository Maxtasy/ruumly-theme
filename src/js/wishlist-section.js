import { CustomComponentMixin, defineComponent } from "./component.js";
import { sleep } from "./utils.js";

export class WishlistSection extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.wishlistButtonEnabled = this.parsedData.wishlistButtonEnabled;
    this.quickAddButtonEnabled = this.parsedData.quickAddButtonEnabled;

    this.handleWishlistItemRemove = this.handleWishlistItemRemove.bind(this);

    if (globalThis.wishlist.items.length < 1) {
      this.showEmptyState();
      return;
    }

    this.batchSize = 16;

    const initialItems = globalThis.wishlist.items.slice(0, this.batchSize);

    this.addItems(initialItems);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.addItems(
            globalThis.wishlist.items.slice(
              this.productListElement.children.length,
              this.productListElement.children.length + this.batchSize,
            ),
          );
        }
      },
      {
        threshold: 0,
      },
    );

    observer.observe(this.sentinelElement);
  }

  connectedCallback() {
    this.subscribe("button:click:wishlist:remove", this.handleWishlistItemRemove);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:wishlist:remove", this.handleWishlistItemRemove);
  }

  async addItem(item) {
    const skeletonTemplateElement = this.querySelector("#product-card-skeleton");
    const clone = document.importNode(skeletonTemplateElement.content, true);
    const listItemElement = clone.querySelector("li:has(.ProductCardSkeleton)");

    this.productListElement.appendChild(listItemElement);

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

    const skeletonElement = listItemElement.querySelector(".ProductCardSkeleton");

    skeletonElement.innerHTML = productCardElement.outerHTML;
  }

  async handleWishlistItemRemove(_, event) {
    const listItemElement = event.target.closest("li:has(.ProductCard)");

    if (!listItemElement) return;

    await this.removeWithAnimation(listItemElement);

    if (globalThis.wishlist.items.length < 1) {
      this.showEmptyState();
    }
  }

  async removeWithAnimation(listItemElement) {
    listItemElement.classList.add("WishlistSection__Item--Removing");
    await sleep(300);
    listItemElement.remove();
  }

  showEmptyState() {
    this.emptyStateElement.classList.add("WishlistSection__EmptyState--Active");
  }

  addItems(items) {
    items.forEach((item) => {
      this.addItem(item);
    });
  }

  get productListElement() {
    return this.querySelector(".ProductList");
  }

  get emptyStateElement() {
    return this.querySelector(".WishlistSection__EmptyState");
  }

  get sentinelElement() {
    return this.querySelector(".WishlistSection__Sentinel");
  }
}

defineComponent("wishlist-section-component", WishlistSection);
