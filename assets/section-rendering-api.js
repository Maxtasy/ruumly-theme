class SectionRenderingAPI {
  constructor() {
    this.baseUrl = `${window.routes.root}?sections=`;
  }

  async fetchSections(sectionIds) {
    const url = new URL(this.baseUrl + sectionIds.join(","));
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sections");
    }

    const data = await response.json();

    return data;
  }
}

export const sectionRenderingAPI = new SectionRenderingAPI();
