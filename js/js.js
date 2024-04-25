/*
Use cases for the getIterator function below:

a={
    mkItr: function(num) {
    this.breakClosure=num;
    this._itr||=Object.create(getIterator([]), {next:
      {value:_=>{
        return --this.breakClosure>-1?{value:this.breakClosure, 
               done:false}:{value:this.breakClosure=0, done:true}
    }}});
    return this._itr
  }
}
Array.from(a.mkItr(10))

for(let i of a.mkItr(10)) console.log(i)

const Iterator={prototype: [][Symbol.iterator]().__proto__ ||getIterator([])},
x=Symbol(), y=Symbol();

Object.defineProperty(Number.prototype, y, {
  get() {
    let arg=[], n=this.valueOf(), i=0; console.log(n);
    for(; i++<n; arg[i-1]=i-1); return arg;
  },
})

Object.defineProperty(Number.prototype, x, {
  get() {
    let n = 0;
    const next = () => {
      if (n >= this) return { value: undefined, done: true };
      return { value: n++, done: false };
    };
    return Object.create(Iterator.prototype, { next: { value: next } });
  },
});

Object.defineProperty(Number.prototype, y, {
  get() {
    console.log(this)
  },
})
*/

/*very fast and efficient algorithm for tokenizing any part of a css stylesheet*/
let fast_algo =str=>{
str||='';
for(let i = 0, non_cmnts = [], sel_strs = [], vals = [], index = 0, indexes = [], cmnts = [], ahead, in_scope, push = 4, res, j=str.length; i < j;) {
  /* in_scope lets the concerned loops work only within '{' '}', this is required for when selector names are 
     similar to whatever string is being tested as a 
     property name
  */
  /*
    the if statement below is separated from the rest so as to not affect the cascade
  */
  if((res=str[i])==='{') in_scope=true;
  if(/\/\*/.test(res+str[i+1])) {
    /* will be improved in order to make comments existing in style declarations seen as opposed to browsers not "seeing" them */
    for(let _val='', val='', curr; !/\*\//.test(curr+_val)||(cmnts.push(res+val+_val), ++i, 0); val+=(curr=str[++i]), _val=str[i+1]);
  } else {
    ahead=str[push+i]; /* moved here so as to make changes to i by the for loop above reflect on its value*/
    if(in_scope&&/f-/g.test(res+ahead)) {
      for (let ind=0, val=non_cmnts[index], sel='', vld=val.match(/\{/); vld&&val[ind]!=='{'||(sel&&(sel_strs[sel_strs.length]=sel), 0); sel+=val[ind++]);
      for(let _val='', val=''; !/;|\}/.test(_val)||(vals[index++]=res+val, 0); val+=str[++i], _val=str[i+1]); // console.log(sel_strs, vals, indexes, cmnts);
    } else if(res==='}') {
      in_scope=false,
      /* a way to keep indices for separating styles declaration */
      indexes.push(index)
    } else {
      non_cmnts[index]!==undefined?non_cmnts[index]+=res:non_cmnts[index]=i?'':res
    }
  }
  if(i === j-1) console.log(non_cmnts, indexes, sel_strs, vals, cmnts);
  i++; /* brought here so as to make indexes be in sync with elements they point to */
}
}

let font_hack = {'0':'𝟘','1':'𝟙','2':'𝟚','3':'𝟛','4':'𝟜','5':'𝟝','6':'𝟞','7':'𝟟','8':'𝟠','9':'𝟡','a':'𝕒','b':'𝕓','c':'𝕔','d':'𝕕','e':'𝕖','f':'𝕗','g':'𝕘','h':'𝕙','i':'𝕚','j':'𝕛','k':'𝕜','l':'𝕝','m':'𝕞','n':'𝕟','o':'𝕠','p':'𝕡','q':'𝕢','r':'𝕣','s':'𝕤','t':'𝕥','u':'𝕦','v':'𝕧','w':'𝕨','x':'𝕩','y':'𝕪','z':'𝕫','A':'𝔸','B':'𝔹','C':'ℂ','D':'𝔻','E':'𝔼','F':'𝔽','G':'𝔾','H':'ℍ','I':'𝕀','J':'𝕁','K':'𝕂','L':'𝕃','M':'𝕄','N':'ℕ','O':'𝕆','P':'ℙ','Q':'ℚ','R':'ℝ','S':'𝕊','T':'𝕋','U':'𝕌','V':'𝕍','W':'𝕎','X':'𝕏','Y':'𝕐','Z':'ℤ',' ':' '};

function getIterator(arg) { 
  let check;
  if(!(arg===null&&arg===void 0)) {
    this.fn             =e=>(arg.__proto__===e.__proto__||arg.prototype===e.__proto__),
    this.allowedTypes ||=[[], new Map, ''/*new String*/, new Set],
     
    this.check        ||=Symbol.iterator;
    if(arg=this.allowedTypes.find(this.fn)) return arg[this.check]().__proto__;
  }
}

function addBehaviour(fn) {
  return function(to_this) {;
    fn(to_this);
  }
}

function Ajax(opts) {
  let getKeys=Object.keys;
	if(XMLHttpRequest) {
      let xhr, noop = function() {}, callback;
      if(!Ajax.initialized) {
        Ajax.initialized=!0;
        let excluded = {'__proto__':!0,'__defineGetter__':!0,'__lookupGetter__':!0,'__lookupGetter__':!0,'__lookupSetter__':!0,'constructor':!0};
            xhr = new XMLHttpRequest();
        
        Ajax.isSupported = xhr ? !0 : !!0,
        Ajax.sent   ||= {'GET': {}, 'POST':{}},
        Ajax.urls   ||=[],
        Ajax.opened ||= 0,
        Ajax.on     ||=function(state, callback) {state==='sent'&&(Ajax.__callback=callback)},
        Ajax.abort    = () => xhr.abort(),
        Ajax.send     = (arg, __xhr) =>(__xhr = Ajax.__xhr||xhr, promisify(_=>(Ajax.beforeSend||=_=>_)(__xhr)).then(_=>(Ajax.opened&&__xhr.send(), (Ajax.__callback||noop)(__xhr), Ajax.beforeSend=Ajax.__xhr=null, __xhr))),
         /*Ajax.__xhr is intended to be private*/
   	    Ajax.open     = (http_verb, url)=>(Ajax.__xhr||xhr).open(http_verb, url),
        Ajax.extend=(obj)=>{
          if(obj) for(let i in obj) if(!excluded[i]&&obj.hasOwnProperty(i)) (Ajax.__xhr||xhr)[i]=obj[i];
          return Ajax;
        }
      }
      Ajax.extend(opts)
	  return function(http_verb, makeAsync) {
        return function(url, open) {
          open =_=>(Ajax.opened=1, Ajax.open(http_verb=http_verb.toUpperCase(), (Ajax.sent[http_verb][url]=xhr||Ajax.__xhr, Ajax.urls.push(url), url))),
          Ajax.callCount||=0
          if(Ajax.callCount===0) {
            open()
          } else {
            if(makeAsync) Ajax.__xhr = new XMLHttpRequest(), Ajax.extend(opts), open();
            else { 
              Ajax.opened=0,
              Ajax.on('sent', function(arg) {
                open()
              })
            }
          }
          (Ajax.callCount||=0)<2&&Ajax.callCount++
          return Ajax;
		}
	  }
   }
}


var De = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
    229: "q"
}, _e = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: '"',
    229: "Q"
};
const Bit={
 hasOppositeSigns:(x,y)=>(x^y)<0
},
F=Function,prot =_=>_.prototype,prot_F=prot(F),
mDize = _=>prot_F.call.bind(_),O=Object,prot_O = prot(O),_toString = mDize(prot_O.toString),

