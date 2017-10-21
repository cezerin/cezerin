'use strict';
importScripts('/sw-toolbox.js');
toolbox.router.get('/images/*', toolbox.cacheFirst);
toolbox.router.get('/assets/*', toolbox.cacheFirst);
toolbox.router.get('/admin-assets/*', toolbox.cacheFirst);
toolbox.router.get('/api/*', toolbox.networkOnly);
toolbox.router.get('/ajax/payment_form_settings', toolbox.networkOnly);
toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});
