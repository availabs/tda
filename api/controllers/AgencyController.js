/**
 * AgencyController
 *
 * @description :: Server-side logic for managing agencies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	admin: function(req, res, next) {

	    // Get an array of all users in the Agency collection(e.g. table)
	    Agency.find().exec(function foundAgencys(err, agencys) {
	      if (err) return next(err);
	      // pass the array down to the /views/index.ejs page
	      res.view({
	        agencys: agencys
	      });
	    });
	},
};

