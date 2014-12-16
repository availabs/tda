/**
 * StatusCalendarController
 *
 * @module      :: Controller
 * @description	:: For displaying station data on a calendar
 */

module.exports = {
    
  	index:function(req,res){

  		res.view({user:req.session.User})

  	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DataLoaderController)
   */
  _config: {}

  
};
