import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";

class LineItem extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.key = this.parsedData.key;

    this.handleQuantityUpdate = this.handleQuantityUpdate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  connectedCallback() {
    this.subscribe("quantity-selector:update", this.handleQuantityUpdate);
    this.subscribe("button:click:remove", this.handleRemove);
  }

  async handleQuantityUpdate({ desiredQuantity }) {
    const response = await cart.update({
      updates: { [`${this.key}`]: desiredQuantity },
      sections: "cart-drawer",
    });

    if (response) {
      this.publish("line-item:update", {
        sections: response.sections,
        items: response.items,
      });
    }
  }

  async handleRemove() {
    const response = await cart.remove({ key: this.key, sections: "cart-drawer" });

    if (response) {
      this.publish("line-item:remove", {
        sections: response.sections,
        items: response.items,
      });
    }
  }
}

defineComponent("line-item-component", LineItem, "div");
