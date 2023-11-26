<<<<<<______JWT -  Json Web Tokens_______>>>>>>

1. Tokens are used to validate a user from using protected routes.
    code: npm i jsonwebtoken

2. A pair of ACCESS & REFRESH tokens are created each time a user signup / login
    code: jwt.sign( {payload}, JWT_SECRET_KEY)

3. After creation they are stored in cookies
    code: res.cookie(COOKIE_NAME, COOKIE_VALUE, {maxAge: in milliSeconds})
    note: new refresh token is stored redis-DB with old one being overridden 

4. when accessing a protected route, the token is accessed with a middleware
    eg : adminLogger

5. In middleware. 3 cases are considered :
        a :: if both Access & refresh tokens are found ?
             validate access token and
             navigate user to protected routes.
        
        b :: if Access token expired & refresh token exists ?
             Validate refresh token from session first.
             Compare the refresh token from cookies with the redisDB refresh token
             If both matches,  redirect to create a new pair of A & R tokens
             Redirect to wherever want after new Token creation.

        c :: If both access and refresh token is not available, redirect to login page.

6. User can view protected routes as long as he holds a acess token and(or) a new Refresh token. 

7. For logout clear cookies that contain tokens & clear redisDB


_____NOTE______

#  If an access token is expired refresh tokens are used to create a new Access and Refresh token.
#  Refresh tokens should be stored in redisDB rather than mongoDb prefering its fastness.
#  Access tokens should have a lifespan of short duration (say 10 mins - 1 hr)
#  Refresh tokens should have a lifespan of longer duration (say 30 mins - 1 yr)

#  New refresh token is stored in redisDB because any old refresh token can be used to create a new Access token before its expiry date and it will lead to security issues !
#  To prevent a hacker from using old unexpired refresh token to access protected routes we compare current refresh token with token in redisDB