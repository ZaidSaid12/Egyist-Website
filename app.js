const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// initialize Database
mongoose.connect('mongodb://localhost:27017/EIS', {useNewUrlParser: true, useUnifiedTopology: true});

const tournamentSchema = new mongoose.Schema({
  typeOfTournament: String,
  discordName: String,
  email: String
});

const staffSchema = new mongoose.Schema({
  fullName: String,
  mobileNumber: String,
  discordName: String,
  email: String,
  previousExperience: String
});

const problemSchema = new mongoose.Schema({
  fullName: String,
  mobileNumber: String,
  discordName: String,
  problem: String
});

const announcementSchema = new mongoose.Schema({
  title: String,
  body: String,
  time: String
});


const Tournament = mongoose.model("Tournament", tournamentSchema);

const Staff = mongoose.model("Staff", staffSchema);

const Problem = mongoose.model("Problem", problemSchema);

const Announcement = mongoose.model("Announcement", announcementSchema);

app.get("/",(req, res)=>{
  res.render("index");
});

app.get("/about",(req, res)=>{
  res.render("about");
});

app.get("/why-eis",(req, res)=>{
  res.render("why-eis");
});

app.get("/facebook",(req,res)=>{
  res.redirect("https://www.facebook.com/Egypt.Intellectual.Society");
});

app.get("/instagram",(req,res)=>{
  res.redirect("https://www.instagram.com/egyptintellectualsociety");
});

app.get("/youtube",(req,res)=>{
  res.redirect("/");
});

app.get("/github",(req,res)=>{
  res.redirect("https://github.com/egyist");
});


app.get("/twitter",(req,res)=>{
  res.redirect("https://twitter.com/society_egypt");
});

app.get("/signUpForTournament",(req,res)=>{
  res.render("signup_for_tournament");
});

app.get("/support",(req,res)=>{
  res.render("support");
});

app.get("/news",(req,res)=>{
  var announcementArray = [];
  Announcement.find((err, announcements)=>{
    if (err) {
      console.log(err);
    }else{
      announcementArray=announcements;
      res.render("announcement",{announcements:announcementArray});
}
}).sort({"time":-1}).limit(5);

});


app.post("/discord_home",(req,res)=>{
  res.redirect("https://discord.com/new");
});

app.post("/our_server",(req, res)=>{
  res.redirect("https://discord.gg/vUpc3T4");
});

app.post("/signUpForTournament",(req, res)=>{
  var newApplicant = new Tournament({
    typeOfTournament: sanitize(req.body.typeOfTournament),
    discordName: sanitize(req.body.discordName),
    email: sanitize(req.body.email)
  });
  newApplicant.save();
  res.render("successful",{formType:"signUp"})
});


app.post("/applyForStaff",(req, res)=>{

  var newStaff = new Staff({
    fullName: sanitize(req.body.fullName),
    mobileNumber: sanitize(req.body.mobileNumber),
    discordName: sanitize(req.body.discordName),
    email: sanitize(req.body.email),
    previousExperience: sanitize(req.body.experience)
  });
  newStaff.save();
  res.render("successful",{formType:"applyForStaff"})
});

app.post("/support",(req, res)=>{

  var newProblem = new Problem({
    fullName: sanitize(req.body.fullName),
    mobileNumber: sanitize(req.body.mobileNumbe),
    discordName: sanitize(req.body.discordName),
    problem: sanitize(req.body.problem)
  });
  newProblem.save();
  res.render("successful",{formType:"Support"})
});


app.listen(port, ()=>{
  console.log("server started on port "+ port);
});
