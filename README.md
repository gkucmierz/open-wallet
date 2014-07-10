open-wallet
===========


External Dependencies
---------------------

  1. [Node.js](http://nodejs.org/)
  2. [Ruby](https://www.ruby-lang.org/en/downloads/)
  3. [SASS](http://sass-lang.com/) version `>3.3.7`


Project setup
-------------

  1. Be sure that you have **nodejs package manager** installed
  2. Install bower package manager with `npm install -g bower`
  3. Install grunt by running `npm install -g grunt-cli`
  4. Run `npm install` - installs node modules
  5. Run `bower install` or `./node_modules/.bin/bower install` - installs vendor dependencies (external libraries)
  6. `grunt` or `./node_modules/.bin/grunt` - to run Grunt tasks
  7. Register GIT hooks by running `grunt install-hooks`


Grunt tasks
-----------

  * `grunt` - jshint & compiles SCSS files
  * `grunt compile` - Compile SCSS files
  * `grunt lint` - performs linting based on JSHint configuration and SCSS file linting
  * `grunt watch` - watches SCSS files for changes, any other compilable asses could be added in future


Code quality guidelines
-----------------------

JavaScript should be hinted before every commit with .jshintrc configuration. All hinting and JS coding is based on
AirBnb sample in [GitHub repo](https://github.com/airbnb/javascript).
