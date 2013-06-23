var fs = require('fs');

var readConfig = function(){

   var env = process.env.NODE_ENV || 'development';
   var config;
   var data = fs.readFileSync('./config/config.json');

   try {
      config = JSON.parse(data);
      //console.dir(config);
      //console.dir(config[env]);

      return config[env] || {};
   }
   catch (err) {
      console.log('There has been an error parsing your config.json.');
      console.log(err);
   }

};


module.exports.config = readConfig;