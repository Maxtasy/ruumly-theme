import { CustomComponentMixin, defineComponent } from "./component.js";

export class Filter extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();
    console.log("initialized");
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

defineComponent("filter-component", Filter);
