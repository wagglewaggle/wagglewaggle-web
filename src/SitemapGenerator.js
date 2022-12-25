require('babel-register')({
  presets: ['es2015', 'react'],
});

const router = require('./SitemapRouter').default;
const Sitemap = require('react-router-sitemap').default;

const generateSitemap = () => {
  return new Sitemap(router).build('https://wagglewaggle.co.kr').save('./public/sitemap.xml');
};

generateSitemap();
