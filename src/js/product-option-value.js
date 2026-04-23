import { CustomComponentMixin, defineComponent } from "./component.js";

export class ProductOptionValue extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleMouseenter = this.handleMouseenter.bind(this);
  }

  connectedCallback() {
    this.subscribe("mouseenter", this.handleMouseenter);
  }

  disconnectedCallback() {
    this.unsubscribe("mouseenter", this.handleMouseenter);
  }

  handleMouseenter() {
    this.publish("product-option-value:hover", { value: this.inputValue });
  }

  get inputValue() {
    return this.querySelector("input")?.value;
  }
}

defineComponent("product-option-value-component", ProductOptionValue);
