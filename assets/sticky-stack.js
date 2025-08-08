class StickyStack {
  constructor() {
    this.stickyElements = [];

    this.totalStickyHeight = 0;
  }

  addElement(element) {
    this.stickyElements.push(element);

    this.updateStickyElements();
  }

  removeElement(element) {
    this.stickyElements = this.stickyElements.filter((e) => element !== e);

    this.updateStickyElements();
  }

  updateStickyElements() {
    let offsetHeight = 0;

    this.stickyElements.forEach((element) => {
      element.closest(".MaybeStickySection").style.setProperty("--sticky-top-offset", `${offsetHeight}px`);

      offsetHeight += element.height;
    });

    this.totalStickyHeight = offsetHeight;

    document.body.style.setProperty("--total-sticky-height", `${this.totalStickyHeight}px`);
  }
}

export const stickyStack = new StickyStack();
