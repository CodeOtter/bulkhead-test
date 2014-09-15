bulkhead-test
=============

A functional testing suite for Bulkhead services.  This package uses:

* [Sails](https://github.com/balderdashy/sails) as the web application
* [Mocha](https://github.com/visionmedia/mocha) as the test harness
* [Barrels](https://github.com/bredikhin/barrels) for fixture loading
* [Supertest](https://github.com/visionmedia/supertest) for REST testing

# Quick start

```npm install bulkhead-test```

# Configuration

* All tests need to be in JavaScript and in a folder called ```test``` in the package root with a ```.js``` extension.
* All fixtures need to be in JSON format and in a folder called ```test/fixtures``` in the package root with a ```.json``` extension.  (See [Barrels](https://github.com/bredikhin/barrels) for more details)
* All fixture names need to be consisting of the package name, an underscore, and the model name in lower case.  (Example: If your package is called ```testPackage``` and your model is called ```Account.js```, the fixture needs to be called ```testPackage_account.json```)
* You will need to lift the sails application before tests are ran.  This can be done with the following:

```
var suite = require('bulkhead-test');
  
describe('A test category', function() {

  suite.lift();  // You lift sails during in your suite description

  describe('Some test', function() {
  	it('should test', function(done) {
      /* ... */
      done();
  });
});
```

To perform REST tests against the application, do the following:

```javascript
var suite = require('bulkhead-test');
  
describe('A test category', function() {
  suite.lift();
  describe('A category breakdown', function() {
    it('should do REST testing', function(done) {
      // Using suite.rest() will allow you to utilize the Supertest API
      suite.rest()
        .get('/')
        .end(function(err, res) {
          done();
        }
      );
    })
  });
});
```
For more help with REST testing, check out [supertest](https://github.com/visionmedia/supertest).