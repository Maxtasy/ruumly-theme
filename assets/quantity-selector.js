import { CustomComponentMixin, defineComponent } from "./component.js";

class QuantitySelector extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.quantity = parseInt(this.quantityElement.innerText, 10);

    this.connectedToLineItem = this.closest(".LineItem") ? true : false;

    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:increment", this.handleIncrement);
    this.subscribe("button:click:decrement", this.handleDecrement);
  }

  handleIncrement() {
    if (this.connectedToLineItem) {
      this.publish("quantity-selector:update", { desiredQuantity: this.quantity + 1 });
    } else {
      this.quantity++;

      this.quantityElement.innerText = this.quantity;
    }
  }

  handleDecrement() {
    if (this.connectedToLineItem) {
      this.publish("quantity-selector:update", { desiredQuantity: this.quantity - 1 });
    } else {
      this.quantity--;

      this.quantityElement.innerText = this.quantity;
    }
  }

  get quantityElement() {
    return this.querySelector(".QuantitySelector__Quantity");
  }
}

defineComponent("quantity-selector-component", QuantitySelector, "div");
