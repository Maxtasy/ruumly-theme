import { CustomComponentMixin, defineComponent } from "./component.js";

export class ProductConfigurator extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.updateVariantUrlParameter = this.parsedData.updateVariantUrlParameter;

    this.handleProductVariantSelectorChange = this.handleProductVariantSelectorChange.bind(this);
  }

  connectedCallback() {
    this.subscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
  }

  disconnectedCallback() {
    this.unsubscribe("product-variant-selector:change", this.handleProductVariantSelectorChange);
  }

  handleProductVariantSelectorChange(event) {
    const { available, selectedVariantId } = event;

    const response = fetch(``);

    if (this.updateVariantUrlParameter) {
      const url = new URL(window.location.href);
      url.searchParams.set("variant", selectedVariantId);
      window.history.replaceState({}, "", url);
    }
  }
}

defineComponent("product-configurator-component", ProductConfigurator);
