/*!
 * makeFit
 * @description	Makes and element fit into it
 * @version		1.3.0 - 2014/07/01
 * @author		Aaron Barker
 * @requires	ui.widget.js
 * @copyright	Copyright Intellectual Reserve Inc. All rights reserved.
 */
(function($) {
	"use strict";
	$.widget("lds.makeFit", {
		options: {
			fitWithin: function(a,self){
				return self.element.parent();
			},
			sizeClasses: "small smaller smallest",
			sync:"", // other makeFit elements that we want to all change sizes at the same time
			addClassTo:false, // other elements (parents, siblings, etc) that we want to add the current sizeClass to. Could be a selector, but better would be that it should return an object relative to the current element so we don't match on the same relative element as other makeFit elements. If we had 5 makeFit element and just said ".parent" it would match ".parent" 5 times as it loops through them. By saying something like $(this).closest(".parent") it makes sure to only get the one parent relative to the current makeFit element.
			syncFitWithin:true,
			imgLoadTimeout:100,
			setupResize:function(event,self){ // declared as an option so other resize solutions can be used, such as a throttle
				$(window).on("resize orientationchange",function(){
					self.fit();
				});
			}
		},
		_create: function() { // things that should only happen one time.
			// console.debug("method: _create");
			var opts = this.options, self = this, elem = this.element;

			if(typeof opts.fitWithin === "function"){ // used for dynamically finding the fitWithin
				self.fitWithin = opts.fitWithin.call(this,self);
			} else { // otherwise it's a single element or parent
				self.fitWithin = opts.fitWithin;
			}
			if(typeof opts.addClassTo === "function"){ // used for dynamically finding the addClassTo
				self.addClassTo = opts.addClassTo.call(this,self);
			} else { // otherwise it's a single element or parent
				self.addClassTo = opts.addClassTo;
			}
			self._trigger("setupResize", 0, self);
			self.fit();
			elem.addClass("makeFit-enabled");
		},
		fit:function(){
			// console.debug("method: fit",this.element);
			var opts = this.options, self = this, elem = this.element,
				fitWithin = self.fitWithin,
				fitWithinH = fitWithin.height(),
				fitWithinW,
				sizeClasses = opts.sizeClasses.split(" "),
				elemH,elemW,newTop,toSync;

			if(fitWithin.is("img") && !fitWithin.height()){
				setTimeout(function(){
					self.fit();
				},opts.imgLoadTimeout);
				return;
			}

			// clear out anything from previous sizings
			elem.add(opts.syncFitWithin?fitWithin:"").add(self.addClassTo).removeClass(opts.sizeClasses);

			$.each(sizeClasses,function(){
				fitWithinH = fitWithin.height();
				fitWithinW = fitWithin.width();
				elemH = Math.floor(elem.outerHeight(true));
				elemW = Math.floor(elem.outerWidth(true));
				// console.debug("fitWithinH:"+fitWithinH,"fitWithinW:"+fitWithinW,"elemH:"+elemH,"elemW:"+elemW);

				if(elemH > fitWithinH || elemW > fitWithinW){
					self.setClass(""+this);
					// console.debug("too big! adding: "+this);
				}
			});
			if(opts.center && elem.css("position") === "absolute"){
				// console.debug("center",fitWithinH,elemH);
				newTop = (fitWithinH - elemH)/2;
				// console.debug(newTop);
				elem.css("top",newTop);
			} else if(opts.center){
				// remove the top set above if the elem isn't positioned
				elem.css("top","auto");
			}
			if(opts.sync){
				toSync = $(opts.sync);
				if(toSync.index(elem) === toSync.length-1){ // only run this if we are the last element, so that all normal calculations will already have been run
					$.each(sizeClasses,function(){
						var theClass = ""+this;
						if(toSync.hasClass(theClass)){
							toSync.each(function(){
								$(this).makeFit("setClass",theClass);
							});

						}
					});
				}
			}
		},
		setClass: function(theClass){
			var self = this,
				opts = self.options,
				elem = self.element;
			// console.debug("method: setClass", elem, theClass);
			return elem.add(opts.syncFitWithin?self.fitWithin:"").add(self.addClassTo).addClass(theClass);
		},
		destroy: function() {
			$.Widget.prototype.destroy.apply(this, arguments); // call the default stuff
			$(this.element).add(window).unbind("."+this.widgetName);
		}
	});
	$.extend($.lds.makeFit, {
		version: "1.3.0"
	});
})(jQuery);