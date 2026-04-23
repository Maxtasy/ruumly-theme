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
    this.handleProductVariantSelectorChangeIntent = this.handleProductVariantSelectorChangeIntent.bind(this);
  }

  connectedCallback() {
    this.subscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.subscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.subscribe("quantity-selector:change", this.handleQuantitySelectorChange);
    this.subscribe("product-variant-selector:change-intent", this.handleProductVariantSelectorChangeIntent);
  }

  disconnectedCallback() {
    this.unsubscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.unsubscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
    this.unsubscribe("quantity-selector:change", this.handleQuantitySelectorChange);
    this.unsubscribe("product-variant-selector:change-intent", this.handleProductVariantSelectorChangeIntent);
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

  handleProductVariantSelectorChange(data) {
    const { selectedVariantId } = data;

    this.item.id = selectedVariantId;

    // Notify other components that the variant has changed. The Gallery component can use this to update the displayed
    // images.
    this.publish("product-form:change", { item: this.item });
  }

  handleProductVariantSelectorChangeIntent(data) {
    const { selectedVariantId } = data;

    this.item.id = selectedVariantId;

    this.publish("product-form:change-intent", { item: this.item });
  }
}

defineComponent("product-form-component", ProductForm);
