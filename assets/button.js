import { CustomComponentMixin, defineComponent } from "./component.js";

export class Button extends CustomComponentMixin(HTMLButtonElement) {
  constructor() {
    super();

    this.subscribe("click", this.handleClick.bind(this));
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
