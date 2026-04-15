import { CustomComponentMixin, defineComponent } from "./component.js";

export class ProductQuickAddForm extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleProductVariantSelectorInit = this.handleProductVariantSelectorInit.bind(this);
    this.handleProductVariantSelectorChange = this.handleProductVariantSelectorChange.bind(this);
  }

  connectedCallback() {
    this.subscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.subscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
  }

  disconnectedCallback() {
    this.unsubscribe("product-variant-selector:init", this.handleProductVariantSelectorInit);
    this.unsubscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
  }

  handleProductVariantSelectorInit() {
    console.log("handle init");
  }

  handleProductVariantSelectorChange() {
    console.log("handle change");
  }
}

defineComponent("product-quick-add-form-component", ProductQuickAddForm);
