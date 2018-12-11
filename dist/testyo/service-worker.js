importScripts('workbox-3.6.3/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-3.6.3/'
});
workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "20ff55d7969799505d5038a5143a177a"
  },
  {
    "url": "main.bcd9df2886c0dcfd43cc.js"
  },
  {
    "url": "polyfills.c6871e56cb80756a5498.js"
  },
  {
    "url": "runtime.ec2944dd8b20ec099bf3.js"
  },
  {
    "url": "styles.3bb2a9d4949b7dc120a9.css"
  }
]);

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