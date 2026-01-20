import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";

export class ProductForm extends CustomComponentMixin(HTMLFormElement) {
  constructor() {
    super();

    this.item = {
      id: null,
      quantity: 1,
    };

    this.updateVariantUrlParameter = this.parsedData.updateVariantUrlParameter;

    this.handleProductVariantSelectorInit = this.handleProductVariantSelectorInit.bind(this);
    this.handleProductVariantSelectorChange = this.handleProductVariantSelectorChange.bind(this);
    this.handleQuantitySelectorChange = this.handleQuantitySelectorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  connectedCallback() {
    this.subscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.subscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.subscribe("quantity-selector:change", this.handleQuantitySelectorChange);
    this.subscribe("submit", this.handleSubmit);
  }

  disconnectedCallback() {
    this.unsubscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.unsubscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.unsubscribe("quantity-selector:change", this.handleQuantitySelectorChange);
    this.unsubscribe("submit", this.handleSubmit);
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
    const { available, selectedVariantId } = event;

    if (!available) {
      this.addToCartButtonElement && this.addToCartButtonElement.disable();
      this.shippingEstimationElement && this.shippingEstimationElement.setUnavailable();
    } else {
      this.addToCartButtonElement && this.addToCartButtonElement.enable();
      this.shippingEstimationElement && this.shippingEstimationElement.setAvailable();
    }

    this.item.id = selectedVariantId;

    if (this.updateVariantUrlParameter) {
      const url = new URL(window.location.href);
      url.searchParams.set("variant", this.item.id);
      window.history.replaceState({}, "", url);
    }

    // Notify other components that the variant has changed. The Gallery component can use this to update the displayed
    // images.
    this.publish("product-form:change", { item: this.item });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.item) {
      throw new Error("No item to add to cart");
    }

    const cartResponse = await cart.addItem({ item: this.item, sections: ["cart-drawer"] });

    if (!cartResponse) {
      throw new Error("Failed to add item to cart");
    }

    // Notify other components that the item has been added to the cart.
    this.publish("product-form:item-added", {
      item: this.item,
      sections: cartResponse.sections,
      items: cartResponse.items,
    });
  }

  get shippingEstimationElement() {
    return this.querySelector(".ShippingEstimation");
  }

  get addToCartButtonElement() {
    return this.querySelector("[data-action='add-to-cart']");
  }
}

defineComponent("product-form-component", ProductForm, "form");
