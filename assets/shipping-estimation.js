import { CustomComponentMixin, defineComponent } from "./component.js";

export class ShippingEstimation extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();
  }

  setAvailable() {
    this.textElement.classList.remove("Text--ColorDestructive");
    this.textElement.classList.add("Text--ColorSuccess");
    this.textElement.textContent = this.parsedData.availableText;
  }

  setUnavailable() {
    this.textElement.classList.add("Text--ColorDestructive");
    this.textElement.classList.remove("Text--ColorSuccess");
    this.textElement.textContent = this.parsedData.unavailableText;
  }

  get textElement() {
    return this.querySelector(".Text");
  }
}

defineComponent("shipping-estimation-component", ShippingEstimation, "div");
