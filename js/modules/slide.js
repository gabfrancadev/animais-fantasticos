import debounce from "./debounce.js";
export class Slide {
  constructor(slide, wrapper) {
    this.Slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = "active";
  }
  transition(active) {
    this.Slide.style.transition = active ? "transform .3s" : "";
  }
  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.Slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }
  uptadePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }
  onStart(event) {
    let movetype;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = "touchmove";
    }
    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false);
  }
  onMove(event) {
    if (event.type === "touchmove") event.preventDefault();
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.uptadePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }
  onEnd(event) {
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(movetype, this.onMove);
    const pointerPosition =
      event.type === "mouseup"
        ? event.clientX
        : event.changedTouches[0].clientX;
    this.dist.finalPosition = this.uptadePosition(pointerPosition);
    this.changeSlideOnEnd();
    this.transition(true);
  }
  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }
  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }
  //Slides config
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }
  slidesConfig() {
    this.slideArray = [...this.Slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }
  slideIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(this.slideArray[index].position);
    this.slideIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }
  changeActiveClass() {
    this.slideArray.forEach((item) =>
      item.element.classList.remove(this.activeClass),
    );
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }
  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }
  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }
  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      if (this.index && this.index.active !== undefined) {
        this.changeSlide(this.index.active);
      }
    }, 500);
  }
  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
  }
  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(0);
    return this;
  }
}

export default class SlideNav extends Slide {
  addCustomControl(customControl) {
    this.control = document.querySelector(customControl);
    this.controlArray = [...this.control.children];
    this.controlArray.forEach((item, index) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        this.changeSlide(index);
      });
    });
  }
  changeActiveClass() {
    super.changeActiveClass();

    if (this.controlArray) {
      this.controlArray.forEach((item) =>
        item.classList.remove(this.activeClass),
      );
      this.controlArray[this.index.active].classList.add(this.activeClass);
    }
  }

  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvents();
  }

  addArrowEvents() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }
}
