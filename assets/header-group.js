import { debounce } from "./utils.js";

class HeaderGroup {
  constructor() {
    this.totalHeight = 0;

    this.handleDocumentResize = this.handleDocumentResize.bind(this);
    this.debouncedResizeHandler = debounce(this.handleDocumentResize, 150);
  }

  init() {
    this.calculateTotalHeight();
    this.updateCssVariable();

    window.addEventListener("resize", this.debouncedResizeHandler);
  }

  calculateTotalHeight() {
    this.totalHeight = this.sectionElements.reduce((acc, sectionElement) => {
      return (acc += sectionElement.offsetHeight);
    }, 0);
  }

  updateCssVariable() {
    this.documentRoot.style.setProperty("--header-group-height", `${this.totalHeight}px`);
  }

  handleDocumentResize() {
    this.calculateTotalHeight();
    this.updateCssVariable();
  }

  get documentRoot() {
    return document.querySelector(":root");
  }

  get sectionElements() {
    return [...document.querySelectorAll(".shopify-section-group-header-group")];
  }
}

export const headerGroup = new HeaderGroup();
