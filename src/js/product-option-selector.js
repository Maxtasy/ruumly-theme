import { CustomComponentMixin, defineComponent } from "./component.js";

class ProductOptionSelector extends CustomComponentMixin(HTMLFieldSetElement) {
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
}

defineComponent("product-option-selector-component", ProductOptionSelector, "fieldset");
