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

  handleCartDrawerUpdated({ totalQuantity }) {
    this.querySelector(".DynamicCartIcon__Indicator .Text").textContent = totalQuantity;

    if (totalQuantity > 0) {
      this.showIndicator();
    } else {
      this.hideIndicator();
    }
  }

  showIndicator() {
    this.indicatorElement?.classList.add("DynamicCartIcon__Indicator--Active");
  }

  hideIndicator() {
    this.indicatorElement?.classList.remove("DynamicCartIcon__Indicator--Active");
  }

  get indicatorElement() {
    return this.querySelector(".DynamicCartIcon__Indicator");
  }
}

defineComponent("dynamic-cart-icon-component", DynamicCartIconComponent, "div");
