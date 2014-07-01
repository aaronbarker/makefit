# makeFit
========

makeFit is a plugin for helping one element to fit within the confines of another.  This was initially created for putting text over the top of images where you don't know the size of the contet (changed via CMS) or the language which varies in length greatly.

You apply the script to the element you want to make fit (lets call it "the element") and then optionally supply a `fitWithin` parameter of what element the text should be compared to (if no `fitWithin` is provided, it will default to the elements parent).  The element is usually absolutely positioned on top of the `fitWithin` element, but the plugin can techincally be used without that being set.

The script takes the `outerWidth` and `outerHeight` of the element (so including margins) and checks the `height` and `width` of the fitWithin. If the vertical or horizontal size of the element exceeds the size of the fitWithin element it will apply the first class in the `sizeClasses` list.  This class normally does something to make the size of the element smaller. Reduce font size, padding, spacing, etc.  After applying the first class it checks the sizes again and if it still doesn't fit applies the next class, which should take further action in reducing the footprint of the element. Rinse, wash, repeat.

You can "reserve" space for a subject in an image by giving the element a large padding or margin.  For example if you gave the target element a 50% right margin, that would make sure the text wrapped ensuring no text went over the subject of the image on the right half of the image.

## Requirements
mediaLoader uses jQuery and the jQuery UI [Widget Factory](http://api.jqueryui.com/jQuery.widget/).

```
<script src="jquery.js"></script>  
<script src="jquery.ui.widget.js"></script>
<script src="lds.makeFit.js"></script>
```

## HTML
No specific HTML is needed

## CSS
No extra CSS is used or needed, other than for the classes that are being applied as part of the script.

## mediaLoader API

### fitWithin
Type: `string/function`
Default: `function(a,self){	return self.element.parent();}`

A selector or function that returns an object of elements that the current element should fit within. Suggest using function, as the selector version will likely be removed in a future update.

### sizeClasses
Type: `string`
Default: `small smaller smallest`

A space separated list of classes that will be applied to an element in left to right order. You can have as few or as many as you would like. Each class should do something to try to solve the problem of making the element fit within the `fitWithin` element. Normally reducing font-size, padding, margin, etc. A good last step is to change to `position:static` and display below the `fitWithin` element.

### sync
Type: `string`
Default: ``

A selector of other makeFit elements that should be changed at the same time when any have a class applied. If one element has one of the sizeClasses applied, it will be applied to all elements in the sync list. This is useful for visual consistency so sibling elements don't have one with smaller text than another since it had longer text than another and so needed a class applied sooner than others.

### syncFitWithin
Type: `boolean`
Default: `true`

Should the script apply the current sizeClass to the `fitWithin` element as well. Useful for making changes to the `fitWithin` element to help make things fit. Helpful in applying to other children of the `fitWithin` beyond the target element itself.

### addClassTo
Type: `string/function`
Default: `false`

Other elements (parents, siblings, etc) that we want to add the current sizeClass to. Could be a selector, but better would be that it should return an object relative to the current element so we don't match on the same relative element as other makeFit elements. If we had 5 makeFit element and just said ".parent" it would match ".parent" 5 times as it loops through them. By saying something like $(this).closest(".parent") it makes sure to only get the one parent relative to the current makeFit element.

### imgLoadTimeout
Type: `number`
Default: `100`

Number of milliseconds to delay before checking to make sure an image is loaded. Often times the `fitWithin` is an image. If the image isn't loaded yet the height would be 0 and so naturally the target element wouldn't fit within it. The script checks if the `fitWithin` element is an image and if so checks to see if it has a height. If not it uses a `setTimeout` to check again in `imgLoadTimeout` milliseconds.

## Changelog
### 1.3.0
* Removed unused overlayID option
* Moved default for fitWithin up into the options
* Added addClassTo option
* Added syncFitWithin
* Added setClass method

(prior to this note I am pulling from commit notes, not very accurate)

### 1.2.1
* had wrong version number before, should be 1.2.1.

### 1.1.1
* making into a more full fledged plugin, with processes and such. revving to 1.1.1 as a result of jshinting