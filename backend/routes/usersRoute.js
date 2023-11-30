import express from 'express';
import { userSignUp, userSignIn, userProfile } from '../controllers/userController.js';
const router = express.Router();import { auth } from 'google-auth-library';
import request from 'request';
// import { generateJWTAceessToken } from '../models/userModel.js';

// const google_client_id = process.env.GOOGLE_CLIENT_ID;
// const google_secret_id = process.env.GOOGLE_CLIENT_SECRET;


router.post('/signup', (req, res) =>  userSignUp(req, res) );
router.post('/signin', (req, res) =>  userSignIn(req, res) );
router.get('/profile', (req, res) =>  userProfile (req, res));


// router.get("/auth/google", function(req, res, next){
        
//         var google_oauth_url = "https://accounts.google.com/o/oauth2/v2/auth?" +  
//         //Scope可以參考文件裡各式各樣的scope，可以貼scope url或是個別命名
//         "scope=email%20profile&"+
//         "redirect_uri=https://ec2-46-51-228-163.ap-northeast-1.compute.amazonaws.com/api/1.0/user/auth/google/callback&"+
//         "response_type=code&"+
//         "client_id=" + google_client_id;
//         res.redirect(google_oauth_url)
//         // res.send(JSON.stringify({"redirect_url":google_oauth_url}));
//         // res.redirect("/auth/google/callback?oauth_url=" + encodeURIComponent(google_oauth_url));
// });
 
   
// router.get("/auth/google/callback", function(req, res) {
//     var code = req.query.code;
//     // console.log(code);
//     //拿code換token
//     var token_option = {
//         url:"https://www.googleapis.com/oauth2/v4/token",
//         method:"POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         form:{
//             code: code,
//             client_id: google_client_id,
//             client_secret: google_secret_id,
//             grant_type:"authorization_code",
//             redirect_uri:"https://ec2-46-51-228-163.ap-northeast-1.compute.amazonaws.com/api/1.0/user/auth/google/callback"
//         }
//     };
//     request(token_option, function(err, resposne, body) {
//         var access_token = JSON.parse(body).access_token;
//         var info_option = {
//             url:"https://www.googleapis.com/oauth2/v1/userinfo?"+"access_token="+access_token,
//             method:"GET",
//         };
//         request(info_option, function(err, response, body){
//             if(err){
//                 res.send(err);
//             }
//             // console.log(response);
//             parseBody = JSON.parse(body);
//             payload={
//                 id: parseBody.id,
//                 name: parseBody.name,
//                 email: parseBody.email,
//             };
//             const JWT_token = generateJWTAceessToken(payload);
//             userObject ={
//                 id: parseBody.id,
//                 provider: "google",
//                 name: parseBody.name,
//                 email: parseBody.email,
//                 picture: parseBody.picture,
//             }

//             // console.log(userObject);
//             res.send({data: { access_token: JWT_token, access_expired: "3600", user: userObject }});
            
//         });
//     })
// });
export { router };