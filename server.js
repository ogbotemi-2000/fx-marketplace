const express   = require('express'),
      app       = express(),
      fs        = require('fs'),
      path      = require('path'),
      argv      = process.argv.slice(2),
      options   = ['-a', '-p', '-d'],
      values    = {},
      msgs      = [],
      //modules pertaining to app
      session   = require('./session'),
      signPage  = require('./sign-page'),
      env       = require('./env.json'),
      defs      = ['./', env.PORT||=3000, './'],
      dash      = require('./dash'),
      cookies   = require('cookie-parser');

defs.map((e, i)=>values[options[i]]=e);

/** the code below is for the functionality of getting arguments passed on the command line to the test-server.js file.
 *  node server -p [PORT] -d [directory to listen in] -a [assets directory or '_' - to use the value passed to -d]
 */

for(let i = 0, arr=[], value, len=argv.length, match=_=>(_=_.match(rgx), _&&_[0]), rgx=new RegExp('^('+options.join('|')+')'); i < len;) {
  if(value=match(argv[i])) len&1&&match(argv[i+1])&&argv.splice(i, 1, ...[value, values[value]]), values[value]=path.normalize('./'+argv[i+1]);
  i+=2
};
/* slot in placeholder values here */
values['-a']==='_'&&(msgs.push(`-a :: replacing placeholder '_' with the value - '${values['-d']}' passed to -d`), values['-a'] = values['-d']),

/* check whether specified folder(s) exist and provide a default fallback otherwise */

['-d', '-a'].forEach(e=>{
  !fs.existsSync(values[e])&&(msgs.push(`${e}, :: ${values[e]}, is not a directory, defaulting to ${values[e]='./'}`))
})
// msgs.forEach(e=>console.log(e));

app.use(express.static(path.normalize(values['-a'])));
let port;
app.listen(port=+values['-p'], function() {
  console.log('Server listening on <PORT>', port, 'under <DIRECTORY>', values['-d'], 'and serving assets from <DIRECTORY>', values['-a']);
})
/** end of boilerplate code */

app.use(cookies()),
app.use('/sign', signPage)
app.use('/dashboard', dash)

/** POST endpoint for logging out brought here because clients are redirected to '/' via "action='/'" */
app.post('/', (req, res)=>{
  session.validateJWT(req, res).then(id=>{
    session.logout(id, res), res.sendFile('index.html', {root:'./'})
  }).catch(err=>{
    console.log('::DONE POSTING:: Get over it already', err),
    res.sendFile('index.html', {root:'./'})
  })
})
/*
app.get("/video", function (req, res) {
    const range = req.headers.range;
    console.log('RANGE::', range)
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = "./media-cdn/input.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

*/
