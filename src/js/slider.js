import { CustomComponentMixin, defineComponent } from "./component.js";
import { debounce } from "./utils.js";

export class Slider extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.debouncedScrollHandler = debounce(this.handleScroll, 150);
  }

  connectedCallback() {
    this.subscribe("button:click:prev", this.handlePrevClick);
    this.subscribe("button:click:next", this.handleNextClick);
    this.scrollContainerElement.addEventListener("scroll", this.debouncedScrollHandler);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:prev", this.handlePrevClick);
    this.unsubscribe("button:click:next", this.handleNextClick);
    this.scrollContainerElement.removeEventListener("scroll", this.debouncedScrollHandler);
  }

  handleScroll() {
    this.updateNavigationState();
  }

  handlePrevClick() {
    this.scrollItemIntoView(this.leftMostElement.previousElementSibling);
  }

  handleNextClick() {
    this.scrollItemIntoView(this.leftMostElement.nextElementSibling);
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

  scrollItemIntoView(element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  get leftMostElement() {
    return [...this.slideItemElements].find((slideItemElement) => {
      const { left } = slideItemElement.getBoundingClientRect();

      return left >= 0;
    });
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
