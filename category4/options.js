export default {
  SETTINGS: {
    breakpoint: 1200,
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