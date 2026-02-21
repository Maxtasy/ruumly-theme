import { CustomComponentMixin, defineComponent } from "./component.js";

export class Alert extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();
  }

  setText(text) {
    this.textElement.textContent = text;
  }

  get textElement() {
    return this.querySelector(".Text:not(strong)");
  }
}

defineComponent("alert-component", Alert, "div");
