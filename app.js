const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mongoose = require('mongoose');

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

const Tournament = mongoose.model("Tournament", tournamentSchema);

const Staff = mongoose.model("Staff", staffSchema);

const Problem = mongoose.model("Problem", problemSchema);

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

app.get("/twitter",(req,res)=>{
  res.redirect("https://twitter.com/society_egypt");
});

app.get("/signUpForTournament",(req,res)=>{
  res.render("signup_for_tournament");
});

app.get("/support",(req,res)=>{
  res.render("support");
});


app.post("/discord_home",(req,res)=>{
  res.redirect("https://discord.com/new");
});

app.post("/our_server",(req, res)=>{
  res.redirect("https://discord.gg/vUpc3T4");
});

app.post("/signUpForTournament",(req, res)=>{
  var newApplicant = new Tournament({
    typeOfTournament: req.body.typeOfTournament,
    discordName: req.body.discordName,
    email: req.body.email
  });
  newApplicant.save();
  res.render("successful",{formType:"signUp"})
});


app.post("/applyForStaff",(req, res)=>{
  console.log(req.body);
  var newStaff = new Staff({
    fullName: req.body.fullName,
    mobileNumber: req.body.mobileNumber,
    discordName: req.body.discordName,
    email: req.body.email,
    previousExperience: req.body.experience
  });
  newStaff.save();
  res.render("successful",{formType:"applyForStaff"})
});

app.post("/support",(req, res)=>{
  console.log(req.body);
  var newProblem = new Problem({
    fullName: req.body.fullName,
    mobileNumber: req.body.mobileNumber,
    discordName: req.body.discordName,
    problem: req.body.problem
  });
  newProblem.save();
  res.render("successful",{formType:"Support"})
});


app.listen(port, ()=>{
  console.log("server started on port "+ port);
});
