import { CustomComponentMixin, defineComponent } from "./component.js";

class ProductOptionSelector extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.optionPosition = this.parsedData.optionPosition;
    this.optionSelectedValue = this.parsedData.optionSelectedValue;

    this.handleChange = this.handleChange.bind(this);
    this.handleProductOptionValueHover = this.handleProductOptionValueHover.bind(this);
    this.updateSelectedOptionValue = this.updateSelectedOptionValue.bind(this);
  }

  connectedCallback() {
    this.subscribe("change", this.handleChange);
    this.subscribe("product-option-value:hover", this.handleProductOptionValueHover);
  }

  disconnectedCallback() {
    this.unsubscribe("change", this.handleChange);
    this.unsubscribe("product-option-value:hover", this.handleProductOptionValueHover);
  }

  handleChange(data) {
    const updatedValue = data.target.value;

    this.optionSelectedValue = updatedValue;

    this.updateSelectedOptionValue(updatedValue);

    this.publish("product-option-selector:change", {
      optionPosition: this.optionPosition,
      optionSelectedValue: this.optionSelectedValue,
    });
  }

  handleProductOptionValueHover(data) {
    const { value } = data;

    if (value === undefined) return;

    this.publish("product-option-selector:change-intent", {
      optionPosition: this.optionPosition,
      optionSelectedValue: value,
    });
  }

  updateSelectedOptionValue(value) {
    if (!this.selectedValueElement) return;

    this.selectedValueElement.textContent = value;
  }

  setLoading(force) {
    this.loadingElement.classList.toggle("ProductOptionSelector__Loading--Active", force);
  }

  get loadingElement() {
    return this.querySelector(".ProductOptionSelector__Loading");
  }

  get selectedValueElement() {
    return this.querySelector(".ProductOptionSelector__SelectedValue");
  }
}

defineComponent("product-option-selector-component", ProductOptionSelector);
