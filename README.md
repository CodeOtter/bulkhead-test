bulkhead-test
=============

A functional testing suite for Bulkhead services.  Comes with Sails lifting, Barrels for fixtures, and Supertest for REST testing built in.

Quick start
-----------

```npm install bulkhead-test```

All tests need to be in a folder called ```test``` in the project root.

Fixtures are in JSON format and will need to be in a folder called ```test/fixtures``` with a ```.json``` extension.  (See [Barrels](https://github.com/bredikhin/barrels) for more details)

In your test file, (in this example, we will use Mocha) as you are defining your tests and before you run them, all you have to do this this:

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
})
```
Click here for more help with [supertest](https://github.com/visionmedia/supertest).