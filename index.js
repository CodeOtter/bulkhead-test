var Sails = require('sails'),
	Barrels = require('barrels'),
	supertest = require('supertest'),
	fs = require('fs'),
	Bulkhead = require('bulkhead'),
	_ = require('underscore');

module.exports = {

	singleton: null,
	fixtures: null,
	
	/**
	 * Returns a supertest instance to quickly test HTTP requests against the Sails app
	 * @returns	Supertest
	 */
	rest: function() {
		return supertest(this.singleton.hooks.http.app);
	},
	
	/**
	 * Activates an instance of the Sails application during a test
	 * @param	Function	The Mocha Before/Setup handler
	 * @param	Function	The Mocha After/Teardown handler
	 * @param	Object		The configuration of the Sails application
	 */
	lift: function(beforeCb, afterCb, settings) {
		var self = this;
		if(this.singleton === null) {
			before(function(done) {
				Sails.lift(_.extend({
					log: {
						level: 'error'
					},
					adapters: {
						'default': 'mysql',
						  mysql: {
						    module : 'sails-mysql',
						    host    : 'localhost',
						    user    : 'root',
						    password: 'root', 
						    database: 'test'
						  }
					},
					globals: {
						_: true,
						async: true,
						sails: true,
						services: true,
						models: true
					},
					models: {
						migrate: 'alter'
					}
				}, settings || {}), function(err, sails) {
					
					// Initialize all Bulkhead packages
					Bulkhead.plugins.initialize(sails, function() {

						self.singleton = sails;

						if(fs.existsSync(process.cwd() + '/test/fixtures')) {
							// Fixtures exist, load them into the database
							Barrels.load();	
						}

						if(Object.keys(Barrels.objects).length > 0) {
							// Put in a placeholder just in case nothing loads
							Barrels.populate(function(barrelErr) {
								// Populate the DB
								if(barrelErr) {
									console.log(barrelErr);
									throw barrelErr;
								}

								self.fixtures = Barrels.objects;

								if(beforeCb) {
									beforeCb(sails, function(err) {
										done(err, sails);
									});
								} else {
									done(null, sails);
								}
							});
						} else {
							if(beforeCb) {
								beforeCb(sails, function(err) {
									done(err, sails);
								});
							} else {
								done(null, sails);
							}
						}
					});
				});	
			});

			// Tear down the sails app when the test is done
			after(function(done) {
				if(afterCb) {
					afterCb(sails);
				}
				if(self.singleton) {
					self.singleton.lower(function(err, results) {
						self.singleton = null;
						done(err, results);
					});
				}
			});
		}
	}
};