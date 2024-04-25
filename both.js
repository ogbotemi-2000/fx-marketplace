//functions used both client side and server side goes here

let inBrowser=this.window,
both = {
  validateEmail:function(e) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return re.test(e);
  },
  timeEqual: function(a,b) {
	var mismatch = 0;
	if(a.length !== b.length) return mismatch;	
	  for (var i = 0; i < a.length; ++i) {
		mismatch |= (a.charCodeAt(i) ^ b.charCodeAt(i));
	  }
	  return mismatch;
	}
}

if(!inBrowser) module.exports = both;