#VexFlow: A JavaScript library for rendering music notation and guitar tablature.

This fork includes a [jquery plugin](http://docs.jquery.com/Plugins/Authoring) for the super awesome javascript library for html5 music rendering [0xfe](http://0xfe.blogspot.com).

This one difers a little from the one presented in the [original site](http://www.vexflow.com), namely, the loading mechanism, so don't even expect to work in pages that implement it the other way (though the change is easy enough).

##WTF? (why the fork?)

The original library expects you to add a `vex-tabdiv` to every div that will become a rendering surface, and uses other attributes in that same div to include an optional editor. That is a truly cool solution for sites where that exact functionality is expected fast and without much hacking.

But it makes it harder for guys like me who want full control of what goes on in a view:

*   The editor is dynamically created, so it needs some js to use that textarea in a form.
*   There's no way (well, there probably is, but I didn't find it) to dynamically add plain text to render in the div without an editor.

So, I took the original autoloading logic and put it into a jquery plugin: now you initialize by hand the tabdiv and get methods for dynamically setting and getting its rendering code. The initialization is done via an object parameter instead of attributes, so xhtml nazis can feel comfy too.

Also, I'm planning on adding note-specific coloring in a future (much like the [abcjs plugin](http://code.google.com/p/abcjs/) ) so there's that.

##Usage

First and foremost, even though any selector is accepted in the jquery plugin world, tabdiv **only works well with `div` elements as tabdivs and `textarea` elements as editors**.

Like the standard version, add the following to your document's `HEAD`:
    <script 
      src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
    <script src="http://path/to/vexflow.js"></script>
    <script src="http://path/to/vextabdiv.js"></script>
    <link href="http://path/to/tabdiv.css" media="screen" rel="Stylesheet" type="text/css" /> 

But, unlike the standard version, you'll have a new method available in your `jQuery` object:  `tabdiv`
which accepts the following initialization options:
    
*   `editor`: a selector for the textarea that will be used to edit the tabdiv (p.e. `#my-editor`)
*   `prepend-errors`: whether to report the syntax errors above or below the textarea
(maybe I'll include an option for specifying what text element to use for error reporting... sounds logical).

And provides the following methods:

*   `renderText` (which you call with `$("some-selector").tabdiv("renderText", "some-vexcode")`) : redraws the tabdiv to render the provided code.
*   `code` (call with `$("some-selector").tabdiv("code")` : gets the internal vexcode of the provided tabdiv.

###Examples

Let's say you just want to display a certain vextab code as a tab, assuming you included the scripts, you'd have this (note that it works for more than one tabdiv in a document):

    <head>
        <!-- let's say you put the above scripts here-->
        <script type="text/javascript">
            $(".tab").tabdiv();            
        <script>
    </head>
    <body>
        <div class="tab">
            tabstave
            notes 1-2-3/6
        </div>
        
        <div class="tab">
            tabstave
            notes 1-2-3/4
        </div>
    </body>

Or, that you want an editor that posts it's code:

    <head>
        <!-- let's say you put the above scripts here-->
        <script type="text/javascript">
            $("#tab").tabdiv({editor: "#myeditor"});            
        <script>
    </head>
    <body>
        <div id="tab">
        </div>
        <form action="/somewhere" method="post">
            <textarea id="myeditor" rows=20 columns=40></textarea>

            <input type="submit" value="save">
        </form>
    </body>

**Keep in mind that if you select multiple tabdivs and pass a selector property, that selector will control all of them! So, if you want more than one editable tabdiv in a page, try to select them by id instead of class or whatever('cause you use unique ids, right?).**

##Hacking

For performing full builds, you need the following:

  * JRE
  * Google Closure Compiler (included in support/)
  * SCons
  * git
  * zip

Build with:

    $ scons

Clean with:

    $ scons -c

Quiet build:

    $ scons -Q


##LICENSE
Vex Flow - A JavaScript library for rendering music notation.
Copyright (c) 2010 Mohit Muthanna Cheppudira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

This library makes use of Simon Tatham's awesome font - Gonville.
