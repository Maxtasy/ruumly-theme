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

  disconnectedCallback() {
    this.unsubscribe("click", this.handleClick);
  }

  handleClick() {
    if (this.active) {
      this.setInactive();
      this.connectedContentElement?.hide();
    } else {
      this.setActive();
      this.connectedContentElement?.show();
    }
  }

  setActive() {
    this.active = true;

    this.iconElement.classList.add("DropdownTrigger__Icon--Active");
  }

  setInactive() {
    this.active = false;

    this.iconElement.classList.remove("DropdownTrigger__Icon--Active");
  }

  get connectedContentElement() {
    return document.querySelector(`.DropdownContent[data-handle="${this.handle}"]`);
  }

  get iconElement() {
    return this.querySelector(".DropdownTrigger__Icon");
  }
}

defineComponent("dropdown-trigger-component", DropdownTrigger, "button");
