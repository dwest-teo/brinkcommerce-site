import Jump from 'jump.js';

const linkJump = new Jump();

function jumpToSection (event) {
  event.preventDefault();
  let targetId = event.target.getAttribute('href');
  let targetEl = document.querySelector(targetId);

  linkJump.jump(targetEl, {
    duration: 1000,
  });
}

function jumpToTop (event) {
  event.preventDefault();
  linkJump.jump(-window.pageYOffset, {
    duration: 1000,
  });
}

export default function () {
  const jumpLinks = document.querySelectorAll('[data-jump]');
  for (let i = 0; i < jumpLinks.length; ++i) {
    jumpLinks[i].addEventListener('click', jumpToSection, false);
  }

  const topLinks = document.querySelectorAll('[data-top]');
  for (let i = 0; i < topLinks.length; ++i) {
    topLinks[i].addEventListener('click', jumpToTop, false);
  }
}