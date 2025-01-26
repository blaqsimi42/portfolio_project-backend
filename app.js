const express = require('express')
 const path = require ('path')
 const bodyParser = require('body-parser')
 const passport = require('passport')
 const LocalStrategy = require("passport-local")
  const passportLocalMongoose = require("passport-local-mongoose")
  
User = require('./models/user'),
 tasks = require('./routes/tasks'),
 app = express(),
 connectDB = require('./db/connect')
const port = 3000
require('dotenv').config()
//Middleware

app.use(express.json())
app.use(express.static('./public/static'))
app.use('/api/v1/tasks', tasks)

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
app.get('/hello', (req, res) => {
    res.send('task manager app')
})
app.get('/',(req, res)=>{
    res.sendFile(path.resolve(__dirname, './public/static/index.html'))
})

app.get('/api/user/auth/login',(req, res)=>{
    res.sendFile(path.resolve(__dirname, './public/static/login.html'))
})

app.get('/api/newuser/auth/signup',(req, res)=>{
    res.sendFile(path.resolve(__dirname, './public/static/signup.html'))
})

app.get('/api/v1/products',(req, res)=>{
    res.sendFile(path.resolve(__dirname, './public/static/products.html'))
})

app.get('/api/info/about-us',(req, res)=>{
    res.sendFile(path.resolve(__dirname, './public/static/about.html'))
})

app.get('/api/homiefy/home',(req, res)=>{
    res.sendFile(path.resolve(__dirname, './public/static/home.html'))
})

app.all('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, './public/static/errorpage.html'))
} )

//handlers
app.post("/login", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            res.render("secret");
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});

app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server Is Listening On Port ${port}...`))
    } catch (error) {
   console.log(error);
    }
}

start()

