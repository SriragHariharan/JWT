const express=require('express')
const router=express.Router()
const flash= require('connect-flash')
const userHelpers=require('../helpers/user-helpers')
const tokenHelpers=require('../helpers/token-helpers')
const auth=require('../middlewares/middleware')


//GET requests are listed here !

router.get('/', (req, res) => {
    let LoginSuccessfull=req.flash('LoginSuccessfull')
    res.render('user/homepage.hbs', {LoginSuccessfull, username:req.cookies.username})
})

router.get('/palaces', auth,  (req, res) => {
    userHelpers.getPalaces().then(palaces => {
        res.render('user/palaces.hbs', {palaces, username:req.cookies.username})
    })
})

router.get('/login', (req, res) => {
    let authFailed=req.flash('auth-failed')
    res.render('user/login.hbs',{authFailed, username:req.cookies.username})
})

router.get('/signup', (req, res) => {
    let userExists= req.flash('userExists')
    res.render('user/signup.hbs', {userExists, username:req.cookies.username})
})

router.get('/create-new-token/:id', async(req, res, next) => {
    let {accessToken, refreshToken} = await tokenHelpers.Token(req.params.id)
    res.cookie('accessToken', accessToken, {maxAge:process.env.ACCESS_TOKEN_MAXAGE} )
    res.cookie('refreshToken', refreshToken, {maxAge:process.env.REFRESH_TOKEN_MAXAGE} )
    // res.redirect('/palaces')
    next()
}) 

router.get('/logout', (req, res) => {
    req.cookies.username=null
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.clearCookie('username')
    res.redirect('/')
})



//POST requests are down below !

router.post('/signup', (req, res) => {
    userHelpers.addNewUser(req.body)
    .then(async response => {
        if(response.status){
            let {accessToken, refreshToken} = await tokenHelpers.Token(response.userID)
            res.cookie("username",response.name )
            res.cookie('accessToken', accessToken, {maxAge:process.env.ACCESS_TOKEN_MAXAGE} )
            res.cookie('refreshToken', refreshToken, {maxAge:process.env.REFRESH_TOKEN_MAXAGE} )
            res.redirect('/')
        }
    })
    .catch(err => {
        req.flash('userExists', 'User already exists')
        res.redirect('/signup')
    })
})

router.post('/login', (req, res) => {
    userHelpers.validateUser(req.body)
    .then(async response => {
        let {accessToken, refreshToken} = await tokenHelpers.Token(response.userID)
        res.cookie("username",response.name )
        res.cookie('accessToken', accessToken, {maxAge:process.env.ACCESS_TOKEN_MAXAGE} )
        res.cookie('refreshToken', refreshToken, {maxAge:process.env.REFRESH_TOKEN_MAXAGE} )

        req.flash('LoginSuccessfull', "Hi User !  Login successfull")
        res.redirect('/')
    })
    .catch(err => {
        console.log(err);
        req.flash('auth-failed', 'Authentication failed !')
        res.redirect('/login')
    })
})


module.exports=router