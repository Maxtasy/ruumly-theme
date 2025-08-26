import { CustomComponentMixin, defineComponent } from "./component.js";

export class ShippingEstimation extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();
  }

  setAvailable() {
    this.querySelector(".Text").classList.remove("Text--ColorDestructive");

    this.querySelector(".Text").classList.add("Text--ColorSuccess");
  }
}

defineComponent("shipping-estimation-component", ShippingEstimation, "div");
