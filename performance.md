# How I debugged performance

- enable [webpack bundle analyzer](https://docs.expo.io/versions/latest/guides/web-performance/#-what-makes-my-app-large)
- from here you can see which packages are causing trouble (the biggest ones)
  - in my case `text-encoding` was the problem
- to find where `text-encoding` was being used I did a quick search through my codebase
  - no direct imports were present
- next I ran `yarn why text-encoding` which revealed that `expo-three -> @expo/browser-polyfill` depended on it.
  - But that library shouldn't do anything because we're already running in the browser, so it had to be some other file referencing an already included package.
- To find the actual problem file I rebuilt the project with `EXPO_WEB_DEBUG=true expo build:web`
  - This will build your project but prevent terser from minimizing the values
  - It'll also keep the paths and hints to why a file wasn't tree-shaken (it's extremely helpful)
- Then I searched for `text-encoding` in the `web-build/js/*.js` files
- I found that a file `./node_modules/expo-three/build/loaderClassForExtension.js` had required a file from `three` that needed `text-encoding`.
  - You may think lazy loading a file with `require()` is the most optimal way to include files but that's not the case with Webpack. In Webpack the tree-shaking uses keywords like `import/export` to detect what can be safely removed.
  - Because `loaderClassForExtension.js` had both `import`s and `require`s Webpack just skipped tree-shaking it altogether.
  - Quickly editing the node_modules copy of `expo-three` verified that this was indeed the problem
  - After building again with the `EXPO_WEB_DEBUG` flag off, we could see that `text-encoding` was no longer in the bundle and our production build was now much smaller.
