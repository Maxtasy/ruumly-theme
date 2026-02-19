import { CustomComponentMixin, defineComponent } from "./component.js";

export class DropdownTrigger extends CustomComponentMixin(HTMLButtonElement) {
  constructor() {
    super();

    this.handle = this.parsedData.handle;
    this.active = false;

    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.subscribe("click", this.handleClick);
  }

  disonnectedCallback() {
    this.unsubscribe("click", this.handleClick);
  }

  handleClick() {
    this.active = !this.active;

    this.iconElement.classList.toggle("DropdownTrigger__Icon--Active", this.active);

    this.publish("dropdown-trigger:click", {
      handle: this.handle,
      active: this.active,
    });
  }

  get iconElement() {
    return this.querySelector(".DropdownTrigger__Icon");
  }
}

defineComponent("dropdown-trigger-component", DropdownTrigger, "button");
