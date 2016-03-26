import Icons from './modules/icons';
import Font from './modules/webfonts';
import Hero from './modules/hero';
import Menu from './modules/menu';
import Links from './modules/links';

const main = () => {
  Icons('/icons/icons.svg', 10);
  Font('/fonts/roboto.css', 'roboto');
  Hero('#hero');
  Menu('#header');
  Links();
};

document.addEventListener('DOMContentLoaded', main);
