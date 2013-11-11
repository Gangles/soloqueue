try { macros['randomword'] = { 

  handler: function(place,macroName,params,parser) {
    var state = 0;
    var passageflag = false;
    var chance = 100;
    var r = Math.random() * 100;
    
    for(var i = 0; i < params.length; i++) {
      switch(state) {
        case 0:
          if(params[i] == 'passage') {
            passageflag = true;
            state = 1;
            break;
          }
          //No break !!! fall through if keyword 'passage' is not used
          
        case 1:
          chance -= params[i];
          state = 2;
          break;
          
        case 2:
          if(r >= chance) {
            if(passageflag) macros.display.handler(place,macroName,[ params[i] ]); 
            else new Wikifier(place, params[i]);
            return;
          }
          state = 0;
          break;
      }
    }
  },

  init: function() { }
  
};} catch(e) { 
  throwError(place,"Macro Randomword Error: "+e.message); 
}
