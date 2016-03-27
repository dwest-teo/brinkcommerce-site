  export default function () {
    const contactBtn = document.querySelector('#contact-button');

    contactBtn.addEventListener('click', function (event) {
      event.preventDefault();
      window.location.href = 'mailto:info@brinkcommerce.com?subject=Hi there Brink Commerce!';
    });
  }
