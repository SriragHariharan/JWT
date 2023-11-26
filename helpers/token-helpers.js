var jwt = require('jsonwebtoken');
const redis= require('../configs/redis')

module.exports= {
    Token : (userID) => {
        return new Promise( (resolve, reject) => {
            let accessToken = jwt.sign( {userID},   process.env.ACCESS_TOKEN_SECRET  );
            let refreshToken = jwt.sign(  {userID}, process.env.REFRESH_TOKEN_SECRET  );
            redis.SET('refreshToken', refreshToken, 'EX', process.env.REFRESH_TOKEN_MAXAGE )
            resolve({"accessToken":accessToken, "refreshToken":refreshToken})            
        })
    }
}