const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

const Booking = require('./models/Booking');
const Vehicle = require('./models/Vehicle');
const Feedback = require('./models/Feedback');
const EmailLog = require('./models/Emaillog');
const bookingRoutes = require('./routes/booking');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS Middleware
app.use(cors({
  origin: 'https://wheelxpress.onrender.com', // Adjust if frontend is hosted separately
  credentials: true
}));

// ✅ Session config
app.use(session({
  secret: '749845651451845',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,         // ✅ Needed for HTTPS
    httpOnly: true,
    sameSite: 'none'      // ✅ Needed for cross-site cookie
  }
}));

// ✅ MongoDB Connection (Atlas)
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ✅ Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Email Transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// ✅ EJS Setup
app.set("view engine", "ejs");

// ✅ Routes
app.use('/booking', bookingRoutes);

// ✅ Auth Middleware
function checkAuthenticated(req, res, next) {
  if (req.session.user_id) next();
  else res.redirect("/login");
}

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  admin: { type: Boolean, default: false }
});
const User = mongoose.model("User", userSchema);

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user_id);
    if (!user || !user.admin) return res.status(403).send("Forbidden");
    next();
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
app.use('/admin', isAdmin);

// ✅ Core Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Client_Panel", "index.html"));
});

app.get("/login", (req, res) => {
  res.render("login", { error: "" });
});

app.get("/signup", (req, res) => {
  res.render("signup", { error: "" });
});

app.get("/logout", checkAuthenticated, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/booking", checkAuthenticated, (req, res) => {
  res.render("booking", { error: "" });
});

app.get("/dashboard", checkAuthenticated, (req, res) => {
  res.render("dashboard");
});

app.get("/dashboard/profile", checkAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.user_id);
  res.render("profile", { user });
});

app.get("/dashboard/map", checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Client_Panel", "map", "index.html"));
});

app.get("/dashboard/support", checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Client_Panel", "support", "index.html"));
});

app.get("/dashboard/availability", checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Client_Panel", "availability", "index.html"));
});

app.get("/dashboard/bookings", checkAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    const emailLogs = await EmailLog.find().sort({ sentAt: -1 });
    res.render("userbook", { bookings, emailLogs });
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/admin", checkAuthenticated, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find();
    const totalAmount = bookings.reduce((sum, b) => sum + b.amount, 0);
    const vehicles = await Vehicle.find();
    const feedbacks = await Feedback.find();
    const vehicleCount = await Vehicle.countDocuments();
    const totalFeed = await Feedback.countDocuments();
    res.render("Manager/admin", { bookings, totalAmount, vehicles, feedbacks, totalFeed, vehicleCount });
  } catch (err) {
    res.status(500).send("Error loading admin data");
  }
});

// ✅ Auth POST
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) return res.render("signup", { error: "Email is already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await new User({ name, email, password: hashedPassword }).save();
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.render("login", { error: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.render("login", { error: "Invalid email or password" });

  req.session.user_id = user._id;
  res.redirect("/dashboard");
});

// ✅ Vehicle POST
app.post("/add-vehicle", async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json({ message: "Vehicle added", vehicle: newVehicle });
  } catch (err) {
    res.status(500).json({ error: "Failed to add vehicle" });
  }
});

// ✅ Feedback POST
app.get("/give-feedback", (req, res) => {
  res.render("feedback/feedbackForm");
});

app.post("/submit-feedback", async (req, res) => {
  try {
    const { name, phone, email, feedback } = req.body;
    await new Feedback({ name, phone, email, feedback }).save();

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'roshnisrivastava38@gmail.com',
      subject: 'New Feedback Received',
      html: `<h2>New Feedback</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone}</p><p><b>Feedback:</b> ${feedback}</p>`
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Thank you for your feedback',
      text: 'We received your feedback and appreciate your input.'
    });

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Feedback error");
  }
});

app.get("/feedbacks", async (req, res) => {
  res.render("feedback");
});

app.post("/remove-feedback", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.body.feedbackId);
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send("Failed to remove feedback");
  }
});

app.get("/terms", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Client_Panel", "terms.html"));
});

// ✅ 404 Page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "error.html"));
});

// ✅ Server Listen
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
