import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import { PORT, JWTPRIVATEKEY } from "./config/config.js";
import session from "express-session";
import "./model/index.model.js";
import indexRoute from "./route/index.route.js";
import "./config/passport.config.js";
import "./config/cron.js";


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(
  session({
    secret: JWTPRIVATEKEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use("/api", indexRoute);

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
