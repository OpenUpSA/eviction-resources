# Eviction Resources &middot; ![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg)

This repository contains all user-facing digital resources aimed at those facing eviction in the inner-city. Developed in collaboration with [Reclaim the City](http://reclaimthecity.org.za/).

## Getting Started

### Local development

1. Clone this project by running `git clone https://github.com/OpenUpSA/eviction-resources`.
2. Make sure you have the latest [NodeJS](https://nodejs.org/en/) installed.
3. Run `npm install` in the root folder of the repository.
4. Run `npm start` to spin up the development server.*
5. Open `localhost:8000` in your browser.

## Push changes to Github
1. It is not possible to push straight to the `master` branch, instead a branch should be created and merged into `master` via a Github.
1. [Husky](https://www.npmjs.com/package/husky) automatically executes [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/) validation (via `npm test`) before code is pushed to Github. <sup>2</sup>
2. Code will only be pushed if `npm test` passes. <sup>3</sup>

## Deployment 

Using Netlify.

1. Assets are deployed to Github Pages directly from local development instead of as part of a CI pipeline from Github itself.
2. Run `npm run deploy` to deploy all files in `public` folder automatically to `gh-pages` branch on repository.
3. [Husky](https://www.npmjs.com/package/husky) automatically executes [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/) validation (via `npm test`) before assets are deployed to Github pages. <sup>2</sup>
4. Assets will only be deployed if `npm test` passes. <sup>3</sup>

<sup>2</sup> It is advised to integrate [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/) into your editor/IDE to receive linting errors as you work. Please see [ESLint documentation](https://eslint.org/docs/user-guide/integrations#editors) and [Stylelint documentation](https://stylelint.io/user-guide/complementary-tools#editor-plugins) to integrate ESLint/Stylelint into your editor/IDE. If this is not possible it is advised that you run `npm test` as often as possible during development. 

<sup>3</sup>In emergencies [Husky](https://www.npmjs.com/package/husky) can be bypassed by running `git push --no-verify` or `npm run deploy:no-verify`.

## Stack

Built with [Gatsby](https://www.gatsbyjs.org/), [Redux](https://redux.js.org/) and [Material UI](https://material-ui.com/)

**[Core Gatsby starter](https://github.com/gatsbyjs/gatsby-starter-default/blob/master/package.json) is extended in the following manner**:
- Gatsby Plugins:
  - [gatsby-link](https://www.npmjs.com/package/gatsby-link)
  - [gatsby-plugin-google-fonts](https://www.npmjs.com/package/gatsby-plugin-google-fonts)
  - [gatsby-plugin-react-helmet](https://www.npmjs.com/package/gatsby-plugin-react-helmet)
  - [gatsby-plugin-manifest](https://www.npmjs.com/package/gatsby-plugin-manifest)
  - [gatsby-plugin-offline](https://www.npmjs.com/package/gatsby-plugin-offline)
  - [gatsby-plugin-react-next](https://www.npmjs.com/package/gatsby-plugin-react-next)
  - [gatsby-plugin-google-analytics](https://www.npmjs.com/package/gatsby-plugin-google-analytics)
  - [gatsby-plugin-sentry](https://www.npmjs.com/package/gatsby-plugin-sentry)
- Redux integration as per [Gatsby Starter Redux](https://github.com/caki0915/gatsby-starter-redux) by means of:
  - [react-dom](https://www.npmjs.com/package/react-dom)
  - [react-router-dom](https://www.npmjs.com/package/react-router-dom)

**Core Redux is extended in the following manner**:
- [react-redux](https://www.npmjs.com/package/react-redux)
- [redux-devtools-extension](https://www.npmjs.com/package/redux-devtools-extension)
- [redux-thunk](https://www.npmjs.com/package/redux-thunk)
- [redux-batched-subscribe](redux-batched-subscribe)
- Redux file architecture corresponds to [Ducks](https://github.com/erikras/ducks-modular-redux) convention.
- Redux action structure correspond to [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) convention.

## Linting

Linting is done through [ESLint](https://eslint.org/) (JavaScript), [Stylelint](https://github.com/stylelint/stylelint) (CSS) and enforced by [Husky](https://material-ui.com/)

**Core ESLint rules are extended as follows**:
  - [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
  - [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
  - [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)
  - [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)
  - [babel-eslint](https://www.npmjs.com/package/babel-eslint)


**Core Stylelint are extended as follows**:
  - [stylelint-config-standard](stylelint-config-standard)
  - [stylelint-config-css-modules](https://www.npmjs.com/package/stylelint-config-css-modules)
  - [stylelint-no-unsupported-browser-features](https://www.npmjs.com/package/stylelint-no-unsupported-browser-features)


## Browser Support
- Browser support defined via [Browserslist](http://browserl.ist/) conventions in `package.json`.
- Browser support currently correspond with the following Browserslist rules:
  - `last 12 chrome versions`
  - `last 12 firefox versions`
  - `last 6 safari versions`
  - `explorer >= 9`
  - `edge > 0`
- Browserslist integration with Gatsby and linting via [Browserslist package](https://www.npmjs.com/package/browserslist).