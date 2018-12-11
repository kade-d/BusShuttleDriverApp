importScripts('workbox-3.6.3/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-3.6.3/'
});
workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    new RegExp('/api/.*\.json'),
    workbox.strategies.networkOnly({
      plugins: [
        new workbox.backgroundSync.Plugin('requestsQueue', {
          maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
        })
      ]
    }),
    'POST'
  )

//   /(http[s]?:\/\/)?([^\/\s]+\/)/