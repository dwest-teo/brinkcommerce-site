import Icons from './modules/icons';
import Font from './modules/webfonts';
import Hero from './modules/hero';
import Menu from './modules/menu';
import Links from './modules/links';
import Contact from './modules/contact';

const main = () => {
  Icons('/icons/icons.svg', 11);
  Font('/fonts/roboto.css', 'roboto');
  Hero('#hero');
  Menu('#header');
  Links();
  Contact();
};

document.addEventListener('DOMContentLoaded', main);