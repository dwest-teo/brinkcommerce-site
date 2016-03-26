// fix jank of height resize on mobile due to url bar
export default (selector) => {
  const viewportHeight = document.documentElement.clientHeight;
  const heroEl = document.querySelector(selector);
  heroEl.style.height = viewportHeight + 'px';

  setTimeout(function () {
    const downArrow = document.querySelector('#hero-down-arrow');
    downArrow.classList.add('active');
  }, 500);
}