if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const flash = require('connect-flash');
const User = require('./models/user.js');

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

let app = express();

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;

// this is connection for database...
main().then((result) => {
  console.log("connection successful..");
}).catch((err) => {
  console.log("error:", err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: process.env.SECRET,   
  },
  touchAfter: 24 * 3600,
});

store.on("error",() => {
  console.log("ERROR in MONGO STORE",err);
  
})

const sessionOptions = ({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
})

// app.get("/", (req, res) => {
//   res.send("root is working..")
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next();
})

// app.get("/getuser",async (req,res) => {
//   let demoUser = new User({
//     email: "faiz@gmail.com",
//     username : "faiz_19",
//   }) 
//  let saveUser = await User.register(demoUser,"12345");
//  res.send(saveUser);
 
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.use((req, res, next) => {
  next(new ExpressError(404, "page not found"));
})
app.use((err, req, res, next) => {
  let { status = 500, message = "something wrong" } = err;
  res.status(status).render("error.ejs", { message, status })
  // res.status(status).send(message);
})

app.listen(3000, () => {
  console.log("server started on 3000");
})
