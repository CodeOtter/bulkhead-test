var Sails = require('sails'),
Barrels = require('barrels'),
supertest = require('supertest'),
fs = require('fs');

module.exports = {

	singleton: null,
	fixtures: null,
	
	/**
	 * 
	 * @returns
	 */
	rest: function() {
		return supertest(this.singleton.hooks.http.app);
	},
	
	/**
	 * 
	 * @param beforeCb
	 * @param afterCb
	 * @param settings
	 */
	lift: function(beforeCb, afterCb, settings) {
		var self = this;
		if(this.singleton === null) {
			before(function(done) {
				// @TODO: Create a test database if it doesn't exist
				Sails.lift(settings || {
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
					}
				}, function(err, sails) {
					self.singleton = sails;

					if(fs.existsSync(process.cwd() + '/test/fixtures')) {
						// Fixtures exist
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

							// Clear the test redis
							//QueueService.queue('test').client.flushdb(function() {
							//	done(err, sails);
							//});
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