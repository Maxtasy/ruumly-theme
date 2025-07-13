import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";

export class CartDrawer extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.handleClearCart = this.handleClearCart.bind(this);
    this.handleItemAdded = this.handleItemAdded.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:clear-cart", this.handleClearCart);

    globalThis.subscribe("product-form:item-added", this.handleItemAdded);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:clear-cart", this.handleClearCart);

    globalThis.unsubscribe("product-form:item-added", this.handleItemAdded);
  }

  handleItemAdded({ sections }) {
    const { "cart-drawer": updatedCartDrawer } = sections;

    if (updatedCartDrawer) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(updatedCartDrawer, "text/html");

      const elementsToReRender = [".CartDrawer__Content"];

      elementsToReRender.forEach((element) => {
        const elementToReplace = this.querySelector(element);
        const newElement = doc.querySelector(element);

        if (elementToReplace && newElement) {
          elementToReplace.innerHTML = newElement.innerHTML;
        }
      });

      this.closest(".Drawer").open();
    }
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
  }
}

defineComponent("cart-drawer-component", CartDrawer, "div");
