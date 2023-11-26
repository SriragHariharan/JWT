const redis=require('../configs/redis')
let jwt=require('jsonwebtoken')
const tokenHelpers=require('../helpers/token-helpers')

module.exports= (req, res, next) => {
    let axToken=req.cookies.accessToken
    let refToken=req.cookies.refreshToken
    // console.log("AX token :::", axToken);
    // console.log("REF token :::", refToken);

    if(axToken && refToken){
        let jwtVerify=jwt.verify(axToken, process.env.ACCESS_TOKEN_SECRET)
        if(jwtVerify.userID){
            next()
        }
    }else if(!axToken && refToken){
        let jwtVerify=jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET)
        if(jwtVerify){
            redis.GET('refreshToken')
            .then(token => {
                if(token===refToken){
                    res.redirect('/create-new-token/'+jwtVerify.userID)
                }
            } )
            
        }
    }else{
        res.redirect('/login')
    }
}
