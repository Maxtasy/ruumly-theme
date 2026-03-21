import { CustomComponentMixin, defineComponent } from "./component.js";

export class FilterValue extends CustomComponentMixin(HTMLElement) {
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
    this.publish("filter-value:change", { url: this.url });
  }
}

defineComponent("filter-value-component", FilterValue);
