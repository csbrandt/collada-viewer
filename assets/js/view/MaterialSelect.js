/** @file MaterialSelect.js
 *  @fileOverview View for selecting model materials.
 *  @author cs_brandt
 *  @date 11/13/2012 
 */


define(['jquery', 'underscore', 'backbone'], function($, _, Backbone)
{
	var MaterialSelect = Backbone.View.extend(
	{
		initialize: function()
		{
         // add the default option, change material
         $(this.el).append($("<option></option>").attr("value", "none").text("Change material"));

			// populate material choices for user
			// from material library
			$.each(this.model.get("materialLibrary"), function(index, value)
			{
				$(this.el).append($("<option></option>").attr("value", index).text(index));

			}.bind(this));

			// select initial material
			$(this.el).val("none");
			this.model.set("selectedMaterial", $(this.el).val());
		},

		reset: function()
		{
			$(this.el).val("none");
		}

	});

	return MaterialSelect;

});
