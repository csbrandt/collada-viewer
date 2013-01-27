/** @file FSTree.js
 *  @fileOverview FileSystem tree view
 *  @author cs_brandt
 *  @date 10/21/2012 
 */


/** 
 *  @param {number} size in bytes
 *  @returns {string} Human readable storage size
 *  @see http://blog.jbstrickler.com/2011/02/bytes-to-a-human-readable-string/
 */
function parseSize(size)
{
   var suffix = ["bytes", "KB", "MB", "GB", "TB", "PB"],
      tier = 0;

   while (size >= 1024)
   {
      size = size / 1024;
      tier += 1;
   }

   return Math.round(size * 10) / 10 + " " + suffix[tier];
}

define(['jquery', 'underscore', 'backbone', 'order!jqueryTree', 'order!jqueryuiPosition', 'order!jqueryContextMenu'], function($, _, Backbone)
{
	var FSTree = Backbone.View.extend(
	{
		initialize: function()
      {
         // bind on any additions to the collection
         this.collection.bind("add", this.add, this);
         //
         // initialize jqTree
         this.data = [
         {
            id: 1,
         	label: "/",
         	children: []

         }];

         $(this.el).tree(
         {
         	data: this.data,
         	autoOpen: true,
         	dragAndDrop: true

         });

         $(this.el).bind('tree.click', function(event) 
         {
            var node = event.node;

            this.selectNode(node);

         }.bind(this));

         $(this.el).bind('tree.contextmenu', function(event) 
         {
            // The clicked node is 'event.node'
            // save the clicked node
            this.contextMenuNode = event.node;
 
         }.bind(this));

         // bind any quota changes on the filesystem to update
         // the title of the root node
         this.model.bind("change:quota", this.updateRootNode, this);
      },

      add: function(model)
      {
      	var file = model.get("file");

      	this.data[0].children.push(file.name);

      	$(this.el).tree("loadData", this.data);

         // context menu setup for the FSTree
         $.contextMenu(
         {
            selector: "li.jqtree-node",
            callback: function(key, options) 
            {
               switch (key)
               {
                  case "open":

                     this.selectNode(this.contextMenuNode);

                     break;

                  case "rename":

                     this.renameNode(this.contextMenuNode);

                     break;

                  case "delete":

                     this.removeNode(this.contextMenuNode);

                     break;
               } 
            }.bind(this),
            items: 
            {
               "open":   {name: "Open"},
               "rename": {name: "Rename"},
               "sep1":   "---------",
               "delete": {name: "Delete"}
            }

         });

      },

      buildFilePath: function(node)
      {
         var parent = node.parent;
         var filePath = node.name;

         while (parent.parent !== null)
         {
            node = parent;
            parent = node.parent;

            if (parent.parent)
            {
               filePath = node.name + filePath;
            }
            else
            {
               filePath = "/" + filePath;
            } 
         }

         return filePath;
      },

      selectNode: function(node)
      {
         var element = node.element;

         // remove class of any previously selected files
         $.each($(element).parent().children(), function(index, value)
         {
            $(value).removeClass("selected_file");

         });

         $(element).addClass("selected_file");

         var filePath = this.buildFilePath(node);

         // get the file
         this.model.openFile(filePath);
      },

      removeNode: function(node)
      {
         // get the full file path to identifiy 
         // the file to be removed
         var filePath = this.buildFilePath(node);
         // remove node from tree
         $(this.el).tree('removeNode', node);
         // remove file from filesystem
         this.model.deleteFile(filePath);
      },

      renameNode: function(node)
      {
         // change the jqtree-title span to an
         // input with 100% width

         // add the current jqtree-title text
         // to input value

         // set focus on the jqtree-title input

         // bind an event handler on focus loss
         // for the jqtree-title input

         // get the jqtree-title input value
         // on focus loss and change the node name
         // and file name to the new value entered
         // by the user

         var nodeSpan = $(node.element).find("span");
         var spanText = $(nodeSpan).text();
         var spanClass = $(nodeSpan).attr("class");

         var spanInput = $("<input>");
         // todo bring style out
         $(spanInput).css("width", "100%");
         $(spanInput).val(spanText);

         $(nodeSpan).replaceWith(spanInput);
         $(spanInput).focus();

         $(spanInput).blur(function()
         {
            this.model.moveFile(this.buildFilePath(node), $(spanInput).val());
            $(this.el).tree("updateNode", node, $(spanInput).val());

         }.bind(this));

         $(spanInput).keypress(function(event)
         {
            if (event.which === 13)
            {
               $(spanInput).blur();
            }

         });

      },

      updateRootNode: function(model)
      {
         var rootNode = $(this.el).tree("getNodeById", 1);
         var quota = model.get("quota");

         var newLabel = "/ (" + parseSize(quota.used) + "/" + parseSize(quota.remaining) + ")";

         // update root node
         $(this.el).tree('updateNode', rootNode, newLabel);
      }

	});

	return FSTree;

});
