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
    this.handleProductOptionSelectorChangeIntent = this.handleProductOptionSelectorChangeIntent.bind(this);
  }

  connectedCallback() {
    this.publish("product-variant-selector:init", {
      selectedVariantId: this.selectedVariantId,
      available: this.available,
    });

    this.subscribe("product-option-selector:change", this.handleProductOptionSelectorChange);
    this.subscribe("product-option-selector:change-intent", this.handleProductOptionSelectorChangeIntent);
  }

  disconnectedCallback() {
    this.unsubscribe("product-option-selector:change", this.handleProductOptionSelectorChange);
    this.unsubscribe("product-option-selector:change-intent", this.handleProductOptionSelectorChangeIntent);
  }

  handleProductOptionSelectorChange(data) {
    const { optionPosition, optionSelectedValue } = data;

    this.selectedOptionValues[optionPosition - 1] = optionSelectedValue;

    const selectedVariant = this.getSelectedVariant(this.selectedOptionValues);

    this.selectedVariantId = selectedVariant ? selectedVariant.id : null;
    this.available = selectedVariant ? selectedVariant.available : false;

    this.publish("product-variant-selector:change", {
      selectedVariantId: this.selectedVariantId,
      available: this.available,
    });
  }

  handleProductOptionSelectorChangeIntent(data) {
    const { optionPosition, optionSelectedValue } = data;

    const temporarySelectedOptionValues = [...this.selectedOptionValues];

    temporarySelectedOptionValues[optionPosition - 1] = optionSelectedValue;

    const selectedVariant = this.getSelectedVariant(temporarySelectedOptionValues);

    this.available = selectedVariant ? selectedVariant.available : false;

    this.publish("product-variant-selector:change-intent", {
      selectedVariantId: selectedVariant.id,
      available: this.available,
    });
  }

  getSelectedVariant(selectedOptionValues) {
    return this.productVariants.find((variant) => {
      return (
        variant.option1 === selectedOptionValues[0] &&
        variant.option2 === selectedOptionValues[1] &&
        variant.option3 === selectedOptionValues[2]
      );
    });
  }
}

defineComponent("product-variant-selector-component", ProductVariantSelector);
