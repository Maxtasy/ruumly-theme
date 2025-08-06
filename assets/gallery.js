import { CustomComponentMixin, defineComponent } from "./component.js";

class Gallery extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.subscribe("button:click:prev", this.handlePrevClick.bind(this));

    this.subscribe("button:click:next", this.handleNextClick.bind(this));
  }

  handlePrevClick() {
    console.log("prev");
  }

  handleNextClick() {
    console.log("next");
  }

  get mediaItemElements() {
    return this.querySelectorAll(".Gallery__Item");
  }
}

defineComponent("gallery-component", Gallery, "div");
