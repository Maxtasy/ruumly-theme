import { CustomComponentMixin, defineComponent } from "./component.js";

export class DropdownTrigger extends CustomComponentMixin(HTMLElement) {
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

    this.classList.add("DropdownTrigger--Active");
  }

  setInactive() {
    this.active = false;

    this.classList.remove("DropdownTrigger--Active");
  }

  get connectedContentElement() {
    return document.querySelector(`.DropdownContent[data-handle="${this.handle}"]`);
  }
}

defineComponent("dropdown-trigger-component", DropdownTrigger);
