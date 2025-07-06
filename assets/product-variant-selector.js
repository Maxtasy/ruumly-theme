import { CustomComponentMixin, defineComponent } from "./component.js";

class ProductVariantSelector extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.productVariants = this.parsedData.productVariants;
    this.selectedVariantId = this.parsedData.selectedVariantId;
    this.selectedOptionValues = [
      this.parsedData.selectedOption1Value || null,
      this.parsedData.selectedOption2Value || null,
      this.parsedData.selectedOption3Value || null,
    ];
    this.available = this.parsedData.available;

    this.subscribe("product-option-selector:change", this.handleProductOptionSelectorChange.bind(this));
  }

  connectedCallback() {
    this.publish("product-variant-selector:init", {
      selectedVariantId: this.selectedVariantId,
      available: this.available,
    });
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

defineComponent("product-variant-selector-component", ProductVariantSelector, "div");
