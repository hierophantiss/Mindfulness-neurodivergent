/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "og-image.svg",
    "revision": "2cd92e2918d832828b669d279e3fc3c7"
  }, {
    "url": "mms-test.html",
    "revision": "dfdf2e4435bf92d241207f7112b09fea"
  }, {
    "url": "journey.html",
    "revision": "a531ec6e4d3410e2c2dc8c5d5a131f71"
  }, {
    "url": "index.html",
    "revision": "af62be030dc6067378399ffdaeaaa5d0"
  }, {
    "url": "favicon.svg",
    "revision": "8bcbff6645dc3c9a262baa234f857c1e"
  }, {
    "url": "breathchapter.svg",
    "revision": "4b2ce09361f842d4661216f8bd7687f1"
  }, {
    "url": "assets/zap-qLau67WB.js",
    "revision": null
  }, {
    "url": "assets/youtube-Dq3PEBlO.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-BBnX5xw4.js",
    "revision": null
  }, {
    "url": "assets/waves-CCmDvPu4.js",
    "revision": null
  }, {
    "url": "assets/volume-x-s_02dz_1.js",
    "revision": null
  }, {
    "url": "assets/volume-2-BPCWGt1s.js",
    "revision": null
  }, {
    "url": "assets/useBinauralAudio-BUw5rhET.js",
    "revision": null
  }, {
    "url": "assets/target-i6nLdmKu.js",
    "revision": null
  }, {
    "url": "assets/shield-check-DodV6Any.js",
    "revision": null
  }, {
    "url": "assets/play-2NR5ceKE.js",
    "revision": null
  }, {
    "url": "assets/pause-C6NixkwP.js",
    "revision": null
  }, {
    "url": "assets/moon-CPt0jaT3.js",
    "revision": null
  }, {
    "url": "assets/microdoses-5_Nolbtu.js",
    "revision": null
  }, {
    "url": "assets/lightbulb-XV3_1VA1.js",
    "revision": null
  }, {
    "url": "assets/languages-CkhgdpJO.js",
    "revision": null
  }, {
    "url": "assets/index-Pw4Zi0bb.js",
    "revision": null
  }, {
    "url": "assets/index-D4iu8wZ8.css",
    "revision": null
  }, {
    "url": "assets/heart-ChidFg6E.js",
    "revision": null
  }, {
    "url": "assets/headphones-CjnxhKca.js",
    "revision": null
  }, {
    "url": "assets/focus-_o1Ubifg.js",
    "revision": null
  }, {
    "url": "assets/course-en-Bh62V33I.js",
    "revision": null
  }, {
    "url": "assets/circle-check-DlAdezsC.js",
    "revision": null
  }, {
    "url": "assets/chevron-left-peKF6ymt.js",
    "revision": null
  }, {
    "url": "assets/arrow-left-DryT7FCf.js",
    "revision": null
  }, {
    "url": "assets/TaiChiHero-CNtV9SfC.js",
    "revision": null
  }, {
    "url": "assets/Skeleton-CuWpQQam.js",
    "revision": null
  }, {
    "url": "assets/Settings-BR10xRvR.js",
    "revision": null
  }, {
    "url": "assets/Sanctuary-CrMKYdcH.js",
    "revision": null
  }, {
    "url": "assets/SamathaAnimation-DNDsL9Zs.js",
    "revision": null
  }, {
    "url": "assets/RabbitHole-DXm4fJQg.js",
    "revision": null
  }, {
    "url": "assets/ProgramWeek-D_EXT4ZN.js",
    "revision": null
  }, {
    "url": "assets/Program-BUJ6gBLT.js",
    "revision": null
  }, {
    "url": "assets/PrintWorkbook-DkiloMJc.js",
    "revision": null
  }, {
    "url": "assets/PracticeSwaying-D3jeDh4P.js",
    "revision": null
  }, {
    "url": "assets/PracticeSection-D4plb2j8.js",
    "revision": null
  }, {
    "url": "assets/PracticeMovement-TnfoUH_K.js",
    "revision": null
  }, {
    "url": "assets/PracticeMicrodoses-CUjsZAyT.js",
    "revision": null
  }, {
    "url": "assets/PracticeBreath-vbxlYohn.js",
    "revision": null
  }, {
    "url": "assets/Practice-j7gNoASW.js",
    "revision": null
  }, {
    "url": "assets/PlayPauseOverlay-CYWB0F7q.js",
    "revision": null
  }, {
    "url": "assets/Methodology-DDCwviB6.js",
    "revision": null
  }, {
    "url": "assets/Method-C7IMBSlA.js",
    "revision": null
  }, {
    "url": "assets/MeditatorFigure-CdcY7V8i.js",
    "revision": null
  }, {
    "url": "assets/Journal-CRsT8GNj.js",
    "revision": null
  }, {
    "url": "assets/InteractiveBackground-DfwYe4BT.js",
    "revision": null
  }, {
    "url": "assets/GenericExercise-BAFERWDd.js",
    "revision": null
  }, {
    "url": "assets/Faq-32Yf8Lf4.js",
    "revision": null
  }, {
    "url": "assets/Dashboard-B6i1zf-i.js",
    "revision": null
  }, {
    "url": "assets/ConceptInfoOverlay-C97-dNNU.js",
    "revision": null
  }, {
    "url": "assets/Chapters-Vtxsm6aa.js",
    "revision": null
  }, {
    "url": "assets/ChapterDetail-D52hbA-f.js",
    "revision": null
  }, {
    "url": "animations/treepose.html",
    "revision": "3b0103246fa802417c9df596eead2e6e"
  }, {
    "url": "animations/three_attention.html",
    "revision": "a3ce429ba8625818ea34e6ed3547981e"
  }, {
    "url": "animations/samatha_attention.html",
    "revision": "f04fcdbbe1e49e5bb3b9552ce9ef7b49"
  }, {
    "url": "animations/racing_mind.html",
    "revision": "ca24cdf7ee7bf167fe2d4fc1fc85116c"
  }, {
    "url": "animations/openawareness.html",
    "revision": "6e6959d919864b821a98f0baf0418ef7"
  }, {
    "url": "animations/metronomos.html",
    "revision": "c6577c0b7b25acde1f5a4a5da100049f"
  }, {
    "url": "animations/journey.html",
    "revision": "a531ec6e4d3410e2c2dc8c5d5a131f71"
  }, {
    "url": "animations/gravity_thoughts.html",
    "revision": "9cd7c5e9f63362305405ed2865419f23"
  }, {
    "url": "animations/gravity_thhots.html",
    "revision": "7b9e52dff261239466f5874f81122123"
  }, {
    "url": "animations/eswterikhafh.html",
    "revision": "b7405bac4cf06a90501bdc978138f189"
  }, {
    "url": "animations/camera.html",
    "revision": "baade5b2fb0afc49c124f6af68aa613a"
  }, {
    "url": "animations/camera-hero.html",
    "revision": "d2edd9b2e7fea9f33e71460a4b38b613"
  }, {
    "url": "animations/attention_dispersion.html",
    "revision": "edbe74f9296c54c6f1ba9b4c49c3074e"
  }], {
    "ignoreURLParametersMatching": [/^utm_/, /^fbclid$/, /^lang$/]
  });
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/index.html"), {
    denylist: [/\.(?:pdf|epub)$/, /^\/workbook_/, /^\/animations\//]
  }));

}));
