import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";

export class ProductForm extends CustomComponentMixin(HTMLFormElement) {
  constructor() {
    super();

    this.item = null;
    this.sectionsToRerender = [];

    this.subscribe("product-variant-selector:init", this.handleProductVariantSelectorInit.bind(this));
    this.subscribe("product-variant-selector:change", this.handleProductVariantSelectorChange.bind(this));

    this.subscribe("submit", this.handleSubmit.bind(this));
  }

  handleProductVariantSelectorInit(event) {
    const { available, selectedVariantId } = event;

    if (!available) {
      this.addToCartButtonElement && this.addToCartButtonElement.disable();
    } else {
      this.addToCartButtonElement && this.addToCartButtonElement.enable();

      this.item = {
        id: selectedVariantId,
        quantity: 1, // Default quantity
      };
    }
  }

  handleProductVariantSelectorChange(event) {
    const { selectedVariantId } = event;

    if (!selectedVariantId) {
      this.addToCartButtonElement && this.addToCartButtonElement.disable();
      this.item = null;
    } else {
      this.addToCartButtonElement && this.addToCartButtonElement.enable();

      this.item = {
        id: selectedVariantId,
        quantity: 1, // Default quantity
      };
    }

    // Notify other components that the variant has changed. The Gallery component can use this to update the displayed
    // images.
    this.publish("product-form:variant-changed", { item: this.item });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.item) {
      throw new Error("No item to add to cart");
    }

    const cartResponse = await cart.addItem({ item: this.item, sections: this.sectionsToRerender });

    if (!cartResponse) {
      throw new Error("Failed to add item to cart");
    }

    // Notify other components that the item has been added to the cart.
    this.publish("product-form:item-added", { item: this.item, sections: this.sectionsToRerender });
  }

  get addToCartButtonElement() {
    return this.querySelector("[data-action='add-to-cart']");
  }
}

defineComponent("product-form-component", ProductForm, "form");
