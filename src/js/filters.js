import { CustomComponentMixin, defineComponent } from "./component.js";

export class Filters extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();
    console.log("initialized");
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

defineComponent("filters-component", Filters);
