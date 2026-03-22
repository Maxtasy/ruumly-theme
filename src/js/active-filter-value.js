import { CustomComponentMixin, defineComponent } from "./component.js";

export class ActiveFilterValue extends CustomComponentMixin(HTMLElement) {
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
    this.publish("active-filter-value:remove", { url: this.url });
  }
}

defineComponent("active-filter-value-component", ActiveFilterValue);
