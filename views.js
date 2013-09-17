var nconf = require('nconf');
var cradle = require('cradle');

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
 * create views
 */

db.save('_design/tweets', {
  views: {
    byHashtag: {
      map: function(doc) {
        if(doc.entities.hashtags.length > 0) {
          for(i=0;i<doc.entities.hashtags.length;i++){
            emit(doc.entities.hashtags[i].text.toLowerCase(), doc);
          }
        }
      }
    },
    byScreenName: {
      map: function(doc) {
        emit(doc.user.screen_name.toLowerCase(), doc);
        if(doc.entities.user_mantions.length > 0) {
          for(i=0;i<doc.entities.user_mantions.length;i++){
            emit(doc.entities.user_mantions[i].screen_name.toLowerCase(), doc);
          }
        }
      }
    }
  }
});

