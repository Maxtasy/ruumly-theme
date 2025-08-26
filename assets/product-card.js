import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";

export class ProductCard extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.hasOnlyDefaultVariant = this.parsedData.hasOnlyDefaultVariant;
    this.selectedVariantId = this.parsedData.selectedVariantId;

    this.handleQuickAddClick = this.handleQuickAddClick.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:quick-add", this.handleQuickAddClick);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:quick-add", this.handleQuickAddClick);
  }

  async handleQuickAddClick() {
    if (this.hasOnlyDefaultVariant) {
      const response = await cart.addItem({
        item: { id: this.selectedVariantId, quantity: 1 },
        sections: "cart-drawer",
      });

      if (response.items && response.sections) {
        const { items, sections } = response;

        this.publish("product-card:item-added", { items, sections });
      }
    }
  }
}

defineComponent("product-card-component", ProductCard, "article");
