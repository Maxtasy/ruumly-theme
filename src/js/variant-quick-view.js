import { CustomComponentMixin, defineComponent } from "./component.js";

export class VariantQuickView extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.handleSwatchClick = this.handleSwatchClick.bind(this);
    this.handleVariantQuickViewMouseenter = this.handleVariantQuickViewMouseenter.bind(this);
    this.handleSwatchMouseleave = this.handleSwatchMouseleave.bind(this);
  }

  connectedCallback() {
    this.variantQuickViewItemElements.forEach((swatchElement) => {
      swatchElement.addEventListener("click", this.handleSwatchClick);
      swatchElement.addEventListener("mouseenter", this.handleVariantQuickViewMouseenter);
      swatchElement.addEventListener("mouseleave", this.handleSwatchMouseleave);
    });
  }

  disconnectedCallback() {
    this.variantQuickViewItemElements.forEach((swatchElement) => {
      swatchElement.removeEventListener("click", this.handleSwatchClick);
      swatchElement.removeEventListener("mouseenter", this.handleVariantQuickViewMouseenter);
      swatchElement.removeEventListener("mouseleave", this.handleSwatchMouseleave);
    });
  }

  handleSwatchClick() {
    console.log(this.parsedData);
    this.publish("variant-quick-view:click", { optionValueName: this.parsedData });
  }

  handleVariantQuickViewMouseenter(event) {
    const optionValueName = event.target.getAttribute("data-option-value-name");
    this.publish("variant-quick-view:mouseenter", { optionValueName });
  }

  handleSwatchMouseleave() {
    console.log("handle mouseleave");
  }

  get variantQuickViewItemElements() {
    return this.querySelectorAll(".VariantQuickView__Item");
  }
}

defineComponent("variant-quick-view-component", VariantQuickView);
