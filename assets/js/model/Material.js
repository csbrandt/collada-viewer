/** @file Material.js
 *  @fileOverview Model for a Three.js material.
 *  @author cs_brandt
 *  @date 11/13/2012 
 */


define(['jquery', 'underscore', 'backbone', 'three'], function($, _, Backbone)
{
   var Material = Backbone.Model.extend(
   {
      defaults: {
         "materialLibrary": {

            "Wireframe": new THREE.MeshBasicMaterial(
            {
               color: 0x3D3D3D,
               opacity: 0.2,
               wireframe: true
            }),
            "Orange": new THREE.MeshLambertMaterial(
            {
               color: 0xff6600,
               ambient: 0xff2200,
               reflectivity: 0.3
            }),
            "Blue": new THREE.MeshLambertMaterial(
            {
               color: 0x001133,
               ambient: 0x001133,
               reflectivity: 0.3
            }),
            "Red": new THREE.MeshLambertMaterial(
            {
               color: 0x660000,
               ambient: 0x330000,
               reflectivity: 0.25
            }),
            "Black": new THREE.MeshLambertMaterial(
            {
               color: 0x000000,
               ambient: 0x000000,
               reflectivity: 0.15
            }),
            "White": new THREE.MeshLambertMaterial(
            {
               color: 0xffffff,
               ambient: 0x666666,
               reflectivity: 0.25
            }),

            "Carmine": new THREE.MeshPhongMaterial(
            {
               color: 0x770000,
               specular: 0xffaaaa
            }),
            "Gold": new THREE.MeshPhongMaterial(
            {
               color: 0xaa9944,
               specular: 0xbbaa99,
               shininess: 50
            }),
            "Bronze": new THREE.MeshPhongMaterial(
            {
               color: 0x150505,
               specular: 0xee6600,
               shininess: 10,
               reflectivity: 0.25
            }),
            "Chrome": new THREE.MeshPhongMaterial(
            {
               color: 0xffffff,
               specular: 0xffffff
            }),
            "Dark chrome": new THREE.MeshLambertMaterial(
            {
               color: 0x444444
            }),
            "Darker chrome": new THREE.MeshLambertMaterial(
            {
               color: 0x222222
            }),
            "Black glass": new THREE.MeshLambertMaterial(
            {
               color: 0x101016,
               opacity: 0.975,
               transparent: true
            }),
            "Dark glass": new THREE.MeshLambertMaterial(
            {
               color: 0x101046,
               opacity: 0.25,
               transparent: true
            }),
            "Blue glass": new THREE.MeshLambertMaterial(
            {
               color: 0x668899,
               opacity: 0.75,
               transparent: true
            }),
            "Light glass": new THREE.MeshBasicMaterial(
            {
               color: 0x223344,
               opacity: 0.25,
               transparent: true,
               reflectivity: 0.25
            }),
            "Red glass": new THREE.MeshLambertMaterial(
            {
               color: 0xff0000,
               opacity: 0.75,
               transparent: true
            }),
            "Yellow glass": new THREE.MeshLambertMaterial(
            {
               color: 0xffffaa,
               opacity: 0.75,
               transparent: true
            }),
            "Orange glass": new THREE.MeshLambertMaterial(
            {
               color: 0x995500,
               opacity: 0.75,
               transparent: true
            }),
            "Orange glass 50": new THREE.MeshLambertMaterial(
            {
               color: 0xffbb00,
               opacity: 0.5,
               transparent: true
            }),
            "Red glass 50": new THREE.MeshLambertMaterial(
            {
               color: 0xff0000,
               opacity: 0.5,
               transparent: true
            }),
            "Fullblack rough": new THREE.MeshLambertMaterial(
            {
               color: 0x000000
            }),
            "Black rough": new THREE.MeshLambertMaterial(
            {
               color: 0x050505
            }),
            "Darkgray rough": new THREE.MeshLambertMaterial(
            {
               color: 0x090909
            }),
            "Red rough": new THREE.MeshLambertMaterial(
            {
               color: 0x330500
            }),
            "Darkgray shiny": new THREE.MeshPhongMaterial(
            {
               color: 0x000000,
               specular: 0x050505
            }),
            "Gray shiny": new THREE.MeshPhongMaterial(
            {
               color: 0x050505,
               shininess: 20
            })
         }

      }

   });

   return Material;

});