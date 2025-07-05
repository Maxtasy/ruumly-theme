import { CustomComponentMixin, defineComponent } from "./component.js";

export class Button extends CustomComponentMixin(HTMLButtonElement) {
  constructor() {
    super();

    this.addEventListener("click", this.handleClick.bind(this));
  }

  handleClick(event) {
    // TODO: Publish an event when the button is clicked.
    console.log("clicked button");
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }
}

defineComponent("button-component", Button, "button");
