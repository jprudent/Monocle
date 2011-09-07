//Contributed by Jerome Prudent (jprudent@gmail.com)

//This is an invisible control
//It captures text selection and its context invoke a callback

//textCallback : a function(text) used to retrieve the selected text
//paragraphClass : a css class name 
//paragraphCallback optional function(paragraph) used to retrieve the context of
//  selected text

Monocle.Controls.Selector = function (reader,textCallback,paragraphClass,paragraphCallback) {

  var API = { constructor: Monocle.Controls.Selector }
  var k = API.constants = API.constructor;
  var p = API.properties = {}
  
  function initialize() {
    p.reader = reader;
    p.textCallback = textCallback;
    p.paragraphCallback = paragraphCallback;
    p.paragraphClass = paragraphClass;
    p.console = console || {
      info: function(){},
      warn: function(){},
      error: function(){}
    };
  } 

  function getSelection(){
    var t = (this.all) ? this.selection.createRange().text : this.getSelection();
    p.textCallback(t)
  }
  
  function getParagraph(){
    //note: 'this' is the element that fired the event
    var paragraph = this.innerHTML;
    p.paragraphCallback(paragraph);
  }
  
  function addSelectorCapacity() {
    //add mouse up event for all iframes
    var iframes = p.reader.properties.graph.component;
    for(var i=0; i< iframes.length; i++){
      var iframe = iframes[i].contentDocument;
      Monocle.Events.listen(iframe,"mouseup",getSelection);
      //add mouseup event for all paragraphs
      var paragraphs = iframe.getElementsByClassName(p.paragraphClass);
      for(var j=0; j < paragraphs.length; j++) {
        paragraphs[j].addEventListener("mouseup",getParagraph)
      }
    }
    p.console.info("added selector capacity to iframes")
  }
  
  function createControlElements(cntr) {
    p.reader.listen("monocle:pagechange",addSelectorCapacity)
  }
  
  initialize();

  API.createControlElements = createControlElements;

  return API;
}

Monocle.pieceLoaded('controls/selector');
