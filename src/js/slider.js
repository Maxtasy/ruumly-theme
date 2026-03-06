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
    this.currentIndex--;

    this.nextButtonElement.enable();

    if (this.reachedStart()) {
      this.prevButtonElement.disable();
    }

    this.updateSlider();
  }

  handleNextClick() {
    this.currentIndex++;

    this.prevButtonElement.enable();

    if (this.reachedEnd()) {
      this.nextButtonElement.disable();
    }

    this.updateSlider();
  }

  updateSlider() {
    this.slideItemElements[this.currentIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  reachedStart() {
    // Returns true if the second slide item is completely visible in the slider viewport.
    const secondSlideItem = this.slideItemElements[1];
    const sliderRect = this.getBoundingClientRect();
    const secondSlideItemRect = secondSlideItem.getBoundingClientRect();

    return secondSlideItemRect.left >= sliderRect.left;
  }

  reachedEnd() {
    // Returns true if the second to last slide item is completely visible in the slider viewport.
    const secondToLastSlideItem = this.slideItemElements[this.slideItemElements.length - 2];
    const sliderRect = this.getBoundingClientRect();
    const secondToLastSlideItemRect = secondToLastSlideItem.getBoundingClientRect();

    return secondToLastSlideItemRect.right <= sliderRect.right;
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
