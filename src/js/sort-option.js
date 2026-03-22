import { CustomComponentMixin, defineComponent } from "./component.js";

export class SortOption extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.subscribe("click", this.handleClick);
  }

  disconnectedCallback() {
    this.unsubscribe("click", this.handleClick);
  }

  handleClick() {
    this.publish("sort-by:change");
  }
}

defineComponent("sort-option-component", SortOption);