uuid = (a) => (a ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)),
className_uuid=_=>uuid(_).replace(/^(-)*[0-9]+(-)*/,''),
decodeJWTToken = (token) =>
    decodeURIComponent(
        atob(token.split('.')[1].replace('-', '+').replace('_', '/'))
            .split('')
            .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
    ),
hexToRgb = (hex) =>
    hex
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16)),
  and=_=>_&&_,or=(_,_1)=>_||_1,n=_=>!_, w = window, d = document, html = d.documentElement,
	Browser = (function(){
    	let ua = navigator.userAgent,
    	isOpera = Is(w.opera, 'Opera');
    	return {
      	IE:             !!w.attachEvent && !isOpera,
     	Opera:          isOpera,
      	WebKit:         ua.indexOf('AppleWebKit/') > -1,
      	Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      	MobileSafari:   /Apple.*Mobile/.test(ua)
    	}
    })(),
    AutoPrefixer = {
        IE: 'ie',
        Gecko: 'moz',
        WebKit: 'webkit',
        Opera: 'webkit',
        MobileSafari: 'webkit',
       
        getPrefix: function() {
         for(let i in this)
           if(this.hasOwnProperty(i) && Browser[i])
             return this[i]
        }
      },
   A = Array,prot_A = prot(A),
  slice = mDize(prot_A.slice),
  cloneNode = mDize(d.cloneNode),
  H = HTMLElement,prot_H=prot(H),
  gC = w.getComputedStyle, S = Set, M = Math, N = Number, R = RegExp;
  
  function objWalk(e,a,logStack) {
     objWalk.dict||={},
     objWalk.setDict =function(arr){
       if(arr) for(let str, val, i = arr.length; i;  str=(val=arr[--i]).charAt(0), val.replace(/[A-Z]/g, _=>str+=_), this.dict[str]=val);
     };
    let errs=[], trace=[], is_a=Is(a), and=_=>_!==void 0&&_, dict=objWalk.dict;
   
    objWalk.walk_arr=function(e,a,logStack){let i=0; if(Is(a,'Array')) for(let val, j=a.length; (e=Is(val=dict[a[i]]||a[i],'Object')?this.walk_obj(e,val):and(e[val])||(logStack&&errs.push(`${e[dict[a[i-1]]||a[i-1]]} for ${dict[a[i-1]]||a[i-1]} at index ${i-1}`),e))&&(i++, i<j);); return e},
     //[...Is(a[key],'string')?[a[key]]:a[key]].forEach(_=>e=e[_]||(e)) was where ▶ is at.
    objWalk.walk_obj=function(e,a,logStack){if(Is(a,'object')) for(let key in a) for(let val, j=+key; j--;) e=Is(val=dict[a[key]]||a[key],'String')?and(e[val])||e:this.walk_arr(e,val, logStack)/*▶*/; return e};
   
    switch(is_a) {
      case 'Object':
        e=objWalk.walk_obj(e,a,logStack)
      break;
      case 'Array':
        e=objWalk.walk_arr(e,a,logStack)
      break;
      case 'String':
        e=e[dict[a]]||e[a]
      break
    }
    return logStack?{e,errs}:e
  }

  function relation(parent, child) {
      return [parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINED_BY,
              parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINS]
  }
