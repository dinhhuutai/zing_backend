require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const routes = require("./routes");
const db = require("./config/db");

// Connect to DB
db.connect();

app.use(express.json());
app.use(cors());
routes(app);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
