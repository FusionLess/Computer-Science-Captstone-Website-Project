# Regression tests

Run with Node.js 22.18+ (Node 24 recommended), which can load the route module's TypeScript directly. No extra test dependencies or development server are needed.

```sh
npm test
npm run test:watch
```

- `heartRendering.test.js`: frame boundaries, independent frame materials, real Three.js raycasting against hidden and clipped meshes, and stencil helper cleanup.
- `heartRoutes.test.js`: links for every heart condition and complexity, comparison order, and invalid URLs.

Add a `*.test.js` file here for future regressions. Import the production function, set up a small input, and assert an observable result using `node:assert/strict`.
When fixing a bug, add a case that reproduces it before changing the implementation.

## End-to-end browser tests

Install dependencies with `npm ci`, then install Chromium once:

```sh
npx playwright install chromium
npm run test:e2e
```

`test:e2e` builds the website and starts a local preview server automatically. 
The tests in `e2e/viewer.spec.js` use real pages and assets to check condition selection and reloads, comparison mode, BPM input/slider synchronization and limits, and About/Home navigation.

For interactive debugging, run `npm run test:e2e:ui`. 
To view the latest HTML report, run `npx playwright show-report`.

GitHub Actions runs both the regression and browser tests on pushes to `main` and `Development`, and on pull requests. Failed browser runs upload reports, screenshots, and traces as the `playwright-failures` artifact.


Manual checking is still needed on the browser, these tests only cover UI behaviors, manual checks are still needed for actual UI layout.
Add more `*.spec.js` files under `e2e/` as new user controls are introduced.
