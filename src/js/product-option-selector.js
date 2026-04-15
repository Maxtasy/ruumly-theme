import { CustomComponentMixin, defineComponent } from "./component.js";

class ProductOptionSelector extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.optionPosition = this.parsedData.optionPosition;
    this.optionSelectedValue = this.parsedData.optionSelectedValue;

    this.handleChange = this.handleChange.bind(this);
  }

  connectedCallback() {
    this.subscribe("change", this.handleChange);
  }

  disconnectedCallback() {
    this.unsubscribe("change", this.handleChange);
  }

  handleChange(event) {
    const updatedValue = event.target.value;

    this.optionSelectedValue = updatedValue;

    this.publish("product-option-selector:change", {
      optionPosition: this.optionPosition,
      optionSelectedValue: this.optionSelectedValue,
    });
  }

  setLoading(force) {
    this.loadingElement.classList.toggle("ProductOptionSelector__Loading--Active", force);
  }

  get loadingElement() {
    return this.querySelector(".ProductOptionSelector__Loading");
  }
}

defineComponent("product-option-selector-component", ProductOptionSelector);
