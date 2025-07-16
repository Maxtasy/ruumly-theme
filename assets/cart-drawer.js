import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";

export class CartDrawer extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.handleClearCart = this.handleClearCart.bind(this);
    this.handleItemAdded = this.handleItemAdded.bind(this);
    this.handleCartUpdate = this.handleCartUpdate.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:clear-cart", this.handleClearCart);
    this.subscribe("line-item:update", this.handleCartUpdate);

    globalThis.subscribe("product-form:item-added", this.handleItemAdded);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:clear-cart", this.handleClearCart);
    this.unsubscribe("line-item:update", this.handleCartUpdate);

    globalThis.unsubscribe("product-form:item-added", this.handleItemAdded);
  }

  handleItemAdded({ sections, items }) {
    const { "cart-drawer": updatedCartDrawer } = sections;

    if (updatedCartDrawer) {
      this.rerenderCartDrawer(updatedCartDrawer);

      this.closest(".Drawer").open();

      this.publish("cart-drawer:updated", { itemCount: items.length });
    }
  }

  async handleCartUpdate({ sections, items }) {
    const { "cart-drawer": updatedCartDrawer } = sections;

    if (updatedCartDrawer) {
      this.rerenderCartDrawer(updatedCartDrawer);

      const totalItemCount = items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);

      this.publish("cart-drawer:updated", { itemCount: totalItemCount });
    }
  }

  async rerenderCartDrawer(updatedCartDrawer) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(updatedCartDrawer, "text/html");
    this.innerHTML = doc.querySelector(".CartDrawer").innerHTML;
  }

  async handleClearCart() {
    const elementsToReRender = [".CartDrawer__Content"];

    const response = await cart.clear({ sections: ["cart-drawer"] });

    // Replace the cart drawer markup with the updated one from the response.

    const parser = new DOMParser();
    const doc = parser.parseFromString(response.sections["cart-drawer"], "text/html");

    elementsToReRender.forEach((element) => {
      const elementToReplace = this.querySelector(element);
      const newElement = doc.querySelector(element);

      if (elementToReplace && newElement) {
        elementToReplace.innerHTML = newElement.innerHTML;
      }
    });

    this.publish("cart-drawer:updated", { itemCount: 0 });
  }
}

defineComponent("cart-drawer-component", CartDrawer, "div");
