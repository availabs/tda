/**
 * StationController
 *
 * @description :: Server-side logic for managing stations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	index:function(req,res){
		res.view({station:req.param('id'),stationType:req.param('type')});
	}
	
};

