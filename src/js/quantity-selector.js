import { CustomComponentMixin, defineComponent } from "./component.js";

class QuantitySelector extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.quantity = this.parsedData.quantity || 1;
    this.max = this.parsedData.max || null;

    this.connectedToLineItem = this.closest(".LineItem") ? true : false;

    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:increment", this.handleIncrement);
    this.subscribe("button:click:decrement", this.handleDecrement);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:increment", this.handleIncrement);
    this.unsubscribe("button:click:decrement", this.handleDecrement);
  }

  setLoading(force) {
    this.loadingElement?.classList.toggle("QuantitySelector__Loading--Active", force);
  }

  handleIncrement() {
    if (this.max !== null && this.quantity >= this.max) {
      this.showMaxQuantityError();
      return;
    }

    if (this.connectedToLineItem) {
      this.publish("quantity-selector:update", { desiredQuantity: this.quantity + 1 });
    } else {
      this.quantity++;

      this.quantityElement.innerText = this.quantity;

      this.publish("quantity-selector:change", { quantity: this.quantity });
    }
  }

  handleDecrement() {
    if (this.connectedToLineItem) {
      this.publish("quantity-selector:update", { desiredQuantity: this.quantity - 1 });
    } else {
      if (this.quantity <= 1) return;

      this.quantity--;

      this.quantityElement.innerText = this.quantity;

      this.publish("quantity-selector:change", { quantity: this.quantity });
    }
  }

  showMaxQuantityError() {
    this.errorElement?.classList.add("QuantitySelector__Error--Active");

    setTimeout(() => {
      this.errorElement?.classList.remove("QuantitySelector__Error--Active");
    }, 3000);
  }

  get quantityElement() {
    return this.querySelector(".QuantitySelector__Quantity");
  }

  get loadingElement() {
    return this.querySelector(".QuantitySelector__Loading");
  }

  get errorElement() {
    return this.querySelector(".QuantitySelector__Error");
  }
}

defineComponent("quantity-selector-component", QuantitySelector);
