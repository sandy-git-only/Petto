import express from 'express';
import  { createNotifications, publishMatched }  from '../controllers/matchController.js';
const router = express.Router();import { auth } from 'google-auth-library';
import AWS from "aws-sdk";

// const creds = new AWS.SharedIniFileCredentials({profile: 'default'});
// const sns = new AWS.SNS({creds, region:"ap-northeast-1"});




// router.post('/', (req, res) =>  createNotifications(req, res) );

// check if sns status is ok
router.get('/status', (req, res) =>  res.send({status: "ok", sns}));
 
router.post('/subscribe', async (req, res) =>{
    const snsEmail = await createNotifications(req, res);
    let params = {
        Protocol:"EMAIL",
        TopicArn:'arn:aws:sns:ap-northeast-1:220687070155:Petto',
        Endpoint: snsEmail
    }
    sns.subscribe(params, (err, data)=>{
        if(err) console.error(err)
        res.send(data)
    })
})


const sesConfig = {
    sesAccessKey:process.env.SNS_ACCESS_KEY,
    sesSecretKey:process.env.SNS_SECRET_KEY,
    region:process.env.SES_REGION
}
const AWS_SES = new AWS.SES(sesConfig)

const sendEmail = async(recipientEmail,petsNum) =>{
    let params = {
        Source: process.env.AWS_SES_SENDER,
        Destination:{
            ToAddresses: [
                recipientEmail
            ],
        },
        ReplyToAddresses:[],
        Message:{
            Body:{
                Html:{
                    Charset: "UTF-8",
                    Data:'<h1> This is the body </h1>',
                },
                Text:{
                    Charset: "UTF-8",
                    Data:'<h1> This is the text </h1>',
                }
            },
            Subject:{
                Charset: "UTF-8",
                Data:`Petto: You have ${petsNum} matches`,
            }
        }
    }
    try{
        const res = await AWS_SES.sendEmail(params).promise();
        console.log("Email has been sent", res);
    } catch(e){
        console.error(e);
    }
}


router.post('/publish', async (req, res)=>{
    const userPetsNumMap = await publishMatched(req, res);
    
    userPetsNumMap.forEach(async (userPetNum) => {
    sendEmail(userPetNum.snsEmail,userPetNum.petsNum);
        


    // const subject = "Petto - 寵物成功配對通知" ;
    // const message = 
    // `您好，您等待已久的寵物出現囉！
    // 出現了 ${petsNum} 隻寵物，
    // 與你喜歡的寵物來場拍拖，
    // 給他一個溫暖的家吧 !
    // 請到Petto個人頁面查看：https://www.petto.com/user`;
    // let params = {
    //     Subject: subject,
    //     Message: message,
    //     TopicArn: `arn:aws:sns:ap-northeast-1:220687070155:Petto`, 
    // };
    // sns.publish(params, (err, data)=>{
    //     if(err) console.error(err)
    //     res.send(data)
    // })
});
})

export { router };
