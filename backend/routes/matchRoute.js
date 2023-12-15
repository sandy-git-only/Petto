import express from "express";
import {
  createNotifications,
  publishMatched,
  userPetsMatchedinsertDB,
} from "../controllers/matchController.js";
const router = express.Router();
import { auth } from "google-auth-library";
import AWS from "aws-sdk";
import { findUserMatches, insertMatchesTable } from "../models/matchModel.js";
const creds = new AWS.SharedIniFileCredentials({profile: 'default'});
const sns = new AWS.SNS({creds, region:"ap-northeast-1"});

// router.post('/', (req, res) =>  createNotifications(req, res) );

// check if sns status is ok
router.get("/status", (req, res) => res.send({ status: "ok", sns }));

router.post("/subscribe", async (req, res) => {
  const {email,category} = await createNotifications(req, res);
  console.log("category",category);
  if (category == "走失"){
      const subject = "Petto - ⚠️ 有寵物走失了，請幫忙留意附近" ;
      const message =
      `有寵物走失！請幫忙注意，或是到Petto GPS頁面查看寵物走失地點是否在你的附近喔！
      謝謝你的幫忙`;
      let params = {
          Subject: subject,
          Message: message,
          TopicArn: `arn:aws:sns:ap-northeast-1:220687070155:Petto`,
      };
      sns.publish(params, (err, data)=>{
          if(err) console.error(err)
          // res.send(data)
      })
  //   let params = {
  //     Protocol:"EMAIL",
  //     TopicArn:'arn:aws:sns:ap-northeast-1:220687070155:Petto',
  //     // Endpoint: email
  // }
  // sns.subscribe(params, (err, data)=>{
  //     if(err) console.error(err)
  //     res.send(data)
  // })
  }
  
  res.status(200).send("Subscribe successfully!  user email:" + email);
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
          Data: 
          `<h3> 你關注的寵寵出現囉 🐶🐱</h3>
          <br />
          <p> 快到Petto看看! </p> 
          <br />  
          <br />  
          ---
          <br />            
          <img src="https://petto.s3.ap-northeast-1.amazonaws.com/pets-images/petto-logo.PNG" style="width: 100px; height: auto;" />
          <br />
          Petto 官網 : https://pettotw.com
          `,
          
        },
        Text: {
          Charset: "UTF-8",
          Data: "",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `📢 Petto: 配對成功！有${petsNum} 隻寵寵等你喔 `,
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

router.post("/send-adoption", async (req, res) => {
  const sendEmail = async (recipientEmail, data) => {
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
            Data: `
            <h2>來場拍拖！有拍友想領養你的寵寵 💕</h2>
            ------------------------------
            <h3>領養人資訊</h3>
            <p>☀ 姓名: ${data.name}${data.gender == "boy" ? "♂" :  data.gender == "girl" ? "♀" : ""}</p>
            <p>✉ Email: ${data.email}
            <br />
            <p>☎ 手機/LineID:${data.contact ? data.contact : "未提供"}</p>
            <p>▶ 想問:${data.question ? data.question : "未提供"}</p>
            <br />
            ------------------------------
            <br />            
            <img src="https://petto.s3.ap-northeast-1.amazonaws.com/pets-images/petto-logo.PNG" style="width: 100px; height: auto;" />
            <br />
            Petto 官網 : https://pettotw.com
            `, 
          },
          Text: {
            Charset: "UTF-8",
            Data: ""
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: `Petto:  🔔叮咚！有領養人想與您聯絡`,
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
  const adoptionData = req.body;
  console.log(adoptionData);
  const sendSuccessRes = await sendEmail(adoptionData.email, adoptionData);
  res.status(200).json(sendSuccessRes);
});

router.post("/publish", async (req, res) => {
  const userPetsNumMap = await publishMatched(req, res);
  await Promise.all(
    userPetsNumMap.map(async (userPetNum) => {
      if (userPetNum.petsNum > 0) {
        await sendEmail(userPetNum.email, userPetNum.petsNum);
      }
    })
  );
  res.status(200).json(userPetsNumMap);

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

router.get("/matchSuccess", async (req, res) => {
  const userID = req.query.id;
  const matchesResult = await findUserMatches(userID);
  res.status(200).json(matchesResult);
});

router.get("/match-user", async (req, res) => {
  const userID = req.query.userID;
  const matchesResult = await userPetsMatchedinsertDB(userID);
  if (matchesResult.petsNum > 0) {
    await sendEmail(matchesResult.email, matchesResult.petsNum);
  }
  res.status(200).json(matchesResult);
});

router.post("/create-shelter-match", async (req, res) => {
  const matchesResult = await insertMatchesTable(matchesData);
  res.status(200).json(matchesResult);
});

export { router };
