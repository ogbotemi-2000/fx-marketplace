let _toString = Object.prototype.toString;
function Is(entity, type) {
  let a = entity==null||undefined?_toString.call(entity).replace(/\[object |\]/g ,''):entity.constructor.name
  return (type?(type === a || a.toUpperCase()===type.toUpperCase()):a)
}
function curry(fn) {
 return function(arg) {
  if(Is(fn, 'Function')) return fn(arg);
 }
}
function _r(i) {
  let t=this.valueOf()||this, _i = t[i]||i,
  is_i = Is(_i, 'FUNCTION');
    //watch out for Window {0: window, ... when invoking _r globally}
    
  return function(e, as_e) {
      let _e=t[e]||e, is_e = Is(_e, 'FUNCTiON'),
      one = (is_i&&i||is_e&&e), both = is_i && is_e,
      one_as_prop = t[i]||t[e];
      return (one
        ? function(val) {
            return t[one](val)
          }:one_as_prop?one_as_prop:(_i&&i !==0  ? _i : _e&&e !==0&&_e||as_e))
    }
}
function Styles() {
    this.init=function(seed, callback) {
        this.removePseudos = s => (s||'').split(',').map(e=>!e.match(/:[^]*(\s|)/g)&&e.trim()).filter(Boolean).join(',');
        this.default_raw = seed;
        this.stripEscapes = s=> _r(s)(this.default_raw,'').trim().trimEnd().replace(/(\t)+/g, '').replace(/(\n)+/g, '').replace(/( )+{/g, '{');
        
        /*... .map(_=>_.match(/([^,]+,+[^]+\{)+/)&&_.replace(/,/g,_.match(/\{[^]+/g)+'}').split('}')).flat() ... is the aspect that breaks apart grouped selectors in to individual style blocks
            .match(/([^,]+,+[^]+\{)+/) ensures that the regex works only on the selector strings
        */
        this.splitAndMapBraces = s => this.stripEscapes(this.removeCSSComments(_r(s)(this.default_raw,''))).split('}').map(_=>_.match(/([^,]+,+[^]+\{)+/)?_.replace(/,/g,_.match(/\{[^]+/g)+'}').split('}'):_).flat().filter(_=>_.length>1).map(e => e.split('{'));
        this.removeCSSComments = s => _r(s)(this.default_raw,'').split(/\*\/(|\n)/).map(e=>e.replace(/\/\*[^]*/g,'')).join('');

        let r_s = this.splitAndMapBraces();
        this.notYetAMap = r_s;
        this.storedMap = _=> {
         _=new Map(); for(let i=r_s.length,j=0,_0,_1,key,ismdq,val; j<i&&(_1=(r_s[j][1]||'').replace(/\s+/g,''),_0=r_s[j][0], ismdq = /@media/.test(_0), key=ismdq&&(val=[_0.replace(/\s+/g,''),r_s[j][2].replace(/\s+/,'')], _1)||(val=_1, _0), _.set(key, val)); j++); return _
        }
        this.filteredMap = (fn_key, fn_val) => {
         
          let key, val, for_key, for_val, map=new Map(),
          r_s = this.storedMap();
         
          for(let [key, val] of r_s.entries()) {
            val = Is(val,'Array')?val[1]:val,
            for_key = curry(fn_key)(key), for_val = curry(fn_val)(val);
             
            ((for_key !==key&&for_key)||(for_val !== val&&for_val))
             &&map.set(!!for_key===for_key?key:fn_key&&for_key||key, !!for_val===for_val?val:fn_val&&for_val||val);
          }
          return map;
        }
        return this.valueOf();
    }
}
let uuid='dfdccc76-eabf-4e86-8ca8-e8f57d6a1d05',value=new Map(),previousData,
rgx=/^[0-9]+/,stored, arr, data,replaced;


addEventListener('message', string => {  
  data=string.data, match=data&&data.match(rgx);
  if(data.match(uuid)) {
    
    arr=data.split(uuid).filter(Boolean).map(_=>new Styles().init(_));
  } else if((match &&=match[0])&&previousData !== data)  {
    previousData=data
    
    replaced=data.replace(rgx,'').replace('\x5c','').replace('/','\\\\/').replace('.', '\\\\\\.').replace(/:/g,'\\\\:').replace(/\[|\]\(|\)/g,_=>'\\'+_),
    value=arr[+match].filteredMap(e=>e.replace(/^\./,'').startsWith(data)||e.search(replaced)>-1)
    /*if(value.size)*/ value=[value,+match], postMessage(value)
  }
  
});