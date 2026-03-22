import { CustomComponentMixin, defineComponent } from "./component.js";

export class SortOption extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.sortOptionValue = this.parsedData.sortOptionValue;

    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.subscribe("click", this.handleClick);
  }

  disconnectedCallback() {
    this.unsubscribe("click", this.handleClick);
  }

  handleClick() {
    this.publish("sort-by:change", { sortOptionValue: this.sortOptionValue });
  }
}

defineComponent("sort-option-component", SortOption);
