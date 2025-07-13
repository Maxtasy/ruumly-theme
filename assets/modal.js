import { CustomComponentMixin, defineComponent } from "./component.js";

class Modal extends CustomComponentMixin(HTMLDialogElement) {
  constructor() {
    super();

    this.name = this.parsedData.name;

    this.handleOpenEvent = this.handleOpenEvent.bind(this);
    this.handleCloseEvent = this.handleCloseEvent.bind(this);
    this.handleClickEvent = this.handleClickEvent.bind(this);

    this.isClickOutside = this.isClickOutside.bind(this);
    this.close = this.close.bind(this);
  }

  connectedCallback() {
    globalThis.subscribe(`button:click:open-modal:${this.name}`, this.handleOpenEvent);

    this.subscribe("button:click:close", this.handleCloseEvent);

    this.subscribe("click", this.handleClickEvent);
  }

  disconnectedCallback() {
    globalThis.unsubscribe(`button:click:open-modal:${this.name}`, this.handleOpenEvent);

    this.unsubscribe("button:click:close", this.handleCloseEvent);

    this.unsubscribe("click", this.handleClickEvent);
  }

  handleOpenEvent() {
    this.showModal();
  }

  handleCloseEvent() {
    this.close();
  }

  handleClickEvent(event) {
    if (this.isClickOutside(event)) {
      this.close();
    }
  }

  isClickOutside(clickEvent) {
    const rect = this.getBoundingClientRect();
    const isInDialog =
      rect.top <= clickEvent.clientY &&
      clickEvent.clientY <= rect.top + rect.height &&
      rect.left <= clickEvent.clientX &&
      clickEvent.clientX <= rect.left + rect.width;

    return !isInDialog;
  }
}

defineComponent("modal-component", Modal, "dialog");
