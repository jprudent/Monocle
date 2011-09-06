//Contributed by Jerome Prudent (jprudent@gmail.com)

//This is an invisible control
//It captures text selection of the ebook and invoke a callback with
//captured text as parameter

Monocle.Controls.Selector = function (reader,callback) {

  var API = { constructor: Monocle.Controls.Selector }
  var k = API.constants = API.constructor;
  var p = API.properties = {}
  
  function initialize() {
    p.reader = reader;
    p.callback = callback;
  } 

  function bind(context, fn, args){
    return function(){
      return fn.apply(context, args);
    };
  }

  function getSelection(){
    var t = (this.all) ? this.selection.createRange().text : this.getSelection();
    p.callback(t)
  }
  
  function createControlElements(cntr) {
    var iframes = p.reader.properties.graph.component;
    for(var i=0; i< iframes.length; i++){
      var iframe = iframes[i].contentDocument;
      iframe.onmouseup = bind(iframe,getSelection)
      if (!iframe.all) iframe.captureEvents(Event.MOUSEUP);
    }
  }
  
  initialize();

  API.createControlElements = createControlElements;

  return API;
}

Monocle.pieceLoaded('controls/selector');
