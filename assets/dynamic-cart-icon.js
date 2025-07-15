import { CustomComponentMixin, defineComponent } from "./component.js";

class DynamicCartIconComponent extends CustomComponentMixin(HTMLDivElement) {
  constructor(element) {
    super(element);

    this.handleCartDrawerUpdated = this.handleCartDrawerUpdated.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe("cart-drawer:updated", this.handleCartDrawerUpdated);
  }

  disconnectedCallback() {
    globalThis.unsubscribe("cart-drawer:updated", this.handleCartDrawerUpdated);
  }

  handleCartDrawerUpdated({ itemCount }) {
    this.querySelector(".DynamicCartIcon__Indicator .Text").textContent = itemCount;
  }
}

defineComponent("dynamic-cart-icon-component", DynamicCartIconComponent, "div");
