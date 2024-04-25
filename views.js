let readAsync = require('../utils/read-async'),
    fs        = require('fs');

module.exports = {
  signed: function(req, res, result){
    console.log('views.signed', result)
    let {email, username} = result[0]
    req.headers['sec-fetch-dest'].match(/iframe/)
    ? 
    res.send('You are temporarily seeing this because it is in an iframe, try visiting /sign in a new tab to see your dashboard') : res.redirect('/dashboard')
  },
  expired: _=>_,
  dash: function(res, result, arr){
    let slot = {};
      arr.forEach(e=>slot[e] = result[e])
      slot['avatar'] = (slot['username']||slot['email']).slice(0, 1).toUpperCase(),
      slot['username'] ||= 'User',
      fs.readFile('./dashboard.html', function(err, buffer, value, rgx){
        rgx = new RegExp(`__UUID::(${arr.join('|')})::DIUU__`, 'g')
        if(err) throw err;
        value = buffer.toString().replace(rgx, e=>{
          return slot[e.replace(/__UUID::|::DIUU__/g, '')]
        })
        res.send(value)
      })
  },
  fromFile: function(filePath, obj, cabk, self) {
    /* schema:
    for obj: {'uid':'::GET::uid-end', _uid:'replace with this'},
    for regex strings: RE::<start>[^,<end>]+<end>
    */
    self = this.fromFile,
    self.uuids||['html', 'script', 'style'].forEach(e=>(self.uuids||={})[e]=`<!--_::${e.toUpperCase()}::_-->`),
    
    fs.readFile(filePath, (err, buffer, file, val, res='')=>{
      file = buffer.toString();
      for(let key in obj) {
        val = obj[key], //will be an [] if key==='::GET::'
        key==='::GET::'
        ? (loop(file, {step:key.length, from:0, cb:(s,f,t,r)=>{
            res &&=res+s[f];
            if(loop(s, {from:f, to:key.length})[0]===val[0]) res+=s[++f];
            if(loop(s, {from:f, to:(val=val.slice(7)).length})[0]===val[1]) return true;
          }
        }), /html/i.test(key)&&(file = res))
        : file = file.replace(((key = key.split(/^RE::/)).length===1
          ? key[0]
          : new RegExp(key[1])), val);
      }
      cabk(file)
    })
  }
}

function loop (str, props, from, to, cb) {
  
  from = Math.abs(props['from'])||0, to = Math.abs(props['to'])||0, cb = props['cb'];
  if(typeof cb !== 'function') cb =_=>!!0;
  let result = [''], has=!0, reach = from+to, down = props['back'];
  
  for(; !cb(str, from, to, result)&&(to?from < reach:has);) {
    result[0] += (has=str[result[1] = down?from--:from++])||'';

    if(down&&to&&from===to) break;
  }
  if(down) result[0] = result[0].split('').reverse().join(''), result[1] &&= ++result[1];
  return result
}