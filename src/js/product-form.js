import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";

export class ProductForm extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.item = {
      id: null,
      quantity: 1,
    };

    this.handleProductVariantSelectorInit = this.handleProductVariantSelectorInit.bind(this);
    this.handleProductVariantSelectorChange = this.handleProductVariantSelectorChange.bind(this);
    this.handleQuantitySelectorChange = this.handleQuantitySelectorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  connectedCallback() {
    this.subscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.subscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.subscribe("quantity-selector:change", this.handleQuantitySelectorChange);

    this.formElement?.addEventListener("submit", this.handleSubmit);
  }

  disconnectedCallback() {
    this.unsubscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.unsubscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.unsubscribe("quantity-selector:change", this.handleQuantitySelectorChange);

    this.formElement?.removeEventListener("submit", this.handleSubmit);
  }

  handleProductVariantSelectorInit(event) {
    const { available, selectedVariantId } = event;

    if (!available) {
      this.addToCartButtonElement && this.addToCartButtonElement.disable();
    } else {
      this.addToCartButtonElement && this.addToCartButtonElement.enable();
    }

    this.item.id = selectedVariantId;
  }

  handleQuantitySelectorInit(event) {
    const { quantity } = event;

    this.item.quantity = quantity;
  }

  handleQuantitySelectorChange(event) {
    const { quantity } = event;

    this.item.quantity = quantity;
  }

  handleProductVariantSelectorChange(event) {
    const { selectedVariantId } = event;

    this.item.id = selectedVariantId;
  }

  async handleSubmit(event) {
    event.preventDefault();

    // Return early if the event was not triggered by the add to cart button.
    if (event.submitter.closest("button-component")?.getAttribute("data-action") !== "add-to-cart") return;

    if (!this.item) {
      throw new Error("No item to add to cart");
    }

    const cartResponse = await cart.addItem({ item: this.item, sections: ["cart-drawer"] });

    if (cartResponse.status === "success") {
      // Notify other components that the item has been added to the cart.
      this.publish("product-form:item-added", {
        item: this.item,
        sections: cartResponse.data.sections,
        items: cartResponse.data.items,
      });

      return;
    }

    if (cartResponse.status === "partial-success") {
      const errorMessage = cartResponse.data.description;

      // Notify other components that the item has been added (partially) to the cart.
      this.publish("product-form:item-partially-added", {
        item: this.item,
        errorMessage,
      });

      return;
    }

    throw new Error("Failed to add item to cart");
  }

  get formElement() {
    return this.querySelector("form");
  }

  get shippingEstimationElement() {
    return this.querySelector(".ShippingEstimation");
  }

  get addToCartButtonElement() {
    return this.querySelector("button-component[data-action='add-to-cart']");
  }
}

defineComponent("product-form-component", ProductForm);
