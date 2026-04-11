import { CustomComponentMixin, defineComponent } from "./component.js";

class ProductVariantSelector extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.productVariants = this.parsedData.productVariants;
    this.selectedVariantId = this.parsedData.selectedVariantId;

    // `parsedData` converts string numbers to actual numbers, but we want the option values to be always strings
    // (or null) since that's what the option selectors will emit, so we convert them back to strings here.
    this.selectedOptionValues = [
      this.parsedData.selectedOption1Value?.toString() || null,
      this.parsedData.selectedOption2Value?.toString() || null,
      this.parsedData.selectedOption3Value?.toString() || null,
    ];

    this.available = this.parsedData.available;

    this.handleProductOptionSelectorChange = this.handleProductOptionSelectorChange.bind(this);
  }

  connectedCallback() {
    this.publish("product-variant-selector:init", {
      selectedVariantId: this.selectedVariantId,
      available: this.available,
    });

    this.subscribe("product-option-selector:change", this.handleProductOptionSelectorChange);
  }

  disconnectedCallback() {
    this.unsubscribe("product-option-selector:change", this.handleProductOptionSelectorChange);
  }

  handleProductOptionSelectorChange(event) {
    const { optionPosition, optionSelectedValue } = event;

    this.selectedOptionValues[optionPosition - 1] = optionSelectedValue;

    const selectedVariant = this.productVariants.find((variant) => {
      return (
        variant.option1 === this.selectedOptionValues[0] &&
        variant.option2 === this.selectedOptionValues[1] &&
        variant.option3 === this.selectedOptionValues[2]
      );
    });

    this.selectedVariantId = selectedVariant ? selectedVariant.id : null;
    this.available = selectedVariant ? selectedVariant.available : false;

    this.publish("product-variant-selector:change", {
      selectedVariantId: this.selectedVariantId,
      available: this.available,
    });
  }
}

defineComponent("product-variant-selector-component", ProductVariantSelector);
