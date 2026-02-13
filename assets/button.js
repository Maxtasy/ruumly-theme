import { CustomComponentMixin, defineComponent } from "./component.js";

export class Button extends CustomComponentMixin(HTMLButtonElement) {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.subscribe("click", this.handleClick);
  }

  disonnectedCallback() {
    this.unsubscribe("click", this.handleClick);
  }

  handleClick() {
    this.publish(`button:click`, this.parsedData.eventDetails);
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }
}

defineComponent("button-component", Button, "button");
