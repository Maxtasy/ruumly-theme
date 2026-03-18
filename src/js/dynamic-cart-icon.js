import { CustomComponentMixin, defineComponent } from "./component.js";

class DynamicCartIconComponent extends CustomComponentMixin(HTMLElement) {
  constructor(element) {
    super(element);

    this.handleCartUpdated = this.handleCartUpdated.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe("cart-drawer:updated", this.handleCartUpdated);
    globalThis.subscribe("cart-section:updated", this.handleCartUpdated);
  }

  disconnectedCallback() {
    globalThis.unsubscribe("cart-drawer:updated", this.handleCartUpdated);
    globalThis.unsubscribe("cart-section:updated", this.handleCartUpdated);
  }

  handleCartUpdated({ totalQuantity }) {
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

defineComponent("dynamic-cart-icon-component", DynamicCartIconComponent);
