// load icon svg sprite asynchronously and store in localstorage
export default (file, revision) => {
  if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) {
    return true;
  }

  var isLocalStorage = 'localStorage' in window && window.localStorage !== null;
  var request;
  var data;

  var insertIT = function () {
    document.body.insertAdjacentHTML('afterbegin', data);
  };

  var insert = function () {
    if (document.body) {
      insertIT();
    } else {
      document.addEventListener('DOMContentLoaded', insertIT);
    }
  };

  if (isLocalStorage && localStorage.getItem('inlineSVGrev') == revision) {
    data = localStorage.getItem('inlineSVGdata');
    if (data) {
      insert();
      return true;
    }
  }

  try {
    request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        data = request.responseText;
        insert();
        if (isLocalStorage) {
          localStorage.setItem('inlineSVGdata', data);
          localStorage.setItem('inlineSVGrev', revision);
        }
      }
    };

    request.send();
  }
  catch (e) {}
};
