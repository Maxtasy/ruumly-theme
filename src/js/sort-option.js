import { CustomComponentMixin, defineComponent } from "./component.js";

export class SortOption extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.url = this.parsedData.url;

    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.subscribe("click", this.handleClick);
  }

  disconnectedCallback() {
    this.unsubscribe("click", this.handleClick);
  }

  handleClick() {
    this.publish("sort-by:change", { url: this.url });
  }
}

defineComponent("sort-option-component", SortOption);
