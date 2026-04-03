require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { sequelize } = require("./config/database");
require("./models"); // Load models to ensure they are synced
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV === 'production');

// connectDB(); // Already covered by sequelize logic if desired or call it here
sequelize.authenticate().then(() => {
  console.log('Database connected');
  sequelize.sync({ alter: true })
    .then(() => console.log('Database synced successfully'))
    .catch(err => console.error('Database sync failed:', err));
}).catch(err => console.error('Database connection failed:', err));

app.use(logger);
// app.set('trust proxy', 1);
app.use(cors(corsOptions));


app.use(express.json({ limit: "600mb" }));
const passport = require('./config/passport');
app.use(passport.initialize());

app.use(express.urlencoded({ limit: "600mb", extended: true }));
app.use(bodyParser.text({ limit: "600mb" }));
app.use(cookieParser());

// 🧬 Static Registry Provisioning
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/auth", require("./routes/authRoutes"));
app.use("/jobs", require("./routes/jobs"));
app.use("/timesheet", require("./routes/timesheet"));
app.use("/userProfiles", require("./routes/userProfileRoutes"));
app.use("/jobApp", require("./routes/jobApp"));
app.use("/jobApplied", require("./routes/abstract"));
app.use("/upload", require("./routes/upload"));
app.use("/contact", require("./routes/contact"));
app.use("/notifications", require("./routes/notificationRoutes"));
app.use("/kyc", require("./routes/kycRoutes"));


// 🏛️ PRODUCTION STATIC HANDSHAKE
// If not an API route, serve the React Frontend from the 'public' folder
app.get("*", (req, res) => {
   // Skip API routes to avoid capturing them if they 404
   const apiRoutes = ["/auth", "/jobs", "/timesheet", "/userProfiles", "/jobApp", "/jobApplied", "/upload", "/contact", "/notifications", "/kyc"];
   if (apiRoutes.some(route => req.path.startsWith(route))) {
      return res.status(404).json({ message: "API endpoint not found in registry." });
   }
   
   // Serve index.html for all other routes to support React Router
   res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
      if (err) {
         res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
      }
   });
});

app.options('*', cors(corsOptions));

app.use(errorHandler);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
