let secret			 	 = '3c458ea2ba35c08d0758106f3d52797630f92f8c915c04e2670201032ac477bc73bbd9',
    jwt				 	   = require('jsonwebtoken'),
    redis			 	   = require('redis'),
	  // creating 24 hours from milliseconds
    oneDay			 	   = 1000 * 60 * 60 * 24,
    redisCl			 	   = redis.createClient(),
    jwt_secret 		 	   = secret,
    jwt_expiration 	 	   = 1000 * 60 * 1,
    jwt_refresh_expiration = 1000 * 60 * 60 * 30, 
    session;

redisCl.on("connect", function () {
    console.log("Redis plugged in.");
});

module.exports = session = {
    logout: function(id, res) {
        // Delete user refresh token from Redis
        redisCl.del(id);
        // ... and then remove httpOnly cookies from browser
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
    },
    refresh: async function(uid, res) {
      let token = jwt.sign({uid}, jwt_secret, {
        expiresIn: jwt_expiration
      }), refresh_token_maxage   = new Date() + jwt_refresh_expiration;
      refresh_token = this.refresh_token(),
      res.cookie('access_token', token, {
          // secure: !0,
          httpOnly: !0
      }),
      res.cookie('refresh_token', refresh_token, {
          // secure: !0
          httpOnly: !0
      })
      redisCl.set(uid, JSON.stringify({
          refresh_token,
          expires: refresh_token_maxage
      }))
      return uid
    },
    validateJWT: function(req, res) {
      return new Promise((resolve, reject) => {
        let tokens = ['access', 'refresh'].map(e=>req.cookies[e+'_token']).filter(Boolean),
            _resolve=_=>resolve(_), expired ;

        // Check if tokens found in cookies
        if (tokens.length) {
          // verifying access_token and refresh_token in cookies
          jwt.verify(tokens[0], jwt_secret, async function(err, decoded) {
            console.log('DECODED', decoded, [decoded.iat, decoded.exp].map(e=>new Date(1000*e).toDateString()), err, await redisCl.get(decoded.uid))
            if (err) {
              //The "TokenExpiredError" error out of three others, fits this context
              // for expired tokens
              if (err.name === "TokenExpiredError") {
                //the expired token would have been stored in Redis at least once
                let redis_token = await redisCl.get(decoded.uid)

                // If the token wasn't found, or the browser has sent us a refresh
                // token that was different than the one in DB last time, then ...
                if (!redis_token || redis_token.refresh_token !== tokens[1]) {
                  // ... we are probably dealing with hack attempt, because either
                  // there is no refresh token with that value, or the refresh token
                  // from request and storage do not equal for that specific user
                  reject("A botched attempt at hacking ;-)");
                } else {
                  // It can also happen that the refresh token expires; in that case
                  // we need to issue both tokens at the same time
                  expired = redis_token.expires > new Date();
                  expired&&this.refresh(decoded.uid, generate_refresh_token(64), res)
                  // And then return the modified request and response objects,
                  // so we can work with them later
                  resolve(decoded.uid)
                }
              } else {
                // If any error other than "TokenExpiredError" occurs, it means
                // that either token is invalid, or in wrong format, or ...  
                reject(err);
              }
            } else {
              // There was no error with validation, access token is valid
              // and none of the tokens expired  
              resolve(decoded.uid)
            }
          })
        } else {
            // No tokens. Someone is trying to access
            // web app without being logged in.
            reject("User is not logged in - Token missing.")
        };
      });
    },
    refresh_token: _=>generate_refresh_token(_||64)
}
// A little helper function for generation of refresh tokens
function generate_refresh_token(len) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}
