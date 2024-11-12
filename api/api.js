const express = require("express");
const cors = require("cors");
const db = require("./data/mssql"); // db now includes sequelize as db.sequelize
const customerRoutes = require("./routes/customer.routes");
const fileUpload = require('express-fileupload');
const configViewEngine = require('./config/viewEngine')

const app = express();
const PORT = process.env.PORT || 8080;

var corsOptions = {
    origin: ["http://localhost:4200", "http://localhost:8081"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//config view engine template
configViewEngine(app);

//config upload file
app.use(fileUpload());

// API base path to customers
app.use("/api/customer", customerRoutes);

// Connecting to the database (SQL Server)
async function DbConnect() {
    try {
        await db.sequelize.authenticate()
        console.log('Connection has been established successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

DbConnect();

app.get("/hello", (req, res) => {
    res.json({ message: "Welcome to GymPhuongLuu Web" });
});
