/*!
 * makeFit
 * @description	Makes and element fit into it
 * @version		1.2.1 - 2013/10/08
 * @author		Aaron Barker
 * @requires	ui.widget.js
 * @copyright	Copyright Intellectual Reserve Inc. All rights reserved.
 */
(function($) {
	"use strict";
	$.widget("lds.makeFit", {
		options: {
			overlayID:"gallery-overlay",
			sizeClasses: "small smaller smallest",
			sync:"",
			imgLoadTimeout:100,
			setupResize:function(event,self){ // declared as an option so other resize solutions can be used, such as a throttle
				$(window).on("resize orientationchange",function(){
					self.fit();
				});
			}
		},
		_create: function() { // things that should only happen one time.
			// console.debug("method: _create");
			var opts = this.options, self = this, elem = this.element,
				fitWithin;

			if(typeof opts.fitWithin === "function"){ // used for dynamically finding the fitWithin
				self.fitWithin = opts.fitWithin.call(this,self);
			} else { // otherwise it's a single element or parent
				self.fitWithin = opts.fitWithin || elem.parent();
			}
			fitWithin = self.fitWithin;
			self._trigger("setupResize", 0, self);
			self.fit();
			elem.addClass("makeFit-enabled");
		},
		fit:function(){
			// console.debug("method: fit");
			var opts = this.options, self = this, elem = this.element,
				fitWithin = self.fitWithin,
				fitWithinH = fitWithin.height(),
				fitWithinW,
				sizeClasses = opts.sizeClasses.split(" "),
				elemH,elemW,newTop,toSync;

			if(fitWithin.is("img") && !fitWithin.height()){
				// console.debug("setting timeout");
				setTimeout(function(){
					// console.debug("in timelone");
					self.fit();
				},opts.imgLoadTimeout);
				return;
			}

			// clear out anything from previous sizings
			elem.add(fitWithin).removeClass(opts.sizeClasses);

			$.each(sizeClasses,function(){
				fitWithinH = fitWithin.height();
				fitWithinW = fitWithin.width();
				elemH = Math.floor(elem.outerHeight(true));
				elemW = Math.floor(elem.outerWidth(true));
				// console.debug("fitWithinH:"+fitWithinH,"fitWithinW:"+fitWithinW,"elemH:"+elemH,"elemW:"+elemW);

				if(elemH > fitWithinH || elemW > fitWithinW){
					elem.add(fitWithin).addClass(""+this);
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
						if(toSync.hasClass(""+this)){
							toSync.addClass(""+this);
						}
					});
				}
			}
		},
		destroy: function() {
			$.Widget.prototype.destroy.apply(this, arguments); // call the default stuff
			$(this.element).add(window).unbind("."+this.widgetName);
		}
	});
	$.extend($.lds.makeFit, {
		version: "1.2.1"
	});
})(jQuery);