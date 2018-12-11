module.exports = {
    "globDirectory": "dist/testyo/",
    "globPatterns": [
      "index.html",
    "*.js",
    "*.css",    
      "assets/**/*.png"
    ],
    "dontCacheBustUrlsMatching": new RegExp('.+\.[a-f0-9]{20}\..+'),
    "maximumFileSizeToCacheInBytes": 5000000,
    "swSrc": "src/service-worker.js",
    "swDest": "dist/testyo/service-worker.js"
  };