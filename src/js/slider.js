import { CustomComponentMixin, defineComponent } from "./component.js";

export class Slider extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.currentIndex = 0;

    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:prev", this.handlePrevClick);
    this.subscribe("button:click:next", this.handleNextClick);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:prev", this.handlePrevClick);
    this.unsubscribe("button:click:next", this.handleNextClick);
  }

  handlePrevClick() {
    if (this.currentIndex <= 0) return;

    this.currentIndex--;

    this.nextButtonElement.enable();

    if (this.currentIndex === 0) {
      this.prevButtonElement.disable();
    }

    this.updateSlider();
  }

  handleNextClick() {
    if (this.currentIndex >= this.slideItemElements.length - 1) return;

    this.currentIndex++;

    this.prevButtonElement.enable();

    if (this.currentIndex === this.slideItemElements.length - 1) {
      this.nextButtonElement.disable();
    }

    this.updateSlider();
  }

  updateSlider() {
    this.slideItemElements[this.currentIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  get slideItemElements() {
    return this.querySelectorAll(".Slider__Inner > *");
  }

  get prevButtonElement() {
    return this.querySelector('[data-action="prev"]');
  }

  get nextButtonElement() {
    return this.querySelector('[data-action="next"]');
  }
}

defineComponent("slider-component", Slider);
