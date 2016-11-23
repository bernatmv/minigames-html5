## Features

 - [babel](http://babeljs.io) for ES6/ES7
 - compile to ES5 in `/dist`
 - [tape](https://github.com/substack/tape) unit testing with [zuul runner](https://github.com/defunctzombie/zuul)
 - use [node-readme](http://github.com/revolunet/node-readme)

## Wokflow

- edit your code and commit
- run `npm run build`
- apply semver with `npm version major|minor|patch`

## Scripts

 - **npm run readme** : `node ./node_modules/.bin/node-readme`
 - **npm run test** : `./node_modules/.bin/babel-tape-runner ./spec/**/*.spec.js | ./node_modules/.bin/tap-spec`
 - **npm run zuul** : `./node_modules/.bin/zuul --local --open -- spec/**/*.spec.js`
 - **npm run build** : `npm run test && npm run readme && ./node_modules/.bin/babel -d ./dist ./src`
