import { cart } from "./cart.js";
import { CustomComponentMixin, defineComponent } from "./component.js";
import { getClosestSectionId } from "./utils.js";

export class ProductCard extends CustomComponentMixin(HTMLElement) {
  constructor() {
    super();

    this.activeVariantImageElement = this.variantImageElements[0];

    this.hasOnlyDefaultVariant = this.parsedData.hasOnlyDefaultVariant;
    this.selectedVariantId = this.parsedData.selectedVariantId;
    this.inventoryQuantity = this.parsedData.inventoryQuantity;

    this.handleQuickAddClick = this.handleQuickAddClick.bind(this);
    this.handleCartDrawerUpdated = this.handleCartDrawerUpdated.bind(this);
    this.handleVarientQuickViewMouseenter = this.handleVarientQuickViewMouseenter.bind(this);
    this.handleVarientQuickViewMouseleave = this.handleVarientQuickViewMouseleave.bind(this);
    this.handleVarientQuickViewClick = this.handleVarientQuickViewClick.bind(this);
  }

  connectedCallback() {
    this.subscribe("button:click:quick-add", this.handleQuickAddClick);
    this.subscribe("variant-quick-view:mouseenter", this.handleVarientQuickViewMouseenter);
    this.subscribe("variant-quick-view:mouseleave", this.handleVarientQuickViewMouseleave);
    this.subscribe("variant-quick-view:click", this.handleVarientQuickViewClick);

    globalThis.subscribe("cart-drawer:updated", this.handleCartDrawerUpdated);
  }

  disconnectedCallback() {
    this.unsubscribe("button:click:quick-add", this.handleQuickAddClick);
    this.unsubscribe("variant-quick-view:mouseenter", this.handleVarientQuickViewMouseenter);
    this.unsubscribe("variant-quick-view:mouseleave", this.handleVarientQuickViewMouseleave);
    this.unsubscribe("variant-quick-view:click", this.handleVarientQuickViewClick);

    globalThis.unsubscribe("cart-drawer:updated", this.handleCartDrawerUpdated);
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

  handleVarientQuickViewMouseenter(data) {
    const connectedImageElement = this.getConnectedImageElement(data.optionValueName);
    const connectedImageElementCopy = connectedImageElement.cloneNode(true);

    connectedImageElementCopy.classList.add("FadeIn");

    this.featuredImageElement.parentElement.append(connectedImageElementCopy);

    this.featuredImageElement.remove();

    setTimeout(() => {
      connectedImageElementCopy.classList.add("FadeIn--Finished");
    }, 300);
  }

  handleVarientQuickViewMouseleave() {
    const activeVariantImageElementCopy = this.activeVariantImageElement.cloneNode(true);

    activeVariantImageElementCopy.classList.add("FadeIn");

    this.featuredImageElement.parentElement.append(activeVariantImageElementCopy);
    this.featuredImageElement.remove();

    setTimeout(() => {
      activeVariantImageElementCopy.classList.add("FadeIn--Finished");
    }, 300);
  }

  handleVarientQuickViewClick(data) {
    const connectedImageElement = this.getConnectedImageElement(data.optionValueName);

    this.activeVariantImageElement = connectedImageElement;
  }

  getConnectedImageElement(optionValueName) {
    return [...this.variantImageElements].find((variantImageElement) => {
      return variantImageElement.alt.toLowerCase().includes(optionValueName.toLowerCase());
    });
  }

  get quickAddButtonElement() {
    return this.querySelector('[data-action="quick-add"]');
  }

  get variantImageElements() {
    return this.querySelectorAll(".ProductCard__VariantImage .Image img");
  }

  get featuredImageElement() {
    return this.querySelector(".ProductCard__Image .Image img");
  }
}

defineComponent("product-card-component", ProductCard);
