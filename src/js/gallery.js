import { CustomComponentMixin, defineComponent } from "./component.js";
import { debounce } from "./utils.js";

class Gallery extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.currentIndex = 0;

    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
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

  handlePrevClick() {
    this.scrollItemIntoView(this.leftMostElement.previousElementSibling);
  }

  handleNextClick() {
    this.scrollItemIntoView(this.leftMostElement.nextElementSibling);
  }

  handleScroll() {
    this.updateNavigationState();

    this.updatePagination();
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

  updatePagination() {
    const leftMostElement = this.leftMostElement;
    let activeIndex;

    this.mediaItemElements.forEach((mediaItemElement, index) => {
      if (mediaItemElement === leftMostElement) {
        activeIndex = index;
      }
    });

    this.paginationItemElements.forEach((paginationItemElement, index) => {
      paginationItemElement.classList.toggle("PaginationItem--Active", activeIndex === index);
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

  get scrollContainerElement() {
    return this.querySelector(".Gallery__Media");
  }

  get leftMostElement() {
    return [...this.mediaItemElements].find((mediaItemElement) => {
      const { left } = mediaItemElement.getBoundingClientRect();

      return left >= 0;
    });
  }
}

defineComponent("gallery-component", Gallery);
