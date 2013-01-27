/** @file ColladaView.js
 *  @fileOverview 3D view of a COLLADA model.
 *  @author cs_brandt
 *  @date 11/12/2012 
 */


/**
 *  @author Paul Irish
 */
window.requestAnimFrame = (function()
{
   "use strict";
   return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
   function( /* function */ callback, /* DOMElement */ element)
   {
      window.setTimeout(callback, 1000 / 60);
   };
}());


define(['jquery', 'underscore', 'backbone', 'jqueryui', 'three', 'order!ColladaLoader', 'order!TrackballControls'], function($, _, Backbone)
{
	var ColladaView = Backbone.View.extend(
	{
		initialize: function()
		{
         var screenWidth = $(this.el).width();
         var screenHeight = $(this.el).height();

         this.scene = new THREE.Scene();
         this.camera = new THREE.PerspectiveCamera(60, screenWidth / screenHeight, 0.1, 1000);
         this.camera.position.set(4, 4, 3);
         this.controls = {};

         var ambient = new THREE.AmbientLight(0x050505);
			this.scene.add(ambient);

			var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
			directionalLight.position.set(2, 1.2, 10).normalize();
			this.scene.add(directionalLight);

			directionalLight = new THREE.DirectionalLight(0xffffff, 1);
			directionalLight.position.set(-2, 1.2, -10).normalize();
			this.scene.add(directionalLight);

			var pointLight = new THREE.PointLight(0xffaa00, 2);
			pointLight.position.set(2000, 1200, 10000);
			this.scene.add(pointLight);

         // bind on files opened by the filesystem
         this.model.get("fs").bind("change:openedFile", this.loadFile, this);
         // bind on material selection
         this.model.get("material").bind("change:selectedMaterial", this.updateMaterial, this);
         // bind on window resize
         $(window).resize(this.onResize.bind(this));

			// init renderer
	      try
	      {
	         if ( !! window.WebGLRenderingContext && !! document.createElement('canvas').getContext('experimental-webgl'))
	         {
	            this.renderer = new THREE.WebGLRenderer(
	            {
	               antialias: true
	            });
	         }
	         else
	         {
	            this.renderer = new THREE.CanvasRenderer();
	         }
	      }
	      catch (e)
	      {
	         this.renderer = new THREE.CanvasRenderer();
	      }

	      // Grid

			var size = 14, step = 1;

			var geometry = new THREE.Geometry();
			var material = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } );

			for (var i = - size; i <= size; i += step) 
			{
				geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ));
				geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ));

				geometry.vertices.push( new THREE.Vector3(i, - 0.04, - size ));
				geometry.vertices.push( new THREE.Vector3(i, - 0.04,   size ));
			}

			var line = new THREE.Line(geometry, material, THREE.LinePieces);
			this.scene.add(line);

	      // start the renderer
	      this.renderer.setSize(screenWidth, screenHeight);

	      this.controls.trackball = new THREE.TrackballControls(this.camera, this.renderer.domElement);
	      this.controls.trackball.staticMoving = true;

	      $(this.el)[0].appendChild(this.renderer.domElement);

	      this.animate();
		},

		animate: function()
		{
			window.requestAnimFrame(this.animate.bind(this));

			this.render();
		},

		render: function()
		{
			this.controls.trackball.update();
			this.renderer.render(this.scene, this.camera);
		},

		loadFile: function(model)
		{
			var file = model.get("openedFile");
			var fileObjURL = window.URL.createObjectURL(file);

			var colladaLoader = new THREE.ColladaLoader();
         colladaLoader.options.convertUpAxis = true;

			colladaLoader.load(fileObjURL, function(collada)
			{
				// if a model is already loaded
            if (this.currentModel)
            {
            	this.scene.remove(this.currentModel);
               this.renderer.deallocateObject(this.currentModel);

               this.currentModel = null;
            }

				var dae = collada.scene;
            // scale model
				dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
				dae.updateMatrix();

            // set current model
            this.currentModel = dae;
            // add model to scene
				this.scene.add(dae);

            this.options.materialSelect.reset();
				$(this.options.progressBar).hide();

			}.bind(this), this.updateLoadProgress.bind(this));

		},

		updateLoadProgress: function(progressInfoObj)
		{
         $(this.options.progressBar).show();

			$(this.options.progressBar).progressbar(
			{
				value: 100 / (progressInfoObj.total / progressInfoObj.loaded)

			});
			
		},

		applyMaterial: function(model)
		{
			// apply material
			model.traverse(function(child) 
			{
				if (child.material) 
				{
					child.geometry.computeTangents();
					child.material = this.material;
				}

			}.bind(this));
		},

		updateMaterial: function(model)
		{
         var materialIndex = model.get("selectedMaterial");

			this.material = model.get("materialLibrary")[materialIndex];

         // if there is a model loaded AND a material selected
         // apply the new material to it
			if (this.currentModel && this.material)
			{
				this.applyMaterial(this.currentModel);
			}
		},

		onResize: function()
		{
			// set a timer so we check for
			// new dimensions AFTER the resize is completed
			setTimeout(function() 
			{
				this.camera.aspect = $(this.el).width() / $(this.el).height();
            this.camera.updateProjectionMatrix();

            this.renderer.setSize($(this.el).width(), $(this.el).height());

            // todo controls?

         }.bind(this), 500);
		}

	});

	return ColladaView;

});
