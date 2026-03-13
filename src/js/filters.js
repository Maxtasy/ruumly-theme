import { CustomComponentMixin, defineComponent } from "./component.js";
import { getClosestSectionId } from "./utils.js";

export class Filters extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
  }

  connectedCallback() {
    this.subscribe("filter-value:change", this.handleFilterValueChange);
  }

  disconnectedCallback() {
    this.unsubscribe("filter-value:change", this.handleFilterValueChange);
  }

  handleFilterValueChange(data) {
    this.fetchSection(data.url);
  }

  async fetchSection(url) {
    console.log(url);
    const sectionId = getClosestSectionId("filters-component");
    console.log(sectionId);

    const response = await fetch(url);
    console.log(response);
  }
}

defineComponent("filters-component", Filters);
