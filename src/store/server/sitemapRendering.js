import fs from 'fs'
import sm from 'sitemap'
import api from './api'

const SITEMAP_EXCLUDE_PATH = ['/', '/checkout', '/checkout-success', '/account', '/cart', '/login', '/logout', '/register'];

const sitemapRendering = (req, res) => {
  Promise.all([
    api.sitemap.list({ enabled: true }),
    api.settings.retrieve()
  ]).then(([sitemapResponse, settingsResponse]) => {
    const urls = sitemapResponse.json.filter(item => item.type !== 'reserved' && item.type !== 'search' && !SITEMAP_EXCLUDE_PATH.includes(item.path)).map(item => item.path)
    const sitemap = sm.createSitemap ({
      hostname: settingsResponse.json.domain,
      urls: urls
    });
    sitemap.toXML((err, xml) => {
      if (err) {
        res.status(500).end();
      }
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    });
  })
}

export default sitemapRendering;
