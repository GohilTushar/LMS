import jwt from "jsonwebtoken";
import { JWTPRIVATEKEY } from "../config/config.js";
import { existanceOfUser } from "../service/userService.js";
import { message } from "../config/message.constant.js";
const { userRelated ,common} = message;

const authenticatedUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json(userRelated.error.noToken);
  try {
    const decode = jwt.verify(token, JWTPRIVATEKEY);
    if (!decode) return res.status(400).json(userRelated.error.invalidToken);

    const searchQuery={
      where:{email:decode.email}
    }

    const user = await existanceOfUser(searchQuery);
    //invalidToken
    if (!user) return res.status(404).json(userRelated.error.userNotExisted);
    req.user = user;
    next();
  } catch (err) {
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError); //serverError
  }
};

export default authenticatedUser;
