import { insertNotificationsTable, findUserEmail } from "../models/matchModel.js";
import { matchingPets } from "../models/matchModel.js";
import { Pets } from "../utils/petsTable.js";
import { subscribeEmail} from "../libs/subscribe-email.js";
import { SubscribeCommand} from "@aws-sdk/client-sns"

export  async function createNotifications(req, res) {
  try {
    const reqData = await req.body;
    const { userID, snsEmail, category, animalClass, type, color, location, gender } =
      reqData;
    const result = await insertNotificationsTable(reqData);
    const userEmail = await findUserEmail (userID);
    const successfullResponse = {
      id: result.id,
      userID: userID,
      snsEmail:snsEmail,
      category: category,
      animalClass: animalClass,
      type: type,
      color: color,
      location: location, 
      gender: gender
    };
    subscribeEmail(snsEmail);
    res.status(200).json(successfullResponse);
  } catch (e) {
    console.error(e);
    res.status(500).json("Server error: " + e.message);
  }
}






export  async function sendSNS(req, res) {
  const matchingResults = await matchingPets (Pets);
  console.log(matchingResults);
  if (matchingResults.length > 0) {
    const sns = new AWS.SNS({
      // region: 'your-aws-region', // 請替換為你的 AWS 區域
      accessKeyId: process.env.SNS_ACCESS_KEY, // 請替換為你的 AWS Access Key ID
      secretAccessKey: process.env.SNS_SECRET_KEY // 請替換為你的 AWS Secret Access Key
    });
  
    matchingResults.forEach((pet) => {
      const params = {
        Message: `Notification message for ${pet.name}`, // 替換為你的通知內容
        Subject: '成功配對！通知您有喜歡的寵物等一個家喔', // 替換為你的通知主題
        TopicArn: 'arn:aws:iam::220687070155:user/petto-SNS' // 替換為你的 SNS 主題 ARN
      };
  
      sns.publish(params, (err, data) => {
        if (err) {
          console.error('Error publishing to SNS:', err);
        } else {
          console.log('Published to SNS:', data);
        }
      });
    });
  }
}


