import { CustomComponentMixin, defineComponent } from "./component.js";

export class QuickSearch extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    console.log("quick-search initialized");
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

defineComponent("quick-search-component", QuickSearch);
