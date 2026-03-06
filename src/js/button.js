import { CustomComponentMixin, defineComponent } from "./component.js";

export class Button extends CustomComponentMixin(HTMLElement) {
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
    this.publish(`button:click`, this.parsedData.eventDetails);

    this.loadingElement?.classList.add("Button__Loading--Active");
  }

  disable() {
    if (!this.nativeButtonElement) return;

    this.nativeButtonElement.disabled = true;
  }

  enable() {
    if (!this.nativeButtonElement) return;

    this.nativeButtonElement.disabled = false;
  }

  get loadingElement() {
    return this.querySelector(".Button__Loading");
  }

  get nativeButtonElement() {
    return this.querySelector("button");
  }
}

defineComponent("button-component", Button);
