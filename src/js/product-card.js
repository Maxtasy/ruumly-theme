import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";
import { getClosestSectionId } from "./utils.js";

export class ProductCard extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.hasOnlyDefaultVariant = this.parsedData.hasOnlyDefaultVariant;
    this.selectedVariantId = this.parsedData.selectedVariantId;
    this.inventoryQuantity = this.parsedData.inventoryQuantity;

    this.handleQuickAddClick = this.handleQuickAddClick.bind(this);
    this.handleCartDrawerUpdated = this.handleCartDrawerUpdated.bind(this);
    this.handleVarientQuickViewMouseenter = this.handleVarientQuickViewMouseenter.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:quick-add", this.handleQuickAddClick);
    globalThis.subscribe("cart-drawer:updated", this.handleCartDrawerUpdated);
    this.subscribe("variant-quick-view:mouseenter", this.handleVarientQuickViewMouseenter);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:quick-add", this.handleQuickAddClick);
    globalThis.unsubscribe("cart-drawer:updated", this.handleCartDrawerUpdated);
    this.unsubscribe("variant-quick-view:mouseenter", this.handleVarientQuickViewMouseenter);
  }

  async handleQuickAddClick(_, event) {
    if (this.hasOnlyDefaultVariant) {
      const buttonElement = event.target;

      buttonElement.setLoading && buttonElement.setLoading(true);

      const response = await cart.addItem({
        item: { id: this.selectedVariantId, quantity: 1 },
        sections: getClosestSectionId(".CartDrawer"),
      });

      if (response.status === "success" && response.data?.items && response.data?.sections) {
        const { items, sections } = response.data;

        this.publish("product-card:item-added", { items, sections });
      } else if (response.data.status === 422) {
        const { message } = response.data;

        this.publish("quick-add:max-quantity-error", { message });
      }

      buttonElement.setLoading && buttonElement.setLoading(false);
    }
  }

  handleCartDrawerUpdated(data) {
    if (!this.quickAddButtonElement) return;

    const { items } = data;
    const quantityInCart = items.find((item) => item.variant_id === this.selectedVariantId)?.quantity || 0;

    if (quantityInCart >= this.inventoryQuantity) {
      this.quickAddButtonElement.disable();
    } else {
      this.quickAddButtonElement.enable();
    }
  }

  handleVarientQuickViewMouseenter() {}

  get quickAddButtonElement() {
    return this.querySelector('[data-action="quick-add"]');
  }

  get connectedImageElement() {
    return this.querySelectorAll(".ProductCard__VariantImage .Image").find();
  }
}

defineComponent("product-card-component", ProductCard);
