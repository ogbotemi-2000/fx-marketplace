let router  = require('express').Router(),
    views   = require('./views'),
    session = require('./session'),
    db      = require('./db'),
    fs      = require('fs');

router.get('/', (req,res)=>{
    session.validateJWT(req, res).then(id => {
        db.user(id, (err, result)=>{
          if(err) throw err;
          views.dash(res, result[0], ['email', 'username', 'avatar'])
        })
      })
      .catch(error => {
        res.redirect('/sign')
      })
})
router.get('/terminal', function(req, res, next){
    console.log(req.query)
    fs.readFile('./terminal.html', function(err, buffer, value, rgx, uuids){
      uuids = ['<!--UUID::HTML-start::IDUU-->', '<!--UUID::HTML-end::IDUU-->']
      rgx = new RegExp(uuids.join('[^]+')),
      buffer.toString().replace(rgx, e=>uuids.forEach(uid=>value=(value||e).replace(uid, ''))),
      res.send(value)
    })
   // setTimeout(_=>res.sendFile('./terminal.html', {root:'./'}), 500)
})
module.exports = router;