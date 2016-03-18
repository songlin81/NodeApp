var express = require('express');
var app = express();
app.use("/", express.static(__dirname));

//dismantle express middleware for X-power
//app.use(function (req, res, next) {
  //res.removeHeader("X-Powered-By");
//  next();
//});
app.disable('x-powered-by');

var products = [
  {id: 0, title: 'Paint pots', description: 'Pots full of paint', price: 3.95},
  {id: 1, title: 'Polka dots', description: 'Dots with that polka groove', price: 12.95},
  {id: 2, title: 'Pebbles', description: 'Just little rocks, really', price: 6.95}
];

app.post('/products', function(req, res) {
    var info="";
    var fs = require('fs');
    
    req.addListener('data', function(chunk) {
        //console.log("data3");
        info += chunk;
      })
    .addListener('end', function() {
      //console.log("->" + unescape(info));
      var dataBuffer = new Buffer(unescape(info.substr(info.indexOf('=') + 1, info.length - 1)), 'base64');
      var noneExistFileName = ['IMG_', new Date() - 0, '.jpg'].join('');
      fs.writeFile(noneExistFileName, dataBuffer, function(err) {
        if (err) throw err;
      //  //console.log("->"+info);
      });
    })
});

app.post('/productsPostMan', function(req, res) {
    var size = 0;
    var fs = require('fs');
      
    var noneExistFileName = ['postMan_', new Date() - 0, '.jpg'].join('');
    var writeStream = fs.createWriteStream(noneExistFileName);
    
    req.on('data', function (data) {
        size += data.length;
        console.log('Got chunk: ' + data.length + ' total: ' + size);
        writeStream.write(data);
    });

    req.on('end', function () {
        writeStream.end();
        console.log("total size = " + size);
    }); 

    req.on('error', function(e) {
        console.log("ERROR ERROR: " + e.message);
    });

    res.send("Thanks");
});

app.get('/products', function(req, res) {
  res.send(products);
  
  //save file to local.
  /*
  var fs = require('fs');
  var noneExistFileName = ['new.', new Date()-0, '.txt'].join('');
  fs.writeFile(noneExistFileName, 'not exist, create', function(err){
    if(err) throw err;
    console.log(noneExistFileName+'already there.');
  });
  */
  
  /*
    var upfile = req.files.upfile;
    var files = [];
    if (upfile instanceof Array) {
        files = upfile;
    } else {
        files.push(upfile);
    }
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var path = file.path;
        var name = file.name;
        var target_path = "./upload/" + name;
        fs.rename(path, target_path, function (err) {
            if (err) throw err;
        });
    }
    */
    var fs = require('fs');
    var noneExistFileName = ['new_', new Date()-0, '.txt'].join('');
    fs.writeFile(noneExistFileName, 'not exist, create', function(err){
      if(err) throw err;
      console.log(noneExistFileName+'...created.');
    });
});


app.get('/products/:id', function(req, res) {
  res.send(products[req.params.id]);
}); 

app.listen(8080||process.env.PORT);