class SectionRenderingApi {
  constructor() {
    this.baseUrl = `${window.routes.home}?sections=`;
  }

  // `context` can be used to render the sections in a specific context (e.g., a product page).
  // Values: 'product', 'collection', 'cart', etc.
  async fetchSections(sectionIds, context) {
    const response = await fetch(`${this.baseUrl}${context ? `${context}/` : ""}${sectionIds.join(",")}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sections");
    }

    const data = await response.json();

    return data;
  }
}

export const sectionRenderingApi = new SectionRenderingApi();
