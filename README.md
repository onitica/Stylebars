#StyleBars

##Introduction

A test project I made when I was unfamiliar with Javascript and JQuery. The idea was the make dymamic bars that could be styled. By bar I mean something that represents an x of y relationship (i.e. 3 out of 5). 

Currently the API is incomplete (or possibly even dead wrong). Several unfixed - mainly images are buggy.

##Browsers supported:

Tested on Mac OSX on Chrome, Firefox, and Safari. Likely to work on Windows.

##Usage:

Copy over stylebar.css and stylebar.js and link in your HTML page.

##Dependencies:

JQuery 

##API:

//Returns a JQuery object that can be appended
###get_stylebar(name, params)

	:name - Name to be given to the bar, use this name to select it in the future
	:params - Can be used to override any of the default arguments (look at stylebars.js)
	

//Set the number selected. Useful if it is not selectable by the user	
###set_stylebar_selected(name, selected)

	:name - The name given in the dynamic stylebar constructor
	:selected - The number selected
	
//The number of items selected in the bar
###get_stylebar_selected(name)
	:name - The name given in the dynamic stylebar constructor

//Set the margin between each item in the bar. 10 is the default.
###set_item_margin(name, size) 
	:size - The size of the margin between the bars in px

//Set the size of the items. 15 is the default.
###set_item_size(name, size) 
		:name - Name of the dynamic stylebar to set
		:size - Set the x and y boundaries to the value of size
	
//Set the image paths for the stylebar if using image. Does nothing if the type is not image. Defaults are images/(empty/full)stylebardiv.jpg
###set_image_paths(name, emptypath, fullpath)
		:name - Name of dynamic stylebar to set
		:emptypath - The image path for an non-selected item
		:fullpath - The image path for a selected item
		
//Attach a function to be called whenever the value of the bar is changed
###attach_counter(name, func)
		:name - Name of dynamic stylebar to set
		:func - Takes one parameter, which will be the updated bar value
		
//Remove all counter functions from a bar
###remove_counter(name)
		:name - Name of the dynamic stylebar
		
Copyright (C) 2012 Octavian Nitica

Distributed under the Eclipse Public License.