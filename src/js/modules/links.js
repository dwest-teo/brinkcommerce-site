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

export default function () {
  const jumpLinks = document.querySelectorAll('[data-jump]');

  for (let i = 0; i < jumpLinks.length; ++i) {
    jumpLinks[i].addEventListener('click', jumpToSection, false);
  }
}