//curry below should be renamed as bind
function curry(fn) {
 return function(arg) {
  if(Is(fn, 'Function')) return fn(arg);
 }
}
	let Styles = {
	   cache:function(arg, index, type) {
         if(!this.cached || build.css.processed.length>this.cached.length) {
           this.cached ||=[]
           for(let i=build.css.processed.length; i--;) {
             if(!this.cached[i]) this.cached[i]=[0,0];
           }
         }
         if(Is(index,'number')) {
           if(Is(arg)===type&&(!this.cached[index][0]||!this.cached[index][1])) {
             switch(type) {
               case 'Map':
                 this.cached[index][0]=arg
               break;
               case 'Array':
                 this.cached[index][1]=arg
             }
           } else {
             return this.cached[arg]&&this.cached[arg][index]
           }
         }
       },
       init : function(seed, callback) {

            this.removePseudos = s => (s||'').split(',').map(e=>!e.match(/:[^]*(\s|)/g)&&e.trim()).filter(Boolean).join(',');
            this.default_raw = seed||qs('style').textContent;
            this.stripEscapes = s=> _r(s)(this.default_raw,'').trim().trimEnd().replace(/(\t)+/g, '').replace(/(\n)+/g, '').replace(/( )+{/g, '{');
            
            /*... .map(_=>_.match(/([^,]+,+[^]+\{)+/)&&_.replace(/,/g,_.match(/\{[^]+/g)+'}').split('}')).flat() ... is the aspect that breaks apart grouped selectors in to individual style blocks
                .match(/([^,]+,+[^]+\{)+/) ensures that the regex works only on the selector strings
            */
            
            this.splitAndMapBraces = (obj,_) => this.cache(obj.cache_index, 1)||(this.cache(_=this.stripEscapes(this.removeCSSComments(_r(obj.text)(this.default_raw,''))).split('}').map(_=>_.match(/([^,]+,+[^]+\{)+/)?_.replace(/,/g,_.match(/\{[^]+/g)+'}').split('}'):_).flat().filter(_=>_.length>1).map(e => e.split('{')),obj.cache_index, 'Array'), _);
            this.removeCSSComments = s => _r(s)(this.default_raw,'').split(/\*\/(|\n)/).map(e=>e.replace(/\/\*[^]*/g,'')).join('');
            
            this.storedMap=obj=>{
              let value;
              if(value=this.cache(obj.cache_index, 0)) { 
                return value
              }
              else { 
                let map=new Map(),r_s = this.splitAndMapBraces(obj); for(let i=r_s.length,j=0,_0,_1,key,ismdq,val; j<i&&(_1=(r_s[j][1]||'').trim().trimEnd(),_0=r_s[j][0], ismdq = /@media/.test(_0), key=ismdq&&(val=[_0.replace(/\s+/g,''),r_s[j][2].replace(/\s+/,'')], _1)||(val=_1, _0), map.set(key, val)); j++);
                return (this.cache(map, obj.cache_index, 'Map'),map)
              }
            }
            //intended to be implemented by a wrapper function or object that supplies the obj argument
            this.filteredMap = (fn_key, fn_val,obj) => {
             
             let key, val, for_key, for_val, map=new Map(),
              r_s = this.storedMap(obj);
             
              for(let [key, val] of r_s.entries()) {
                val = Is(val,'Array')?val[1]:val,
                for_key = curry(fn_key)(key), for_val = curry(fn_val)(val);
                 
                ((for_key !==key&&for_key)||(for_val !== val&&for_val))
                 &&map.set(!!for_key===for_key?key:fn_key&&for_key||key, !!for_val===for_val?val:fn_val&&for_val||val);
              }
              return map;
            }
			return this.valueOf();
		},
		getNodes: function(scope, key_criterion, value_criterion) {
            
            let map = new Map(),
            styles =  this.filteredMap(key_criterion, value_criterion), q;
            
            scope ||= 'html ', scope &&= scope+' ';
            //console.log(scope, styles, key_criterion);
            let qsa=_=>slice(d.querySelectorAll(_)||''), qs=_=>qsa(_)[0];
            for(let key of styles.keys()) {
              q=[];
              let _e, _i, s = key.split(',').map(e=>scope + e);
              let arr=s.length>1
               ? s.forEach(function(e) {q=e.indexOf('*') ^ -1?(_i=qsa(e), q.concat(_i)):(_i=qs(e),_e=qsa(e),q.concat(_e[1]?_e:_i))})
               : s[0].indexOf('*')>-1?(q=qsa(s[0]),[]):(_i=qs(s[0]),_e=qsa(s[0]),q=_e[1]?_e:_i,[]);             
                
              let c=[];
              q=Is(q, 'Array')?(q.forEach((e)=>Is(e, 'Array')
               ?c.push(e.filter(_r)):e&&c.push(e)),q=c):q;
             
              q&&(q.length !==0&&map
               .set(q.length==1?Is(q[0], 'Array')&&q[0]||q.toString():q,
               styles.get(key)))
           }
          return map;
         }
	};

	function Is(entity, type) {
      let a = entity==void 0?_toString(entity).replace(/\[object |\]/g ,''):entity.constructor.name
      return (type?(type === a || a.toUpperCase()===type.toUpperCase()):a)
	}

	Object.prototype._r = function _r(i) {
      let t=this.valueOf()||this;
      return function(e, as_e) {
          let _e=t[e]||e, _i=t[i]||i,
          other=_e||_i, arr=[i,e], one_fn, one_as_prop, neither, both_strings;
       
          if(t!==window) {
            let is_e=Is(_e, 'Function'), is_i=Is(_i, 'Function');
            one_fn= ((is_i&&i)||(is_e&&e)), both = is_i && is_e,
            /* undefined==null */
            one_as_prop = t[i]!=void 0?t[i]:t[e], neither, both_strings;
           
            if(t[i]===void 0&&t[e]===void 0) {
              /*window has to be checked against, there was no way around its presence as 'this' in functions*/
              if(both_strings=(Is(i,'String')&&Is(e,'String'))) neither=as_e;
              else if(i&&e) other=arr.find(e=>!Is(e, 'String'))
               
              if(as_e===void 0) as_e=e||i;
              else as_e=Is(as_e, 'function')?neither=other||as_e(t):as_e
            }
          }
          return (one_fn
            ? function(val) {
                return t[one_fn](val)
              }:one_as_prop !==void 0?one_as_prop:both_strings?neither:neither||other||as_e)
        }
   }
 
 function selector(obj) {
    let a = obj.args, i = a.length;
    if(i==1) return _r(obj['['](a[0]))('');
    let n=[], val, first, sliced, match, has = key=>obj.hasOwnProperty(key);
    
	for(let j=0; j < i; j++) {
		val = a[j], first = val.charAt(0),
		sliced = val.slice(1),
		match  = val.match(/( )+/);

        n[j] = !match&&(has(first)&&obj[first](sliced)
                 || obj['l'](val.split(' ', 1)[0]))
               || obj['['](val);
	}
	return n;
};

let qs, qsa;
prot_H.qs=qs=function() {
  let t = this.document && d || this,
  r=selector({
    args: prot_A.filter.call(arguments, _r),
    '.': e=>prot_A.find.call(t.getElementsByClassName(e),(e,i)=>!i),
    '#': e=>t.getElementById(e),
    '[': e=>t.querySelector(e),
    'l': e=>prot_A.find.call(t.getElementsByTagName(e),(e,i)=>!i)
  }); return r||''},
 
 prot_H.qsa=qsa=function() {
   let t = this.document && d || this,
   result = selector({
     args: prot_A.filter.call(arguments, _r),
     '.': e=>slice(t.getElementsByClassName(e)),
     '#': e=>t.getElementById(e),
     '[': e=>slice(t.querySelectorAll(e)),
     'l': e=>slice(t.getElementsByTagName(e))
 }); return result.length?result:'' };
  
  let getStyle = (e, p) => e instanceof H ? gC(e, null)[p] : null;
 
  w.onbeforeunload = function() {
    return 'redundant non-empty string';
  };

  /**
   * Returns a formatted localized string where $1 to $9 are replaced by the
   * second to the tenth argument. Any standalone $ signs must be escaped as
   * $$.
   * @param {string} label The label to substitute through.
   *     This is not an resource ID.
   * @param {...(string|number)} var_args The extra values to include in the
   *     formatted output.
   * @return {string} The formatted string.
   */
  function substituteString(label, var_args) {
    const varArgs = arguments;
    return label.replace(/\$(.|$|\n)/g, function(m) {
      expect(m.match(/\$[$1-9]/), 'Unescaped $ found in localized string.');
      return m === '$$' ? '$' : varArgs[m[1]];
    });
  }

  /**
   * Returns a formatted string where $1 to $9 are replaced by the second to
   * tenth argument, split apart into a list of pieces describing how the
   * substitution was performed. Any standalone $ signs must be escaped as $$.
   * @param {string} label A localized string to substitute through.
   *     This is not an resource ID.
   * @param {...(string|number)} var_args The extra values to include in the
   *     formatted output.
   * @return {!Array<!{value: string, arg: (null|string)}>} The formatted
   *     string pieces.
   */
  function getSubstitutedStringPieces(label, var_args) {
    const varArgs = arguments;
    // Split the string by separately matching all occurrences of $1-9 and of
    // non $1-9 pieces.
    const pieces = (label.match(/(\$[1-9])|(([^$]|\$([^1-9]|$))+)/g) ||
                    []).map(function(p) {
      // Pieces that are not $1-9 should be returned after replacing $$
      // with $.
      if (!p.match(/^\$[1-9]$/)) {
        expect(
            (p.match(/\$/g) || []).length % 2 === 0,
            'Unescaped $ found in localized string.');
        return {value: p.replace(/\$\$/g, '$'), arg: null};
      }

      // Otherwise, return the substitution value.
      return {value: varArgs[p[1]], arg: p};
    });

    return pieces;
  }

  /**
   * Checks condition, throws error message if expectation fails.
   * @param {*} condition The condition to check for truthiness.
   * @param {string} message The message to display if the check fails.
   */
  function expect(condition, message) {
    if (!condition) {
      throw new Error(
          'Unexpected condition on ' + document.location.href + ': ' + message);
    }
  }

  /**
   * Checks that the given value has the given type.
   * @param {string} id The id of the value (only used for error message).
   * @param {*} value The value to check the type on.
   * @param {string} type The type we expect |value| to be.
   */
  function expectIsType(id, value, type) {
    expect(
        typeof value === type, '[' + value + '] (' + id + ') is not a ' + type);
  }
const fonts_hack = {
'Kings Landing': ['𝕥','𝕙','𝕖','𝕢','𝕦','𝕚','𝕔','𝕜','𝕓','𝕣','𝕠','𝕨','𝕟','𝕗','𝕩','𝕛','𝕞','𝕡','𝕤','𝕧','𝕝','𝕒','𝕫','𝕪','𝕕','𝕘','𝕋','ℍ','𝔼','ℚ','𝕌','𝕀','ℂ','𝕂','𝔹','ℝ','𝕆','𝕎','ℕ','𝔽','𝕏','𝕁','𝕄','ℙ','𝕊','𝕍','𝕃','𝔸','ℤ','𝕐','𝔻','𝔾'],
'ALL': []
}
const twindcolors = {
 rose: {
   50: '#fff1f2',
   100: '#ffe4e6',
   200: '#fecdd3',
   300: '#fda4af',
   400: '#fb7185',
   500: '#f43f5e',
   600: '#e11d48',
   700: '#be123c',
   800: '#9f1239',
   900: '#881337',
 },
 pink: {
   50: '#fdf2f8',
   100: '#fce7f3',
   200: '#fbcfe8',
   300: '#f9a8d4',
   400: '#f472b6',
   500: '#ec4899',
   600: '#db2777',
   700: '#be185d',
   800: '#9d174d',
   900: '#831843',
 },
 fuchsia: {
   50: '#fdf4ff',
   100: '#fae8ff',
   200: '#f5d0fe',
   300: '#f0abfc',
   400: '#e879f9',
   500: '#d946ef',
   600: '#c026d3',
   700: '#a21caf',
   800: '#86198f',
   900: '#701a75',
 },
 purple: {
   50: '#faf5ff',
   100: '#f3e8ff',
   200: '#e9d5ff',
   300: '#d8b4fe',
   400: '#c084fc',
   500: '#a855f7',
   600: '#9333ea',
   700: '#7e22ce',
   800: '#6b21a8',
   900: '#581c87',
 },
 violet: {
   50: '#f5f3ff',
   100: '#ede9fe',
   200: '#ddd6fe',
   300: '#c4b5fd',
   400: '#a78bfa',
   500: '#8b5cf6',
   600: '#7c3aed',
   700: '#6d28d9',
   800: '#5b21b6',
   900: '#4c1d95',
 },
 indigo: {
   50: '#eef2ff',
   100: '#e0e7ff',
   200: '#c7d2fe',
   300: '#a5b4fc',
   400: '#818cf8',
   500: '#6366f1',
   600: '#4f46e5',
   700: '#4338ca',
   800: '#3730a3',
   900: '#312e81',
 },
 blue: {
   50: '#eff6ff',
   100: '#dbeafe',
   200: '#bfdbfe',
   300: '#93c5fd',
   400: '#60a5fa',
   500: '#3b82f6',
   600: '#2563eb',
   700: '#1d4ed8',
   800: '#1e40af',
   900: '#1e3a8a',
 },
 lightBlue: {
   50: '#f0f9ff',
   100: '#e0f2fe',
   200: '#bae6fd',
   300: '#7dd3fc',
   400: '#38bdf8',
   500: '#0ea5e9',
   600: '#0284c7',
   700: '#0369a1',
   800: '#075985',
   900: '#0c4a6e',
 },
 cyan: {
   50: '#ecfeff',
   100: '#cffafe',
   200: '#a5f3fc',
   300: '#67e8f9',
   400: '#22d3ee',
   500: '#06b6d4',
   600: '#0891b2',
   700: '#0e7490',
   800: '#155e75',
   900: '#164e63',
 },
 teal: {
   50: '#f0fdfa',
   100: '#ccfbf1',
   200: '#99f6e4',
   300: '#5eead4',
   400: '#2dd4bf',
   500: '#14b8a6',
   600: '#0d9488',
   700: '#0f766e',
   800: '#115e59',
   900: '#134e4a',
 },
 emerald: {
   50: '#ecfdf5',
   100: '#d1fae5',
   200: '#a7f3d0',
   300: '#6ee7b7',
   400: '#34d399',
   500: '#10b981',
   600: '#059669',
   700: '#047857',
   800: '#065f46',
   900: '#064e3b',
 },
 green: {
   50: '#f0fdf4',
   100: '#dcfce7',
   200: '#bbf7d0',
   300: '#86efac',
   400: '#4ade80',
   500: '#22c55e',
   600: '#16a34a',
   700: '#15803d',
   800: '#166534',
   900: '#14532d',
 },
 lime: {
   50: '#f7fee7',
   100: '#ecfccb',
   200: '#d9f99d',
   300: '#bef264',
   400: '#a3e635',
   500: '#84cc16',
   600: '#65a30d',
   700: '#4d7c0f',
   800: '#3f6212',
   900: '#365314',
 },
 yellow: {
   50: '#fefce8',
   100: '#fef9c3',
   200: '#fef08a',
   300: '#fde047',
   400: '#facc15',
   500: '#eab308',
   600: '#ca8a04',
   700: '#a16207',
   800: '#854d0e',
   900: '#713f12',
 },
 amber: {
   50: '#fffbeb',
   100: '#fef3c7',
   200: '#fde68a',
   300: '#fcd34d',
   400: '#fbbf24',
   500: '#f59e0b',
   600: '#d97706',
   700: '#b45309',
   800: '#92400e',
   900: '#78350f',
 },
 orange: {
   50: '#fff7ed',
   100: '#ffedd5',
   200: '#fed7aa',
   300: '#fdba74',
   400: '#fb923c',
   500: '#f97316',
   600: '#ea580c',
   700: '#c2410c',
   800: '#9a3412',
   900: '#7c2d12',
 },
 red: {
   50: '#fef2f2',
   100: '#fee2e2',
   200: '#fecaca',
   300: '#fca5a5',
   400: '#f87171',
   500: '#ef4444',
   600: '#dc2626',
   700: '#b91c1c',
   800: '#991b1b',
   900: '#7f1d1d',
 },
 warmGray: {
   50: '#fafaf9',
   100: '#f5f5f4',
   200: '#e7e5e4',
   300: '#d6d3d1',
   400: '#a8a29e',
   500: '#78716c',
   600: '#57534e',
   700: '#44403c',
   800: '#292524',
   900: '#1c1917',
 },
 trueGray: {
   50: '#fafafa',
   100: '#f5f5f5',
   200: '#e5e5e5',
   300: '#d4d4d4',
   400: '#a3a3a3',
   500: '#737373',
   600: '#525252',
   700: '#404040',
   800: '#262626',
   900: '#171717',
 },
 gray: {
   50: '#fafafa',
   100: '#f4f4f5',
   200: '#e4e4e7',
   300: '#d4d4d8',
   400: '#a1a1aa',
   500: '#71717a',
   600: '#52525b',
   700: '#3f3f46',
   800: '#27272a',
   900: '#18181b',
 },
 coolGray: {
   50: '#f9fafb',
   100: '#f3f4f6',
   200: '#e5e7eb',
   300: '#d1d5db',
   400: '#9ca3af',
   500: '#6b7280',
   600: '#4b5563',
   700: '#374151',
   800: '#1f2937',
   900: '#111827',
 },
 blueGray: {
   50: '#f8fafc',
   100: '#f1f5f9',
   200: '#e2e8f0',
   300: '#cbd5e1',
   400: '#94a3b8',
   500: '#64748b',
   600: '#475569',
   700: '#334155',
   800: '#1e293b',
   900: '#0f172a',
 },
 black: '#000000',
 white: '#ffffff'
};
