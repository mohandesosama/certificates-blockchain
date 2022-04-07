// source https://stackoverflow.com/questions/23481817/node-js-passport-autentification-with-sqlite
// source https://youtu.be/mAOxWf36YLo
const SHA256 = require("crypto-js/sha256");
const LocalStrategy = require('passport-local').Strategy;
module.exports=function(passport,db){
    passport.use(new LocalStrategy(function(username, password, done) {
        db.get('select username, id from user where username=? and password=?',username, SHA256(password), function(err, row) {
            if(err) console.log(err)
            if (!row) return done(null, false, {message: 'No user found'});
            return done(null, row);
          });
      }));

      passport.serializeUser(function(user, done) {
        return done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
          //console.log('user id is ',id)
        db.get('SELECT id, username FROM user WHERE id = ?', id, function(err, user) {
          if(err) console.log('this is '+err)
          if (!user) return done(null, false);
          return done(null, user);
        });
      });
}