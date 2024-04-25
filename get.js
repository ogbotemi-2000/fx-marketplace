let https = require('https');

https.get('https://v6.exchangerate-api.com/v6/bec4d8a6786cb3d950b23d87/latest/USD', res=>{
  res.on('data', buffer=>console.log(buffer.toString()))
  res.on('end', _=>console.log('DONE'))
  res.on('error', _=>console.error)

})
