# express-vogue

  express.js middleware for instantly reloading css stylesheets during
  development

## Installation

npm:

    $ npm install express-vogue

## Usage


In your app, include this _before_ the plain app.configure section to
include express-vogue before other middlewares:

    app.configure('development', function(){
        app.use(require('express-vogue')(app));
    });

Start your application and open it in your browser of choice. Whenever you save
changes to a css-file below `public`, your page style will update instantly.


## Usage with stylus

    app.configure('development', function(){ 
        app.use(require('express-vogue')(app, {
            rewrite : '(.*).css:$1.styl'
        })); 
    });

Again: Remember to make this middleware the FIRST in development mode.

## vogue

This module is just a simple wrapper around the most excellent project _vogue_
by Andreq Davey <http://aboutcode.net/vogue>. To work in express, I had to make
some changes to it in my own fork at <https://github.com/bkw/vogue/tree/npm>.
That's why this modules requires my private fork from npm instead of the
original module.

