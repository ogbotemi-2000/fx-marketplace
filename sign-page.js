let router  = require('express').Router(),
    sign    = require('./sign'),
    db      = require('./db'),
    session = require('./session'),
    views   = require('./views'),
    dash    = require('./dash'),
    https   = require('https');

router.get('/', function(req, res) {
  session.validateJWT(req, res)
  .then(id=>{
    db.user(id, (err, result)=>{
      if(err) /*handle error*/;
      views.signed(req, res, result)
    })
  })
  .catch(err=>{
    console.log('::ERROR:: /sign', err)
    res.sendFile('sign.html', {root:'./'})
  })
})
router.post('/', sign),
router.post('/out', (req, res)=>{
  console.log('::SIGN - LOGOUT::', req.url, '::REDIRECTING::')
})
router.get('/exists', async function(req, res) {
	let email, obj, which, column;
	// , verify = await new Promise((rej, resolve)=>{
	//   https.get('https://app.elasticmail.com?apiKey=<API_KEY>', _res=>{

	//   }),
	//   resolve('')
	// }).catch(console.log)

	for(let i in obj=req.query) which=(email = i).split('_')[0];

	column=db.column(obj[email]),
	db.exists('users', [column, obj[email]], function(err, result, meta){
		let len=result.length, message;
		
		switch(which) {
			case 'up':
				message = !len?'':"Sorry, that's taken: try a unique email"
			break;
			case 'in':
			message=len?'':'Open an account and try that again'
		}
		console.log(message)
		res.send(message)
	})
})

module.exports = router;