export default {
  SETTINGS: {
    breakpoint: 1200,
    arrow_left: `<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.8" d="M7 1L2 6L7 11" stroke="black" stroke-width="2"/>
    </svg>`,
    arrow_right: `<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.8" d="M1 1L6 6L1 11" stroke="black" stroke-width="2"/>
    </svg>`,
  },
  TEMPLATE(arrow,dropdown) {
    return `<div class="category-wrapper">
    <div class="category-slide">
    <div class="category-left"></div>
    <div class="category-scroll"><div class="category-list"></div></div>
    <div class="category-right"></div>
    </div><dropdown-el></dropdown-el></div>`;
  }
}