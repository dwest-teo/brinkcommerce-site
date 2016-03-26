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

// google analytics init
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-75587665-1', 'auto');
ga('send', 'pageview');