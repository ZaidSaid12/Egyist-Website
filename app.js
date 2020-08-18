const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const hashedPassword = "c57a46cb86c17954210084c685a094e6eb6c818a2b983e8ec53f3c90daa023ca";



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(cookieParser())

// initialize Database
mongoose.connect('mongodb://localhost:27017/EIS', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
  email: String,
  problem: String
});

const announcementSchema = new mongoose.Schema({
  title: String,
  body: String,
  time: String
});

const credentialSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

const Staff = mongoose.model("Staff", staffSchema);

const Problem = mongoose.model("Problem", problemSchema);

const Announcement = mongoose.model("Announcement", announcementSchema);

const Credential = mongoose.model("Credential", credentialSchema);

function sendEmail(targetMail, message, subject) {
  Credential.findOne({}, (err, mail) => {
    if (err) {
      console.log(err);
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: mail.email,
          pass: mail.password
        }
      });

      var mailOptions = {
        from: "EIS" + "<" + mail.email + ">",
        to: targetMail,
        subject: subject,
        html: message
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  });
}
app.get("/", (req, res) => {

  res.render("index");
});

app.get("/about", (req, res) => {

  res.render("about");
});

app.get("/why-eis", (req, res) => {
  res.render("why-eis");
});

app.get("/facebook", (req, res) => {
  res.redirect("https://www.facebook.com/Egypt.Intellectual.Society");
});

app.get("/instagram", (req, res) => {
  res.redirect("https://www.instagram.com/egyptintellectualsociety");
});

app.get("/youtube", (req, res) => {
  res.redirect("/");
});

app.get("/github", (req, res) => {
  res.redirect("https://github.com/egyist");
});


app.get("/twitter", (req, res) => {
  res.redirect("https://twitter.com/society_egypt");
});

app.get("/signUpForTournament", (req, res) => {
  res.render("signup_for_tournament");
});

app.get("/support", (req, res) => {
  res.render("support");
});

app.get("/formForUs", (req, res) => {

  res.render("formForUs");
});

app.get("/blog",(req, res)=>{
  res.redirect("http://localhost:4000/");
});


app.get("/TournamentForms", (req, res, err) => {
  if (typeof(req.cookies.Password) === "undefined" || req.cookies.Password === "") {

    res.redirect("/");
  } else {
    let password = crypto.createHash('sha256').update(req.cookies.Password).digest('hex');

    if (password === hashedPassword) {
      Tournament.find({}, (err, applicants) => {
        if (err) {
          console.log(err);
        } else {
          res.render("TournamentForms", {
            tournamentApplicants: applicants
          });
        }
      });
    } else {
      res.redirect("/");
    }
  }
});

app.get("/StaffForms", (req, res) => {
  if (typeof(req.cookies.Password) === "undefined" || req.cookies.Password === "") {

    res.redirect("/");
  } else {
    let password = crypto.createHash('sha256').update(req.cookies.Password).digest('hex');
    if (password === hashedPassword) {
      Staff.find({}, (err, applicants) => {
        if (err) {
          console.log(err);
        } else {
          res.render("StaffForms", {
            staffApplicants: applicants
          })
        }
      });
    } else {
      res.redirect("/");
    }
  }
});

app.get("/supportForms", (req, res) => {
  if (typeof(req.cookies.Password) === "undefined" || req.cookies.Password === "") {

    res.redirect("/");
  } else {
    let password = crypto.createHash('sha256').update(req.cookies.Password).digest('hex');
    if (password === hashedPassword) {
      Problem.find({}, (err, applicants) => {
        if (err) {
          console.log(err);
        } else {
          res.render("supportForms", {
            problemApplicants: applicants
          })
        }
      });
    } else {
      res.redirect("/");
    }
  }
});



app.post("/formForUsPassword", (req, res) => {
  let password = crypto.createHash('sha256').update(req.body.password).digest('hex');
  res.cookie("Password", req.body.password, {
    maxAge: 360000
  });

  if (password === hashedPassword) {

    res.render("formsView");
  } else {
    res.redirect("formForUs");
  }

});



app.get("/news", (req, res) => {
  var announcementArray = [];
  Announcement.find((err, announcements) => {
    if (err) {
      console.log(err);
    } else {
      announcementArray = announcements;
      res.render("announcement", {
        announcements: announcementArray
      });
    }
  }).sort({
    "time": -1
  }).limit(5);

});


app.post("/discord_home", (req, res) => {
  res.redirect("https://discord.com/new");
});

app.post("/our_server", (req, res) => {
  res.redirect("https://discord.gg/vUpc3T4");
});

app.post("/signUpForTournament", (req, res) => {
  var newApplicant = new Tournament({
    typeOfTournament: sanitize(req.body.typeOfTournament),
    discordName: sanitize(req.body.discordName),
    email: sanitize(req.body.email)
  });
  newApplicant.save();

  const message = "<h4>Dear " + sanitize(req.body.discordName) + ",</h4> <p>Thanks for Joining EIS. <br> You have successfully signed up for our <b>"+sanitize(req.body.typeOfTournament)+"</b> Tournament.<br>We will contact you later for further information.</p><br><p>Sincerely.<br>EIS - Egypt Intellectual Society</p>"

  sendEmail(sanitize(req.body.email), message, "Signing Up for Our Tournament" );
  res.render("successful", {
    formType: "signUp"
  })
});


app.post("/applyForStaff", (req, res) => {

  var newStaff = new Staff({
    fullName: sanitize(req.body.fullName),
    mobileNumber: sanitize(req.body.mobileNumber),
    discordName: sanitize(req.body.discordName),
    email: sanitize(req.body.email),
    previousExperience: sanitize(req.body.experience)
  });
  newStaff.save();
  const message = "<h4>Dear " + sanitize(req.body.fullName) + ",</h4> <p>Thanks for Joining EIS. <br> Your application to join our staff was submitted successfully and will be reviewed.<br>We will contact you later for further information.</p><br><p>Sincerely.<br>EIS - Egypt Intellectual Society</p>"

  sendEmail(sanitize(req.body.email), message, "Applying For Staff" );
  res.render("successful", {
    formType: "applyForStaff"
  })
});

app.post("/support", (req, res) => {

  var newProblem = new Problem({
    fullName: sanitize(req.body.fullName),
    mobileNumber: sanitize(req.body.mobileNumber),
    discordName: sanitize(req.body.discordName),
    email: sanitize(req.body.email),
    problem: sanitize(req.body.problem)
  });
  newProblem.save();

  const message = "<h4>Dear " + sanitize(req.body.fullName) + ",</h4> <p>Thanks for Joining EIS. <br> We have recieved your concern and we will work on solving it.<br>We will contact you later for further information.</p><br><p>Sincerely.<br>EIS - Egypt Intellectual Society</p>"

  sendEmail(sanitize(req.body.email), message, "Support Ticket Status" );
  res.render("successful", {
    formType: "Support"
  })
});


app.listen(port, () => {
  console.log("server started on port " + port);
});
