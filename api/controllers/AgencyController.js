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
	updateSettings:function(req,res){
		var id = req.param('agency');
		var _update = req.param('newData')
		Agency.update({id:id},{settings:_update}).exec(function(err,agency){
			if(err){
				console.log(err)
				res.json({responsText:"Failed",status:500})
				
			}
			req.session.database = agency[0];
			res.json({responsText:"success",status:200})
		})

	}
};

