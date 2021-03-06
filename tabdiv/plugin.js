/*Author: Luis Borjas <me@lfborjas.com>
  This is a plugin that wraps the functionality of tabdiv in an unobtrusive manner.

  Based on http://docs.jquery.com/Plugins/Authoring
*/

(function($){

    var methods = {
        init: function(options){            
            return this.each(function () {
                var $this = $(this);
                var settings = {editor: null, 
                                prepend_errors: true,
                                width: 400,
                                height: 200,
                                scale: 1.0
                               };
                if(options){
                    $.extend(settings, options);
                }
                
                var use_editor= !!settings.editor 
                                && $(settings.editor).length > 0 
                                && $(settings.editor)[0].tagName == "TEXTAREA";

                var editor = use_editor ? $(settings.editor) : null;

                /*Variation of the [original code](http://github.com/0xfe/vexflow/blob/master/tabdiv/tabdiv.js)*/

                vextab = new Vex.Flow.TabDiv();
                vextab.code = $this.text();
                //ok, we got the original code, empty the div
                $this.empty();
                vextab.width = settings.width;
                vextab.height = settings.height;
                vextab.scale = settings.scale;
                //set the rendering surface
                if(typeof(Raphael) == "undefined"){
                    vextab.canvas = $('<canvas></canvas>').addClass("vex-canvas");
                    $this.append(vextab.canvas);
                    vextab.renderer = new Vex.Flow.Renderer(vextab.canvas[0],
                        Vex.Flow.Renderer.Backends.CANVAS);
                }else{
                    vextab.canvas = $('<div></div>').addClass("vex-canvas"); 
                    $this.append(vextab.canvas);
                    vextab.renderer = new Vex.Flow.Renderer(vextab.canvas[0],
                        Vex.Flow.Renderer.Backends.RAPHAEL);
                }
                vextab.renderer.resize(settings.width, settings.height);
                vextab.ctx = vextab.renderer.getContext();
                vextab.ctx.scale(settings.scale, settings.scale);

                if(use_editor){
                    editor.addClass("editor").val(vextab.code);   
                    vextab.editor_error = $("<div class='editor-error'></div>");
                    if(settings.prepend_errors){
                        editor.before(vextab.editor_error);
                    }else{
                        editor.after(vextab.editor_error);
                    }

                    editor.keyup(function(){
                        if(vextab.timeoutID){ window.clearTimeout(vextab.timeoutID);}
                        vextab.timeoutID =
                            window.setTimeout(function(){
                                if(vextab.code != editor.val()){
                                    vextab.code = editor.val();
                                    vextab.redraw();
                                }
                            }, 100);
                    });
                }
                $this.data("initialized", true);
                vextab.parser = new Vex.Flow.VexTab();
                vextab.message = "vexflow.com";
                if (!vextab.message) vextab.extra_height = 10; else vextab.extra_height = 20;
                vextab.redraw(); 
                $this.data("tabmachine", vextab);
            });
        },//end of init
        /*Given a string of text, parse and render it in the current tabdiv*/
        renderText : function(text){
            return this.each(function(){
                var $this = $(this);
                if(! $this.data("initialized") ){
                    $this.text(text);
                    $this.tabdiv();
                }else{
                    vextab = $this.data("tabmachine");
                    vextab.code = text;
                    vextab.redraw();
                }
            });
        },//end of renderText

        /*get the inner code of a tabdiv*/
        code: function(text){
            if(this.data("initialized")){
                return this.data("tabmachine").code;
            }
        } //end of code
    };//end of plugin methods
    
    $.fn.tabdiv = function(method){
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tabdiv' );
            return false;
        }     
    };
})(jQuery);
