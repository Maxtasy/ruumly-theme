import { CustomComponentMixin, defineComponent } from "./component.js";

export class Slider extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.currentIndex = 0;

    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:prev", this.handlePrevClick);
    this.subscribe("button:click:next", this.handleNextClick);
    this.scrollContainerElement.addEventListener("scroll", this.handleScroll);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:prev", this.handlePrevClick);
    this.unsubscribe("button:click:next", this.handleNextClick);
    this.scrollContainerElement.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    this.updateNavigationState();
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

  updateNavigationState() {
    const start = this.scrollContainerElement.scrollLeft;
    const end = this.scrollContainerElement.scrollWidth - this.scrollContainerElement.clientWidth;

    if (start <= 0) {
      this.prevButtonElement.disable();
    } else {
      this.prevButtonElement.enable();
    }

    if (start >= end) {
      this.nextButtonElement.disable();
    } else {
      this.nextButtonElement.enable();
    }
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

  get scrollContainerElement() {
    return this.querySelector(".Slider__Inner");
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
