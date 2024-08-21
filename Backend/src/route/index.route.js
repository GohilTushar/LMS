import express from "express";
const router = express.Router();

import user from "./user.route.js";
import auth from "./auth.route.js";
import leave from "./leave.route.js";


router.use("/auth", auth);
router.use("/user", user);
router.use("/leave", leave);

export default router;
