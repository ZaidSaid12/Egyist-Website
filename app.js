const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

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


app.post("/discord_home",(req,res)=>{
  res.redirect("https://discord.com/new");
});

app.post("/our_server",(req, res)=>{
  res.redirect("https://discord.gg/vUpc3T4");
});

app.listen(port, ()=>{
  console.log("server started on port "+ port);
});
