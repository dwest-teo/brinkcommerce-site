import Headroom from 'headroom.js';

export default (selector) => {
  const headerEl = document.querySelector(selector);

  const headroom = new Headroom(headerEl, {
    tolerance: 15,
    classes: {
      initial: 'h-init',
      pinned: 'h-pinned',
      unpinned: 'h-unpinned',
      top: 'h-top',
      notTop: 'h-nottop',
    },
  });
  headroom.init();
};
