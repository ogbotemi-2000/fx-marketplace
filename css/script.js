let fs 	     = require('fs'),
    read_run = fName => fs.readFile(fName, function(err, buf) {
    fs.appendFile('./mix.css', buf, _=>{
     //fs.writeFile('./mix.css', '', console.log)
    })
  });


//fs.writeFile('./mix.css', '', console.log),
['keyframe.css', 'all.min.css', 'test.css', 'test.css',
'all.min.css', 'mix.css']
.forEach(e=>read_run(e))
