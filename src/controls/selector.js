//Contributed by Jerome Prudent (jprudent@gmail.com)

//This is an invisible control
//It captures text selection and its context invoke a callback

//callback : a function(text,context) used to retrieve the selected text in his 
//  context
//paragraphClass : a css class name 

Monocle.Controls.Selector = function (reader,callback,paragraphClass) {

  var API = { constructor: Monocle.Controls.Selector }
  var k = API.constants = API.constructor;
  var p = API.properties = {}
  
  function initialize() {
    p.reader = reader;
    p.callback = callback;
    p.paragraphClass = paragraphClass;
    p.console = console || {
      info: function(){},
      warn: function(){},
      error: function(){}
    };
  } 

  
  
  function callCallback(event){
    //note: 'this' is the element that fired the event
    //in firefox, chrome and opera, use this.ownerDocument.getSelection()
    //in ie and opera this.all is defined, but only in ie this.ownerDocument.selection is defined
    var txt = (this.all && this.ownerDocument.selection) ? this.ownerDocument.selection.createRange().text : this.ownerDocument.getSelection();
    var paragraph = this.innerHTML;
    //call txt.toString() in case it's a DOMSelection that is returned
    //if it's a string, this is the same
    if(txt) { p.callback(txt.toString(),paragraph); }
    else { p.callback(txt,paragraph)}
  }
  
  function addSelectorCapacity() {
    var iframes = p.reader.properties.graph.component;
    for(var i=0; i< iframes.length; i++){
      var iframe = iframes[i].contentDocument;
      //add mouseup event for all paragraphs
      var paragraphs = iframe.getElementsByClassName(p.paragraphClass);
      for(var j=0; j < paragraphs.length; j++) {
        paragraphs[j].addEventListener("mouseup",callCallback,false);
      }
    }
    p.console.info("added selector capacity to iframes");
  }
  
  function createControlElements(cntr) {
    p.reader.listen("monocle:pagechange",addSelectorCapacity)
  }
  
  initialize();

  API.createControlElements = createControlElements;

  return API;
}

Monocle.pieceLoaded('controls/selector');
