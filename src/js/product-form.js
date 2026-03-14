import { CustomComponentMixin, defineComponent } from "./component.js";

export class ProductForm extends CustomComponentMixin(HTMLElement) {
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
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  connectedCallback() {
    this.subscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.subscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.subscribe("quantity-selector:change", this.handleQuantitySelectorChange);

    this.formElement?.addEventListener("submit", this.handleFormSubmit);
  }

  disconnectedCallback() {
    this.unsubscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.unsubscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.unsubscribe("quantity-selector:change", this.handleQuantitySelectorChange);

    this.formElement?.removeEventListener("submit", this.handleFormSubmit);
  }

  handleFormSubmit(event) {
    event.preventDefault();
  }

  handleProductVariantSelectorInit(event) {
    const { selectedVariantId } = event;

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

    // Notify other components that the variant has changed. The Gallery component can use this to update the displayed
    // images.
    this.publish("product-form:change", { item: this.item });
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
