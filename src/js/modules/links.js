import Jump from 'jump.js';

export default function () {
  const logoLink = document.querySelector('#logo-link');
  const aboutLink = document.querySelector('#about-link');
  const designLink = document.querySelector('#design-link');
  const devLink = document.querySelector('#development-link');
  const contactLink = document.querySelector('#contact-link');
  const learnBtnLink = document.querySelector('#learn-more-button');
  const downArrwLink = document.querySelector('#hero-down-arrow');
  const footALink = document.querySelector('#footer-link-a');
  const footBLink = document.querySelector('#footer-link-b');
  const contactBtn = document.querySelector('#contact-button');

  const topEl = document.querySelector('#hero');
  const aboutEl = document.querySelector('#about');
  const designEl = document.querySelector('#design');
  const devEl = document.querySelector('#development');
  const contactEl = document.querySelector('#contact');

  const linkJump = new Jump();

  logoLink.addEventListener('click', function (event) {
    event.preventDefault();
    linkJump.jump(topEl, {
      duration: 1000,
    });
  });

  aboutLink.addEventListener('click', function (event) {
    event.preventDefault();
    linkJump.jump(aboutEl, {
      duration: 1000,
    });
  });

  learnBtnLink.addEventListener('click', function (event) {
    event.preventDefault();
    linkJump.jump(aboutEl, {
      duration: 1000,
    });
  });

  downArrwLink.addEventListener('click', function (event) {
    event.preventDefault();
    linkJump.jump(aboutEl, {
      duration: 1000,
    });
  });

  designLink.addEventListener('click', function (event) {
    event.preventDefault();
    linkJump.jump(designEl, {
      duration: 1000,
    });
  });

  devLink.addEventListener('click', function (event) {
    event.preventDefault();
    linkJump.jump(devEl, {
      duration: 1000,
    });
  });

  contactLink.addEventListener('click', function (event) {
    event.preventDefault();
    linkJump.jump(contactEl, {
      duration: 1000,
    });
  });

  footALink.addEventListener('click', function (event) {
    event.preventDefault();
    linkJump.jump(topEl, {
      duration: 1000,
    });
  });

  footBLink.addEventListener('click', function (event) {
    event.preventDefault();
    linkJump.jump(topEl, {
      duration: 1000,
    });
  });

  contactBtn.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = "mailto:info@brinkcommerce.com?subject=Hi there Brink Commerce!";
  });
}