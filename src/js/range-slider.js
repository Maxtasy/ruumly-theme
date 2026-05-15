import { CustomComponentMixin, defineComponent } from "./component.js";
import { debounce } from "./utils.js";

export class Range extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.gap = this.parsedData.gap;
    this.min = parseInt(this.minRangeElement.min);
    this.max = parseInt(this.minRangeElement.max);
    this.selectedMin = parseInt(this.minRangeElement.value);
    this.selectedMax = parseInt(this.maxRangeElement.value);

    this.handleMinNumberInput = this.handleMinNumberInput.bind(this);
    this.handleMaxNumberInput = this.handleMaxNumberInput.bind(this);
    this.handleMinRangeInput = this.handleMinRangeInput.bind(this);
    this.handleMaxRangeInput = this.handleMaxRangeInput.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);

    this.debouncedMinNumberInputHandler = debounce(this.handleMinNumberInput, 300);
    this.debouncedMaxNumberInputHandler = debounce(this.handleMaxNumberInput, 300);
  }

  connectedCallback() {
    this.minNumberInputElement.addEventListener("input", this.debouncedMinNumberInputHandler);
    this.maxNumberInputElement.addEventListener("input", this.debouncedMaxNumberInputHandler);
    this.minRangeElement.addEventListener("input", this.handleMinRangeInput);
    this.maxRangeElement.addEventListener("input", this.handleMaxRangeInput);
    this.minRangeElement.addEventListener("change", this.handleRangeChange);
    this.maxRangeElement.addEventListener("change", this.handleRangeChange);
  }

  disconnectedCallback() {
    this.minNumberInputElement.removeEventListener("input", this.debouncedMinNumberInputHandler);
    this.maxNumberInputElement.removeEventListener("input", this.debouncedMaxNumberInputHandler);
    this.minRangeElement.removeEventListener("input", this.handleMinRangeInput);
    this.maxRangeElement.removeEventListener("input", this.handleMaxRangeInput);
    this.minRangeElement.removeEventListener("change", this.handleRangeChange);
    this.maxRangeElement.removeEventListener("change", this.handleRangeChange);
  }

  handleMinNumberInput() {
    if (this.minNumberInputElement.value < this.min || !this.minNumberInputElement.value) return;

    if (this.minNumberInputElement.value > this.selectedMax - this.gap) return;

    this.selectedMin = parseInt(this.minNumberInputElement.value);

    this.minRangeElement.value = this.selectedMin;

    this.updateRange();
  }

  handleMaxNumberInput() {
    if (this.maxNumberInputElement.value > this.max || !this.maxNumberInputElement.value) return;

    if (this.maxNumberInputElement.value < this.selectedMin + this.gap) return;

    this.selectedMax = parseInt(this.maxNumberInputElement.value);

    this.maxRangeElement.value = this.selectedMax;

    this.updateRange();
  }

  handleMinRangeInput() {
    if (this.minRangeElement.value > this.selectedMax - this.gap) {
      this.minRangeElement.value = this.selectedMax - this.gap;

      return;
    }

    this.selectedMin = parseInt(this.minRangeElement.value);

    this.minNumberInputElement.value = this.selectedMin;

    const leftPositionPercentage = this.getPercentage(this.selectedMin);

    this.rangeElement.style.setProperty("--left-percentage", leftPositionPercentage);
  }

  handleMaxRangeInput() {
    if (this.maxRangeElement.value < this.selectedMin + this.gap) {
      this.maxRangeElement.value = this.selectedMin + this.gap;

      return;
    }

    this.selectedMax = parseInt(this.maxRangeElement.value);

    this.maxNumberInputElement.value = this.selectedMax;

    const rightPositionPercentage = 100 - this.getPercentage(this.selectedMax);

    this.rangeElement.style.setProperty("--right-percentage", rightPositionPercentage);
  }

  handleRangeChange() {
    this.publish("range-slider:change", { selectedMin: this.selectedMin, selectedMax: this.selectedMax });
  }

  getPercentage(value) {
    const min = parseInt(this.minRangeElement.min);
    const max = parseInt(this.minRangeElement.max);

    return ((value - min) / (max - min)) * 100;
  }

  updateRange() {
    const leftPositionPercentage = this.getPercentage(this.selectedMin);
    const rightPositionPercentage = 100 - this.getPercentage(this.selectedMax);

    this.rangeElement.style.setProperty("--left-percentage", leftPositionPercentage);
    this.rangeElement.style.setProperty("--right-percentage", rightPositionPercentage);

    this.publish("range-slider:change", { selectedMin: this.selectedMin, selectedMax: this.selectedMax });
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
