const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const Booking = require('./models/Booking');
const Vehicle = require('./models/Vehicle');
const Feedback = require('./models/Feedback');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const EmailLog = require('./models/Emaillog');
const bookingRoutes = require('./routes/booking'); 

const app = express();

const PORT = 3000;


mongoose
  .connect("mongodb://127.0.0.1:27017/animeAuth", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public"))); 

require('dotenv').config();

app.use(session({
  secret: '749845651451845',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})); 

app.use((req, res, next) => {
  req.session
  next();
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});
app.use('/booking', bookingRoutes);


function checkAuthenticated(req, res, next) {
  if (req.session.user_id) {  
    next();
  } else {
    res.redirect("/login");
  }
}



const userSchema = new mongoose.Schema({
  name:String,
  email: String,
  password: String,
  admin: { type: Boolean, default: false }
});
const User = mongoose.model("User", userSchema);

const isAdmin = async (req, res, next) => {
  try {
      const userId = req.session.user_id;
      if (!userId) {
          return res.status(401).send('Unauthorized: No user ID provided');
      }

      const user = await User.findById(userId);

      if (!user || !user.admin) {
          return res.status(403).send('Forbidden: You do not have access to this page');
      }

      next(); 
  } catch (err) {
      console.error('Error in admin authorization middleware:', err);
      res.status(500).send('Internal Server Error');
  }
};
app.use('/admin', isAdmin);


app.set("view engine", "ejs");
app.get("/",  (req, res) => {
   res.sendFile(path.join(__dirname, 'public', "Client_Panel", "index.html"));
});


app.get("/login", (req, res) => {
  res.render("login", { error: "" });
});



app.get("/logout",checkAuthenticated, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/signup", (req, res) => {
  res.render("signup", { error: "" });
});


app.get("/booking",checkAuthenticated, (req, res) => {
  res.render("booking", { error: "" });
});


app.get('/admin',checkAuthenticated, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find();
    const totalAmount = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const vehicles = await Vehicle.find();
    const vehicleCount = await Vehicle.countDocuments();

    const feedbacks = await Feedback.find();
      const totalFeed = await Feedback.countDocuments();
   
    res.render('Manager/admin',{ bookings, totalAmount , vehicles, feedbacks , totalFeed , vehicleCount});
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Error fetching bookings.');
  }
});



app.get('/dashboard/availability',checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', "Client_Panel", "availability" , "index.html"));
});


app.get('/dashboard/bookings',checkAuthenticated, async(req, res) => {
  try {
    
    const bookings = await Booking.find().sort({ createdAt: -1 });

   
    const emailLogs = await EmailLog.find().sort({ sentAt: -1 });

    res.render('userbook', { bookings, emailLogs });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Server Error');
  }
 
});


app.get('/dashboard/map',checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', "Client_Panel", "map" , "index.html"));
});

app.get('/dashboard/support',checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', "Client_Panel", "support" , "index.html"));
});


app.get('/dashboard/profile',checkAuthenticated,async (req, res) => {
  try {
    const user = await User.findById(req.session.user_id).exec();
    
    res.render('profile', { user });

} catch (err) {
    res.send('Error');
}
});


app.get("/dashboard",checkAuthenticated, (req, res) => {
  res.render('dashboard')
});

app.post("/signup", async (req, res) => {
  const {name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.render("signup", { error: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({name, email, password: hashedPassword });

  await newUser.save();
  res.redirect("/login");
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.render("login", { error: "Invalid email or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.render("login", { error: "Invalid email or password" });
  }

  req.session.user_id = user._id; 
  res.redirect("/dashboard");
});

app.post('/add-vehicle', async (req, res) => {
  try {
    const { vehicleType, name, imagePath, price, seater, transmission, fuel, stock } = req.body;

    const newVehicle = new Vehicle({ 
      vehicleType,
      name,
      imagePath: imagePath , 
      price,
      seater,
      transmission,
      fuel,
      stock
    });

    await newVehicle.save();
    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

app.get('/give-feedback', (req, res) => {
 
  res.render('feedback/feedbackForm')
});

app.post('/submit-feedback', async (req, res) => {
  const { name, phone, email, feedback } = req.body;

  try {
      const newFeedback = new Feedback({ name, phone, email, feedback });
      await newFeedback.save();
      const adminMailOptions = {
          from: process.env.GMAIL_USER,
          to: 'roshnisrivastava38@gmail.com',
          subject: 'New Feedback Received',
          html: `
              <h2>New Feedback</h2>
              <p><b>Name:</b> ${name}</p>
              <p><b>Phone:</b> ${phone}</p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Feedback:</b> ${feedback}</p>
          `,
      };

      await transporter.sendMail(adminMailOptions);
      const userMailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Thank You for Your Feedback',
          text: 'Thank you for your feedback! We will review it shortly.',
      };

      await transporter.sendMail(userMailOptions);

      res.sendStatus(200); 
  } catch (err) {
      console.error('Error handling feedback:', err);
      res.status(500).send('An error occurred. Please try again later.');
  }
});



app.get('/feedbacks' , async(req, res) => {
  res.render('feedback')
})

app.post('/remove-feedback', async (req, res) => {
  const { feedbackId } = req.body;

  try {
    await Feedback.findByIdAndDelete(feedbackId);
    res.redirect('/admin');
  } catch (err) {
    console.error('Error removing feedback:', err);
    res.status(500).send('Failed to remove feedback.');
  }
});


app.get('/terms' , (req ,res) =>{
  res.sendFile(path.join(__dirname, 'public', "Client_Panel", "terms.html"));
})

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
