import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";
import { sectionRenderingApi } from "./section-rendering-api.js";
import { getClosestSectionId } from "./utils.js";

export class MainCart extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleClearCart = this.handleClearCart.bind(this);
    this.handleItemAdded = this.handleItemAdded.bind(this);
    this.handleItemPartiallyAdded = this.handleItemPartiallyAdded.bind(this);
    this.handleCartUpdate = this.handleCartUpdate.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:clear-cart", this.handleClearCart);
    this.subscribe("line-item:update", this.handleCartUpdate);
    this.subscribe("line-item:remove", this.handleCartUpdate);

    globalThis.subscribe("product-form:item-added", this.handleItemAdded);
    globalThis.subscribe("product-form:item-partially-added", this.handleItemPartiallyAdded);
    globalThis.subscribe("product-card:item-added", this.handleItemAdded);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:clear-cart", this.handleClearCart);
    this.unsubscribe("line-item:update", this.handleCartUpdate);
    this.unsubscribe("line-item:remove", this.handleCartUpdate);

    globalThis.unsubscribe("product-form:item-added", this.handleItemAdded);
    globalThis.unsubscribe("product-form:item-partially-added", this.handleItemPartiallyAdded);
    globalThis.unsubscribe("product-card:item-added", this.handleItemAdded);
  }

  handleItemAdded({ sections, items }) {
    const updatedCart = sections[`${getClosestSectionId(".Cart")}`] || sections["main-cart"];

    if (updatedCart) {
      this.rerenderCart(updatedCart);

      this.publish("cart-drawer:updated", { totalQuantity: this.totalQuantity });
    }
  }

  async handleItemPartiallyAdded({ errorMessage, item }) {
    const sections = await sectionRenderingApi.fetchSections(["main-cart"]);

    const updatedCart = sections[`${getClosestSectionId(".Cart")}`] || sections["main-cart"];

    if (updatedCart) {
      this.rerenderCart(updatedCart);

      // Select associated line item and update its alerts.

      const lineItemElement = [...this.lineItemElements].find(
        (lineItemElement) => lineItemElement.parsedData.variantId === item.id,
      );

      if (lineItemElement) {
        lineItemElement.updateAlerts([errorMessage]);
      }

      // Notify other components about the update.

      this.publish("cart-drawer:updated", { totalQuantity: this.totalQuantity });
    }
  }

  async handleCartUpdate({ sections, items }) {
    const updatedCart = sections[`${getClosestSectionId(".Cart")}`];

    if (updatedCart) {
      this.rerenderCart(updatedCart);

      const totalQuantity = items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);

      this.publish("cart-drawer:updated", { totalQuantity });
    }
  }

  async rerenderCart(updatedCart) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(updatedCart, "text/html");
    this.innerHTML = doc.querySelector(".Cart").innerHTML;
  }

  async handleClearCart() {
    const elementsToReRender = [".Cart__Content"];

    const response = await cart.clear({ sections: ["main-cart"] });

    // Replace the cart markup with the updated one from the response.

    const parser = new DOMParser();
    const doc = parser.parseFromString(response.sections["main-cart"], "text/html");

    elementsToReRender.forEach((element) => {
      const elementToReplace = this.querySelector(element);
      const newElement = doc.querySelector(element);

      if (elementToReplace && newElement) {
        elementToReplace.innerHTML = newElement.innerHTML;
      }
    });

    this.publish("cart-drawer:updated", { totalQuantity: 0 });
  }

  get lineItemElements() {
    return this.querySelectorAll(".LineItem");
  }

  get totalQuantity() {
    return [...this.querySelectorAll(".QuantitySelector")].reduce((total, el) => (total += el.quantity), 0);
  }
}

defineComponent("main-cart-component", MainCart);
