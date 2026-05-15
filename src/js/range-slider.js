import { CustomComponentMixin, defineComponent } from "./component.js";

export class Range extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.gap = this.parsedData.gap;
    this.min = parseInt(this.minRangeElement.value);
    this.max = parseInt(this.maxRangeElement.value);

    this.handleMinNumberInput = this.handleMinNumberInput.bind(this);
    this.handleMaxNumberInput = this.handleMaxNumberInput.bind(this);
    this.handleMinRangeInput = this.handleMinRangeInput.bind(this);
    this.handleMaxRangeInput = this.handleMaxRangeInput.bind(this);
  }

  connectedCallback() {
    this.minNumberInputElement.addEventListener("input", this.handleMinNumberInput);
    this.maxNumberInputElement.addEventListener("input", this.handleMaxNumberInput);
    this.minRangeElement.addEventListener("input", this.handleMinRangeInput);
    this.maxRangeElement.addEventListener("input", this.handleMaxRangeInput);
  }

  disconnectedCallback() {
    this.minNumberInputElement.removeEventListener("input", this.handleMinNumberInput);
    this.maxNumberInputElement.removeEventListener("input", this.handleMaxNumberInput);
    this.minRangeElement.removeEventListener("input", this.handleMinRangeInput);
    this.maxRangeElement.removeEventListener("input", this.handleMaxRangeInput);
  }

  handleMinNumberInput() {
    if (this.minNumberInputElement.value < this.min) return;

    if (this.minNumberInputElement.value > this.max - this.gap) return;

    this.min = parseInt(this.minNumberInputElement.value);

    this.minRangeElement.value = this.min;

    this.updateRange();
  }

  handleMaxNumberInput() {
    if (this.maxNumberInputElement.value > this.max) return;

    if (this.maxNumberInputElement.value < this.min + this.gap) return;

    this.max = parseInt(this.maxNumberInputElement.value);

    this.maxRangeElement.value = this.max;

    this.updateRange();
  }

  handleMinRangeInput() {
    if (this.minRangeElement.value > this.max - this.gap) {
      this.minRangeElement.value = this.max - this.gap;

      return;
    }

    this.min = parseInt(this.minRangeElement.value);

    this.minNumberInputElement.value = this.min;

    const leftPositionPercentage = this.getPercentage(this.min);

    this.rangeElement.style.setProperty("--left-percentage", leftPositionPercentage);
  }

  handleMaxRangeInput() {
    if (this.maxRangeElement.value < this.min + this.gap) {
      this.maxRangeElement.value = this.min + this.gap;

      return;
    }

    this.max = parseInt(this.maxRangeElement.value);

    this.maxNumberInputElement.value = this.max;

    const rightPositionPercentage = 100 - this.getPercentage(this.max);

    this.rangeElement.style.setProperty("--right-percentage", rightPositionPercentage);
  }

  getPercentage(value) {
    const min = parseInt(this.minRangeElement.min);
    const max = parseInt(this.minRangeElement.max);

    return ((value - min) / (max - min)) * 100;
  }

  updateRange() {
    const leftPositionPercentage = this.getPercentage(this.min);
    const rightPositionPercentage = 100 - this.getPercentage(this.max);

    this.rangeElement.style.setProperty("--left-percentage", leftPositionPercentage);
    this.rangeElement.style.setProperty("--right-percentage", rightPositionPercentage);
  }

  get minNumberInputElement() {
    return this.querySelector("[data-min-input] input");
  }

  get maxNumberInputElement() {
    return this.querySelector("[data-max-input] input");
  }

  get minRangeElement() {
    return this.querySelector("[data-min-range]");
  }

  get maxRangeElement() {
    return this.querySelector("[data-max-range]");
  }

  get rangeElement() {
    return this.querySelector(".RangeSlider__Range");
  }
}

defineComponent("range-slider-component", Range);
