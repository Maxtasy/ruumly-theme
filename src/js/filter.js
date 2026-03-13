import { CustomComponentMixin, defineComponent } from "./component.js";

export class Filter extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

defineComponent("filter-component", Filter);
