import { CustomComponentMixin, defineComponent } from "./component.js";

export class VariantQuickView extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.preventMouseLeaveEvent = false;

    this.handleVariantQuickViewClick = this.handleVariantQuickViewClick.bind(this);
    this.handleVariantQuickViewMouseenter = this.handleVariantQuickViewMouseenter.bind(this);
    this.handleVariantQuickViewMouseleave = this.handleVariantQuickViewMouseleave.bind(this);
  }

  connectedCallback() {
    this.variantQuickViewItemElements.forEach((variantQuickViewElement) => {
      variantQuickViewElement.addEventListener("click", this.handleVariantQuickViewClick);
      variantQuickViewElement.addEventListener("mouseenter", this.handleVariantQuickViewMouseenter);
      variantQuickViewElement.addEventListener("mouseleave", this.handleVariantQuickViewMouseleave);
    });
  }

  disconnectedCallback() {
    this.variantQuickViewItemElements.forEach((variantQuickViewElement) => {
      variantQuickViewElement.removeEventListener("click", this.handleVariantQuickViewClick);
      variantQuickViewElement.removeEventListener("mouseenter", this.handleVariantQuickViewMouseenter);
      variantQuickViewElement.removeEventListener("mouseleave", this.handleVariantQuickViewMouseleave);
    });
  }

  handleVariantQuickViewClick(event) {
    const clickedSwatchElement = event.currentTarget.querySelector(".Swatch");

    const optionValueName = event.currentTarget.getAttribute("data-option-value-name");

    this.publish("variant-quick-view:click", { optionValueName });

    this.variantQuickViewItemElements.forEach((variantQuickViewItemElement) => {
      const swatchElement = variantQuickViewItemElement.querySelector(".Swatch");

      swatchElement.classList.toggle("Swatch--Active", clickedSwatchElement === swatchElement);
    });

    this.preventMouseLeaveEvent = true;
  }

  handleVariantQuickViewMouseenter(event) {
    const optionValueName = event.target.getAttribute("data-option-value-name");
    this.publish("variant-quick-view:mouseenter", { optionValueName });
  }

  handleVariantQuickViewMouseleave(event) {
    if (this.preventMouseLeaveEvent) {
      this.preventMouseLeaveEvent = false;
      return;
    }

    const optionValueName = event.target.getAttribute("data-option-value-name");
    this.publish("variant-quick-view:mouseleave", { optionValueName });
  }

  get variantQuickViewItemElements() {
    return this.querySelectorAll(".VariantQuickView__Item");
  }
}

defineComponent("variant-quick-view-component", VariantQuickView);
