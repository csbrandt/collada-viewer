/** @file app.js
 *  @fileOverview App initialization.
 *  @author cs_brandt
 *  @date 10/19/2012 
 */


define(['jquery', 
        'underscore', 
        'backbone', 
        'model/FileSystem', 
        'model/Material',
        'view/FSTree', 
        'view/ColladaView',
        'view/MaterialSelect',
        'jqueryui', 
        'jquerylayout'], 
function($, _, Backbone, FileSystem, Material, FSTree, ColladaView, MaterialSelect)
{
   return {
      initialize: function()
      {
         $(function() 
         {
            $('body').layout(
            {
               resizable: true,
               center:
               {
                  // let any module listening for window resize
                  // know when our panels are resized
                  onresize: function() { $(window).resize(); },
                  minWidth: 480
               },
               east:
               {
                  size: 220,
                  minSize: 220
               }

            });

            var fs    = new FileSystem();
            var material = new Material();

            // view for the file system
            var tree  = new FSTree(
            {
               model: fs,
               collection: fs.get("files"),
               el: $("#file_list")

            });

            var compositeModel = new Backbone.Model();
            compositeModel.set(
            {
               fs: fs, 
               material: material

            });

            // view for material select
            var materialSelect = new MaterialSelect(
            {
               model: material,
               el: $("#material_select")

            });

            // view for the 3D models
            var collada = new ColladaView(
            {
               model: compositeModel,
               el: $("#viewer"),
               progressBar: $("#load_progress"),
               materialSelect: materialSelect

            });

            // event listeners
            //
            // Setup the dnd listeners.
            var dropZone = document.getElementById('file_drop_container');

            dropZone.addEventListener('dragover', function(event)
            {
               event.stopPropagation();
               event.preventDefault();

               // Explicitly show this is a copy.
               event.dataTransfer.dropEffect = 'copy';

            }, false);

            dropZone.addEventListener('drop', function(event)
            {
               event.stopPropagation();
               event.preventDefault();

               var daeList = [];

               // only add dae files
               for (var c = 0; c < event.dataTransfer.files.length; c++)
               {
                  if (event.dataTransfer.files[c].name.indexOf(".dae") !== -1)
                  {
                     daeList.push(event.dataTransfer.files[c]);
                  }
               }

               fs.add(daeList);

            }, false);

            // bind change event on materials list
            $("#material_select").change(function()
            {
               // update model with selected material
               material.set("selectedMaterial", $(this).val());

            });

         }); 
      }
   };
});