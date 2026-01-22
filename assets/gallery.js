import { CustomComponentMixin, defineComponent } from "./component.js";

class Gallery extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.currentIndex = 0;

    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:prev", this.handlePrevClick);

    this.subscribe("button:click:next", this.handleNextClick);
  }

  handlePrevClick() {
    if (this.currentIndex <= 0) return;

    this.currentIndex -= 1;

    this.nextButtonElement.enable();

    if (this.currentIndex === 0) {
      this.prevButtonElement.disable();
    }

    this.updateImage();

    this.updatePagination();
  }

  handleNextClick() {
    if (this.currentIndex >= this.mediaItemElements.length - 1) return;

    this.currentIndex += 1;

    this.prevButtonElement.enable();

    if (this.currentIndex === this.mediaItemElements.length - 1) {
      this.nextButtonElement.disable();
    }

    this.updateImage();

    this.updatePagination();
  }

  updateImage() {
    this.mediaItemElements[this.currentIndex].scrollIntoView({
      behavior: "smooth",
      // Scrolls the view port up to the gallery
      block: "center",
    });
  }

  updatePagination() {
    this.paginationItemElements.forEach((paginationItemElement, index) => {
      paginationItemElement.classList.toggle("PaginationItem--Active", this.currentIndex === index);
    });
  }

  get mediaItemElements() {
    return this.querySelectorAll(".Gallery__Item");
  }

  get paginationItemElements() {
    return this.querySelectorAll(".PaginationItem");
  }

  get prevButtonElement() {
    return this.querySelector('[data-action="prev"]');
  }

  get nextButtonElement() {
    return this.querySelector('[data-action="next"]');
  }
}

defineComponent("gallery-component", Gallery, "div");
