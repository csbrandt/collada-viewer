/** @file FileSystem.js
 *  @fileOverview Model for File System API.
 *  @author cs_brandt
 *  @date 10/20/2012 
 */


define(['jquery', 'underscore', 'backbone', 'model/File'], function($, _, Backbone, File)
{
   var FilesCollection = Backbone.Collection.extend(
   {
      model: File,

      initialize: function()
      {

      	
      },

      // overrides add to take a FileList
      // and add each file in the FileList
      // as an individual model in the collection
      add: function(fileList)
      {
         for (var c = 0; c < fileList.length; c++)
         {
            Backbone.Collection.prototype.add.call(this, { file: fileList[c] });
         }
      }

   });

   var FileSystem = Backbone.Model.extend(
   {
      defaults:
      {
         files: new FilesCollection()
      },

      initialize: function()
      {
         // Note: The file system has been prefixed as of Google Chrome 12:
         window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

         window.webkitStorageInfo.requestQuota(PERSISTENT, 100 * 1024 * 1024, function(grantedBytes)
         {
            window.requestFileSystem(PERSISTENT, grantedBytes, this.initFS.bind(this), this.FSErrorHandler.bind(this));

         }.bind(this));

         // bind fs initialization
         // to fetch files into files collection
         this.bind("change:fs", function()
         {
            this.getAll();

         }, this);

         this.get("files").bind("add", function(model)
         {
            var file = model.get("file");

            // if the entry being added
            // is not in the filesystem
            if (!file.filesystem)
            {
               this.createFile(model);
            }

         }, this);

      },

      add: function(fileList)
      {
         this.get("files").add(fileList);
      },

      initFS: function(fs)
      {
         // save the reference to the DOMFileSystem object
         // as an attribute on this model
         this.set("fs", fs);
         this.updateUsageAndQuota();

         console.log('Opened file system: ' + fs.name);
      },

      getAll: function()
      {
         var fs = this.get("fs");

         var dirReader = fs.root.createReader();

         dirReader.readEntries(function(entries) 
         {
            this.add(entries);
      
         }.bind(this), this.FSErrorHandler);

      },

      FSErrorHandler: function(error)
      {
         var msg = '';

         switch (error.code) 
         {
            case FileError.QUOTA_EXCEEDED_ERR:
               msg = 'QUOTA_EXCEEDED_ERR';
               break;

            case FileError.NOT_FOUND_ERR:
               msg = 'NOT_FOUND_ERR';
               break;

            case FileError.SECURITY_ERR:
               msg = 'SECURITY_ERR';
               break;

            case FileError.INVALID_MODIFICATION_ERR:
               msg = 'INVALID_MODIFICATION_ERR';
               break;

            case FileError.INVALID_STATE_ERR:
               msg = 'INVALID_STATE_ERR';
               break;

            default:
               msg = 'Unknown Error';
               break;
         }

         console.log('Error: ' + msg);
      },

      createFile: function(model)
      {
         var file = model.get("file");
         var fs   = this.get("fs");

         fs.root.getFile(file.name, {create: true, exclusive: false}, function(fileEntry) 
         {
            fileEntry.createWriter(function(fileWriter) 
            {
               fileWriter.write(file);
               this.updateUsageAndQuota();

            }.bind(this), this.FSErrorHandler);

         }.bind(this), this.FSErrorHandler); 
      },

      deleteFile: function(path)
      {
         var files = this.get("files");
         var fs    = this.get("fs");

         // find the model represented by path
         // remove model from collection, delete from filesystem
         files.all(function(model)
         {
            var file = model.get("file");

            if (file.fullPath === path)
            {
               files.remove(model);

               // delete from fs
               fs.root.getFile(file.fullPath, {create: false}, function(fileEntry) 
               {
                  fileEntry.remove(function() 
                  {
                     console.log(file.fullPath + ' deleted.');
                     this.updateUsageAndQuota();

                  }.bind(this), this.FSErrorHandler);

               }.bind(this), this.FSErrorHandler);

               // break
               return false;
            }

            return true;

         }.bind(this));

      },

      openFile: function(path)
      {
         var fs   = this.get("fs");

         fs.root.getFile(path, {}, function(fileEntry)
         {
            fileEntry.file(function(file)
            {
               this.set("openedFile", file);

            }.bind(this), this.FSErrorHandler);

         }.bind(this), this.FSErrorHandler);
      },

      moveFile: function(path, newPath)
      {
         var fs   = this.get("fs");

         fs.root.getFile(path, {}, function(fileEntry)
         {
            fileEntry.moveTo(fs.root, newPath);

         }.bind(this), this.FSErrorHandler);
      },

      updateUsageAndQuota: function()
      {
         window.webkitStorageInfo.queryUsageAndQuota(webkitStorageInfo.PERSISTENT, function(used, remaining)
         {
            this.set("quota", 
            {
               used: used,
               remaining: remaining

            });

         }.bind(this), this.FSErrorHandler);
      }

   });

   return FileSystem;

});
