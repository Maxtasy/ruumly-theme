import { CustomComponentMixin, defineComponent } from "./component.js";

export class AnnouncementBar extends CustomComponentMixin(HTMLDivElement) {
  constructor() {
    super();

    this.index = 0;
    this.autoscrollTimeout = 2000;
    this.interactionTimeout = 5000;
    this.interval = null;
    this.timeout = null;

    this.determineSlidability();

    this.subscribe("touchstart", this.pause.bind(this));
    window.addEventListener("resize", this.determineSlidability.bind(this));
  }

  activateSlider() {
    this.classList.add("AnnouncementBar--Slider");

    this.start();
  }

  deactivateSlider() {
    this.classList.remove("AnnouncementBar--Slider");

    this.stop();
  }

  determineSlidability() {
    const totalChildrenWidth = [...this.children].reduce((totalWidth, child) => {
      return (totalWidth += child.children[0].offsetWidth);
    }, 0);

    if (totalChildrenWidth > this.offsetWidth) {
      this.activateSlider();
    } else {
      this.deactivateSlider();
    }
  }

  next() {
    this.index = this.index + 1;

    if (this.index >= this.announcementItemElements.length) {
      this.index = 0;
    }

    this.announcementItemElements[this.index].scrollIntoView({
      block: "nearest",
      behavior: "smooth",
      container: "nearest",
    });
  }

  start() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.next();
    }, this.autoscrollTimeout);
  }

  stop() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

  pause() {
    clearInterval(this.interval);

    this.timeout = setTimeout(() => {
      this.start();
    }, this.interactionTimeout);
  }

  get announcementItemElements() {
    return this.closest(".Section").querySelectorAll(".AnnouncementBar > *");
  }
}

defineComponent("announcement-bar-component", AnnouncementBar, "div");
