# Arashin

CMS based on ExpressJs for create multisite, multilanguage and modular web application with Node.Js         
Originally based on the project MuContent

Features (see module list too):
- http/https configuration
- multisite
- multiuser and multipermission 
- multilanguage
- polymorphic object
- cloud ready (MongoDB, Redis, Amazon S3)
- Handlebars.js template
- mail template
- message and social features
- pure javascript
- view based on twitter bootstrap
- extensible with controllers (module) 
- static views

# INSTALL

Requirements: Node.js v0.10.4, redis    
**IMP**: You must install redis to allow sessions.    
Optional: mongodb (only if you need modules)

To install the application run, into directory: `npm install --production`    
**NOTE**: with --production npm doesn't install development dependencies.   

To set self-signed certificate (for tests and development phases), you can run:

`openssl genrsa -out privatekey.pem 1024`    
`openssl req -new -key privatekey.pem -out certrequest.csr`     
`openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem`

Then change permission: `chmod 600 *.pem`

Run development mode: `NODE_ENV=development node app.js`    

Run application: `node app.js`    
You can run http or https, to set https go into config.js and remove comment to `https_options`.      
**NOTE**: HTTPS uses port 443, so run application as root. If you want run the application as normal user, change `client_port` in config.js (test port is 10443).      
On browser: `https://localhost:10443`

After the application is running, you can run the application's tests (into document root, after dev dependencies install): `./node_modules/.bin/mocha --reporter spec`     
You can change data for request and credentials for tests in ./test/test.js.

# SPECS

Sites must be configured as follow:

* in params.js, add a proper host name in the vhost array
* in ./sites folder, copy the sites files in a folder named exactly as the site host name


# Middlewares
* utils.accesslog
* utils.restricted      // Check user authentication: read {site}/settings/route.js
* utils.already_auth    // Check req.session.user
* utils.parseCookie     // Parse the cookie to get socket.io authentication handler
* utils.sendmail


# Utils
* utils.applog(level, s) // levels: info, warn, error


# Helpers hbs
* extend
* block
* checkRole
* translate
* availableLanguage
* createMenu
*

https://github.com/donpark/hbs
https://github.com/assemble/handlebars-helpers


---------------------------------------

LICENSE
(The MIT License)

Copyright (c) 2013 Andrea Di Mario

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
