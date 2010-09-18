/**
 * VexFlow TabDiv
 * Copyright Mohit Muthanna 2010 <mohit@muthanna.com>
 */

Vex.Flow.TabDiv.SEL = ".vex-tabdiv";
Vex.Flow.TabDiv.ERROR_NOCANVAS =
  "<b>This browser does not support HTML5 Canvas</b><br/>" +
  "Please use a modern browser such as <a href='http://google.com/chrome'>" +
  "Google Chrome</a> or <a href='http://firefox.com'>Firefox</a>.";

Vex.Flow.TabDiv= function() {

  this.code = "";

  // Get tabdiv properties
  this.width = ""; 
  this.height = ""; 
  this.scale = ""; 
  this.canvas = null;
  this.renderer = null;

}

Vex.Flow.TabDiv.prototype.redraw = function() {
  var that = this;
  Vex.BM("Total render time: ", function() {
      that.parse(); that.draw();});

  return this;
}

Vex.Flow.TabDiv.prototype.resize = function(width, height) {
  this.renderer.resize(this.width * this.scale, this.height * this.scale);
  this.ctx = this.renderer.getContext();
}

Vex.Flow.TabDiv.prototype.drawInternal = function() {
  if (!this.parser.isValid()) return this;

  if (this.editor_error) this.editor_error.empty();

  var elements = this.parser.getElements();
  var staves = elements.staves;
  if (staves.length == 0) {
    this.resize(this.width, 10);
    this.ctx.clear();
    return this;
  }

  var tabnotes = elements.tabnotes;
  var notes = elements.notes;
  var ties = elements.ties;
  var beams = elements.beams;

  this.height = this.parser.getHeight() + this.extra_height;
  this.resize(this.width, this.height);
  this.ctx.clear();
  this.ctx.setFont("Arial", 8, "Bold");

  for (var i = 0; i < staves.length; ++i) {
    var tabstave = staves[i].tab;
    var notestave = staves[i].note;
    var voice_tabnotes = tabnotes[i];
    var voice_ties = ties[i];

    // Draw stave
    tabstave.setWidth(this.width - 50);
    tabstave.setContext(this.ctx).draw();

    // Draw note stave (if available)
    if (notestave) {
      var voice_notes = notes[i];
      notestave.setWidth(this.width - 50);
      notestave.setContext(this.ctx).draw();

      if (voice_tabnotes && voice_notes) {
        Vex.Flow.Formatter.FormatAndDrawTab(
          this.ctx,
          tabstave, notestave,
          voice_tabnotes, voice_notes,
          this.width - 100);
      }
    } else {
      // Draw notes and bends
      if (voice_tabnotes) Vex.Flow.Formatter.FormatAndDraw(
          this.ctx, tabstave, voice_tabnotes, this.width - 100);
    }

    // Draw ties
    for (var j = 0; j < voice_ties.length; ++j) {
      voice_ties[j].setContext(this.ctx).draw();
    }
  }

  // Draw beams
  for (var j = 0; j < beams.length; ++j) {
    beams[j].setContext(this.ctx).draw();
  }

  if (this.message) {
    this.ctx.setFont("Times", 10, "bold italic");
    this.ctx.fillText(this.message, (this.width / 2) - 40, this.height - 10);
  }

  return this;
}

Vex.Flow.TabDiv.prototype.parseInternal = function() {
  try {
    this.parser.parse(this.code);
  } catch (e) {
    if (this.editor_error) {
      this.editor_error.empty();
      this.editor_error.append(
          $('<span></span>').addClass("text").html(e.message));
    }
  }
  return this;
}

Vex.Flow.TabDiv.prototype.parse = function() {
  var that = this;
  Vex.BM("Parse time: ", function() { that.parseInternal(); });
  return this;
}

Vex.Flow.TabDiv.prototype.draw = function() {
  var that = this;
  Vex.BM("Draw time: ", function() { that.drawInternal(); });
  return this;
}

/*
// Automatic initialization.
Vex.Flow.TabDiv.start = function() {
  $(Vex.Flow.TabDiv.SEL).each(function(index) {
      new Vex.Flow.TabDiv(this);
  });
}
*/
//$(function() {if (Vex.Flow.TabDiv.SEL) { Vex.Flow.TabDiv.start() }});
