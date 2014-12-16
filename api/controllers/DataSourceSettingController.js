/**
 * Datasourcesetting Controller
 *
 * @module      :: Controller
 * @description	:: For editing weight limits for exceeding weight analysis
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
