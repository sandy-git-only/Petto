import sequelize from "../middlewares/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  insertUsersTable,
  checkUserFromDB,
  generateJWTAceessToken,
  getUserProfile,
} from "../models/userModel.js";
const saltRounds = 10;

export async function userSignUp(req, res) {
  const requestData = await req.body;
  const userPassword = requestData.password;
  const passwordRegex =
    /^(?:(?=(?:[^A-Z]*[A-Z]))|(?=(?:[^a-z]*[a-z]))|(?=(?:[^\d]*\d))|(?=(?:[^\W_]*[~`!@#$%^&*()_+\-={[}\]|:;"'<,>.?\/])))[A-Za-z\d~`!@#$%^&*()_+\-={[}\]|:;"'<,>.?\/]{8,}$/;
  //檢查密碼有沒有符合規則
  const isPasswordValid = await userPassword.match(passwordRegex);
  if (!isPasswordValid) {
    return res
      .status(400)
      .send({ error: "Password does not meet the requirements." });
  }
  // 密碼經過加鹽雜湊加密處理
  bcrypt.genSalt(saltRounds, (saltError, salt) => {
    if (saltError) {
      console.error("Error generating salt: ", saltError);
      return res
        .status(400)
        .json({ error: "Failed to create user.", details: saltError.message });
    }
    bcrypt.hash(userPassword, salt, (hashError, hashedPassword) => {
      if (hashError) throw hashError;

      // 密碼驗證
      const inputPassword = userPassword;
      bcrypt.compare(
        inputPassword,
        hashedPassword,
        async (compareError, isMatch) => {
          if (compareError) throw compareError;
          if (!isMatch) {
            return res
              .status(400)
              .json({ error: "Password does not meet the requirements." });
          }
          const userName = requestData.name;
          const userEmail = requestData.email;
          // const userRole = requestData.role;
          const userData = {
            name: userName,
            email: userEmail,
            password: hashedPassword,
            provider: "native",
          };
          //檢查email是否已經存在
          try {
            const userResult = await checkUserFromDB(userEmail);
            if (userResult.length > 0) {
              return res.status(409).json({ error: "Email Already Exists" });
            }

            const results = await insertUsersTable(userData);
            console.log("User Inserted: ", results.id);

            const payload = {
              id: results.id,
              name: userName,
              email: userEmail,
              // role: userRole
            };
            const token = generateJWTAceessToken(payload);
            const userObject = {
              id: results.id,
              provider: "native",
              name: userName,
              email: userEmail,
              // role: userRole,
              // picture: "None"
            };
            const successResponse = {
              access_token: token,
              access_expired: 3600,
              user: userObject,
            };
            res.status(200).json({ data: successResponse });
          } catch (e) {
            console.error("Error checking email existence: ", e);
            return res
              .status(400)
              .json({ error: "Client Error Response.", details: e.message });
          }
        }
      );
    });
  });
}

export async function userSignIn(req, res) {
  try {
    const requestData = req.body;
    const userEmail = requestData.email;
    const userPassword = requestData.password;
    const results = await checkUserFromDB(userEmail);
    if (results && results.length > 0) {
      const userPasswordInDb = results[0].password;

      bcrypt.compare(
        userPassword,
        userPasswordInDb,
        (compareError, isMatch) => {
          if (compareError) throw compareError;
          if (!isMatch) {
            return res.status(403).json({ error: "Incorrect Password:" });
          } else {
            let payload = {
              id: results[0].id,
              name: results[0].name,
              email: results[0].email,
              // role: results[0].role,
            };
            let access_token;
            try {
              const decodedToken = jwt.verify(
                req.token,
                process.env.JWT_SECRET
              ); // Use the same secret key used to sign the token
              if (decodedToken.exp < Date.now() / 1000) {
                // Token has expired, generate a new one
                access_token = generateJWTAceessToken(payload);
              } else {
                // Token is still valid, use the existing one
                access_token = req.token;
              }
            } catch (verifyError) {
              // Token verification failed, generate a new one
              access_token = generateJWTAceessToken(payload);
            } finally {
              const successResponse = {
                data: {
                  access_token: access_token,
                  access_expired: 3600,
                  user: {
                    id: results[0].id,
                    provider: "native",
                    name: results[0].name,
                    email: userEmail,
                    // role: results[0].role,
                    // picture: "None",
                  },
                },
              };

              res.status(200).json(successResponse);
            }
          }
        }
      );
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error in userSignIn:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}

export async function userProfile(req, res) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    console.error("Token is not provided");
    return res.status(401).json({ error: "Unauthorized token" });
  }
  const token = authorizationHeader.split("Bearer ")[1]; // 去掉 'Bearer ' 前缀
  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.payload.id;
 
    const result = await getUserProfile(userId);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }
    // console.log("getuserProfile:", result);
    const successResponse = {
      userID: userId,
      provider: "native",
      name: result[0].name,
      email: result[0].email,
      // role: result[0].role,
      // "pictiure": "None"
    };
    res.status(200).json({ data: successResponse });
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
}
