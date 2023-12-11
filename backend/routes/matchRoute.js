import express from "express";
import {
  createNotifications,
  publishMatched,
} from "../controllers/matchController.js";
const router = express.Router();
import { auth } from "google-auth-library";
import AWS from "aws-sdk";

// const creds = new AWS.SharedIniFileCredentials({profile: 'default'});
// const sns = new AWS.SNS({creds, region:"ap-northeast-1"});

// router.post('/', (req, res) =>  createNotifications(req, res) );

// check if sns status is ok
router.get("/status", (req, res) => res.send({ status: "ok", sns }));

router.post("/subscribe", async (req, res) => {
  const email = await createNotifications(req, res);
  // let params = {
  //     Protocol:"EMAIL",
  //     TopicArn:'arn:aws:sns:ap-northeast-1:220687070155:Petto',
  //     Endpoint: email
  // }
  // sns.subscribe(params, (err, data)=>{
  //     if(err) console.error(err)
  //     res.send(data)
  // })
  res.status(200).send("Subscribe successfully!  " + email);
});

const sesConfig = {
  sesAccessKey: process.env.SNS_ACCESS_KEY,
  sesSecretKey: process.env.SNS_SECRET_KEY,
  region: process.env.SES_REGION,
};
const AWS_SES = new AWS.SES(sesConfig);

const sendEmail = async (recipientEmail, petsNum) => {
  let params = {
    Source: process.env.AWS_SES_SENDER,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h3> 你關注的寵寵出現囉 </h3><br /><p> 快到Petto看看! </p>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Petto: 配對成功！有${petsNum} 隻寵寵等你喔`,
      },
    },
  };
  try {
    const res = await AWS_SES.sendEmail(params).promise();
    console.log("Email has been sent", res);
  } catch (e) {
    console.error(e);
  }
};

router.post("/publish", async (req, res) => {
  const userPetsNumMap = await publishMatched(req, res);
  
  
    await Promise.all(userPetsNumMap.map(async (userPetNum) => {
        if (userPetNum.petsNum > 0) {
            // console.log("userPetNum", userPetNum);
          // await sendEmail(userPetNum.email, userPetNum.petsNum);
        }
      }));
    res.status(200).json(userPetsNumMap)

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


router.post("/matchSuccess", async (req, res) => {
  const userPetsNumMap = await publishMatched(req, res);
  
  
    await Promise.all(userPetsNumMap.map(async (userPetNum) => {
        if (userPetNum.petsNum > 0) {
            // console.log("userPetNum", userPetNum);
          await sendEmail(userPetNum.email, userPetNum.petsNum);
        }
      }));
    res.status(200).json(userPetsNumMap)

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

export { router };
