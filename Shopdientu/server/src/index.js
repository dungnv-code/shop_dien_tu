const express = require('express');
const env = require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')
// connect db

const db = require("./config/db");
db.connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
app.use(cors(corsOptions));

app.use(cookieParser())

// root router;
const root = require("./router/index");
root(app);


const PORT = process.env.PORT_SERVER || 5000;
app.listen(PORT, () => {
    console.log(`run at http://localhost:${PORT}`);
})