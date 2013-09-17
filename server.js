var nconf = require('nconf');
var cradle = require('cradle');
var Twit = require('twit');

/*
 * get config from file
 */
nconf.file({ file: 'config.json' });

/*
 * setup db connection
 */

var options = {};
if(nconf.get('couchdb').password !== ""){
  options = {auth: {username: nconf.get('couchdb').username, password: nconf.get('couchdb').password}};
}
var db = new(cradle.Connection)(nconf.get('couchdb').ip,
                                nconf.get('couchdb').port,
                                options).database(nconf.get('couchdb').database);

/*
 * twitter thinkgy ;)
 */

var saveTweet = function(tweet) {
  db.save(tweet.id_str, tweet, function(err, res) {
    if(err) console.log(err);
  });
};

var T = new Twit(nconf.get('twitter'));

var stream = T.stream('statuses/filter', {
  track: nconf.get('twitter').track,
  follow: nconf.get('twitter').follow,
});

stream.on('tweet', function(tweet) {
  saveTweet(tweet);
});

