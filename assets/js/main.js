/** @file main.js
 *  @fileOverview Program driver. Configures path aliases and calls app.initialize()
 *  @author cs_brandt
 *  @date 10/19/2012 
 */


require.config(
{
   paths: 
   {
      order: '../vendor/libs/requirejs-plugins/order',
      text: '../vendor/libs/requirejs-plugins/text',
      jquery: '../vendor/libs/jquery/jquery-min',
      jqueryui: '../vendor/libs/jquery-ui/jquery-ui-1.9.0.custom.min',
      jquerylayout: '../vendor/libs/jquery-layout/jquery.layout-latest',
      jqueryTree: '../vendor/libs/jqTree/tree.jquery',
      jqueryuiPosition: '../vendor/libs/jquery-contextMenu/jquery.ui.position',
      jqueryContextMenu: '../vendor/libs/jquery-contextMenu/jquery.contextMenu',
      underscore: '../vendor/libs/underscore/underscore-min',
      backbone: '../vendor/libs/backbone/backbone',
      three: '../vendor/libs/three/three.min',
      ColladaLoader: '../vendor/libs/three/loaders/ColladaLoader',
      TrackballControls: '../vendor/libs/three/controls/TrackballControls'
   },
   shim:
   {
      backbone:
      {
         deps: ['underscore', 'jquery'],
         exports: 'Backbone'
      },
      underscore:
      {
         exports: "_"
      },
      ColladaLoader:
      {
         deps: ['three']
      },
      TrackballControls:
      {
         deps: ['three']
      }

   }

});

require(["app"], function(app)
{
   app.initialize();

});