import { CustomComponentMixin, defineComponent } from "./component.js";

class ProductRecommendations extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    const locale = window.Shopify.locale;
    this.productRecommendationsSectionId = "product-recommendations";
    this.productId = this.parsedData.productId;
    this.recommendationsUrl = `/${locale}/recommendations/products?product_id=${this.productId}&section_id=${this.productRecommendationsSectionId}`;
  }

  connectedCallback() {
    this.observer = new IntersectionObserver((entries) => {
      const isIntersecting = entries.find((entry) => {
        return entry.target === this;
      })?.isIntersecting;

      if (isIntersecting) {
        this.getRecommendations();
      }
    });

    this.observer.observe(this);
  }

  async getRecommendations() {
    const response = await fetch(this.recommendationsUrl);
    const data = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const newSectionElement = doc.querySelector(`.ProductRecommendations[data-product-id='${this.productId}']`);

    this.innerHTML = newSectionElement.innerHTML;

    this.observer.disconnect();
  }
}

defineComponent("product-recommendations-component", ProductRecommendations, "div");
