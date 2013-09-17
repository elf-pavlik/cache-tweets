var nconf = require('nconf');
var Twit = require('twit');

/*
 * get config from file
 */
nconf.file('creds', 'config.json');
nconf.file('names', 'screen_names.json');

/*
 * twitter thinkgy ;)
 */


var T = new Twit(nconf.get('twitter'));

var names = nconf.get('names');

for(i=0;i<names.length;i++) {
  T.get('users/show', { screen_name: names[i] }, function(err, reply) {
    console.log('"' + reply.id_str + '",');
  });
}
