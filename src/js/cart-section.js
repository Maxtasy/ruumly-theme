import { CustomComponentMixin, defineComponent } from "./component.js";
import { getClosestSectionId } from "./utils.js";

export class CartSection extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleCartUpdate = this.handleCartUpdate.bind(this);
  }

  connectedCallback() {
    this.subscribe("line-item:update", this.handleCartUpdate);
    this.subscribe("line-item:remove", this.handleCartUpdate);
  }

  disconnectedCallback() {
    this.unsubscribe("line-item:update", this.handleCartUpdate);
    this.unsubscribe("line-item:remove", this.handleCartUpdate);
  }

  handleCartUpdate({ sections, items }) {
    const updatedCartSection = sections[`${getClosestSectionId(".Cart")}`];

    if (updatedCartSection) {
      this.rerenderCartSection(updatedCartSection);

      const totalQuantity = items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);

      this.publish("cart-section:updated", { totalQuantity });
    }
  }

  rerenderCartSection(updatedCartSection) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(updatedCartSection, "text/html");
    this.innerHTML = doc.querySelector(".Cart").innerHTML;
  }
}

defineComponent("cart-section-component", CartSection);
