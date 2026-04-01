import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.route.js';

dotenv.config();

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (backed by MongoDB for persistence)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 7 * 24 * 60 * 60, // 7 days (matches refresh token expiry)
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    sameSite: "lax",
  },
}));


// Routes
app.use("/fms/api/v1", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectDB();
});