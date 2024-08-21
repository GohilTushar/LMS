import { existanceOfUser } from "../service/userService.js";
import { CLIENTID, CLIENTSECRET} from "./config.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import bcrypt from "bcrypt";
import roleObj from "./role.constant.js";
import User from "../model/user.model.js";
import generateAuthToken from "../utils/generateToken.js";
import { userLeaveCreation } from "../service/leaveService.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENTID,
      clientSecret: CLIENTSECRET,
      callbackURL: "http://localhost:3030/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const email = profile.emails[0].value;        
        const searchQuery={where: { email }}
        const checkEmail = await existanceOfUser(searchQuery);
        // console.log(checkEmail);
        
        if (checkEmail) {
          cb('Exist', checkEmail);
        } else {
          const newPassword = `${email}@GT`;

          const userDetails = {
            name: profile.displayName,
            email: profile.emails[0].value,
            gender: "male",
            image: profile.photos[0].value,
            phone: 123456890,
            address: "India",
            department: "hr",
            password: await bcrypt.hash(newPassword, 10),
            role: roleObj.student,
          };
          const userData = await User.create(userDetails);
          console.log(userData);
          
          await userLeaveCreation(userData.id);

          if (userData) {
            const token = generateAuthToken({
              id: userData._id,
            });
            console.log(userData,token);
            return cb(null, { user: userData ,token});
          }
          else return cb(null, false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

export { GoogleStrategy };
