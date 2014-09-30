/**
 * UploadJobController
 *
 * @description :: Server-side logic for managing uploadjobs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	show:function(req,res){
		UploadJob.find().exec(function(err,returnJobs){
			res.view({jobs:returnJobs})
		})
	}
	
};

