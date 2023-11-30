import express from 'express';
import  { createNotifications }  from '../controllers/matchController.js';
const router = express.Router();import { auth } from 'google-auth-library';


router.post('/', (req, res) =>  createNotifications(req, res) );
// router.get('/notifications', (req, res) =>  userProfile (req, res));
router.get('/', (req, res) =>  {
    console.log(req.query.message);
    console.log("Number = " + req.query.number);
    console.log("Subject = " + req.query.subject);
    console.log("Sender= " + req.query.sender);
    let params = {
        Message: req.query.message, //簡訊內容
        PhoneNumber: '+' + req.query.number,
        MessageAttributes: {
            //Ref for MessageAttributes:   
            //https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html#sms_publish_sdk
            'AWS.SNS.SMS.SenderID': {
              'DataType': 'String',
              'StringValue': req.query.sender //訊息要顯示的寄件者名稱
        // 'StringValue' is the name of sender appears in the message.It must be 1-11 alpha-numeric characters
            // 要注意 req.query.sender 寄件者名稱長度不可超過11個字
            // 會引發的錯誤訊息可參考下面註解
            }
        }
    }
});
 
export { router };