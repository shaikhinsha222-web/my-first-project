const express = require("express");
const path = require("path");
const ejs = require("ejs");
const mysql = require("mysql2");
const con = require("./conection.js"); // using 'con' as variable for 'db'

const app = express();

// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------------- ROUTES ----------------

// Home Page
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Signup Page
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

// Signup Form Submission
app.post("/signup", (req, res) => {
    console.log("📩 Sign Up Form Submitted");

    const { fname, lname, address, contact_no, email, password } = req.body;
    const sql = `INSERT INTO customer (f_name, l_name, address, contact_no, email, password) VALUES (?, ?, ?, ?, ?, ?)`;

    con.query(sql, [fname, lname, address, contact_no, email, password], (err, results) => {
        if (err) {
            console.error("❌ Error inserting signup record:", err);
            return res.status(500).send("Database error. Please try again later.");
        }
        console.log(`✅ ${results.affectedRows} signup record(s) inserted`);
        res.redirect("/login");
    });
});

// Login Page
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Login Form Submission
app.post("/login", (req, res) => {
    console.log("🔐 Login Form Submitted");

    const { email, password } = req.body;
    const sql = `SELECT * FROM customer WHERE email = ? AND password = ?`;

    con.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("❌ Error fetching login data:", err);
            return res.status(500).send("Database error. Please try again later.");
        }

        if (results.length > 0) {
            console.log("✅ User login successful!");
            res.redirect("/");
        } else {
            console.log("⚠️ Invalid credentials");
            res.render("login.ejs", { error: "Invalid email or password" });
        }
    });
});

// Cakes Page
app.get("/cakes", (req, res) => {
    res.render("cakes.ejs");
});

// Cakes by ID (example)
app.get("/cakes/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM signup WHERE cust_id = ?";

    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error fetching cake details:", err);
            return res.status(500).send("Database error. Please try again later.");
        }
        res.render("cakes.ejs", { data: result[0] });
    });
});

// Cheesecake Page
app.get("/cheesecake", (req, res) => {
    res.render("cheesecake.ejs");
});

// New Arrivals Page
app.get("/NewArrivals", (req, res) => {
    res.render("NewArrivals.ejs");
});

// About Page
app.get("/about", (req, res) => {
    res.render("about.ejs");
});

// Review Page
app.get("/review", (req, res) => {
    res.render("review.ejs");
});

// Contact Page
app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

// Order Page
app.get("/order", (req, res) => {
    res.render("order.ejs");
});

// Order Form Submission
app.post("/order", (req, res) => {
    console.log("🛒 Order Form Submitted");

    const { flavour, quantity, address, date, email } = req.body;
    const sql = "INSERT INTO `order` (flavour, quantity, order_date, address, email) VALUES (?, ?, ?, ?, ?)";

    con.query(sql, [flavour, quantity, date, address,  email], (err, results) => {
        if (err) {
            console.error("❌ Error inserting order:", err);
            return res.status(500).send("Error placing order. Please try again later.");
        }
        console.log(`✅ ${results.affectedRows} order record(s) inserted`);
        res.redirect("/payment");
    });
});

// Payment Page
app.get("/payment", (req, res) => {
    res.render("payment.ejs");
});

// Home Page (after login)
app.get("/home", (req, res) => {
    res.render("home.ejs");
});

// ---------------- SERVER ----------------
app.listen(8081, () => {
    console.log("🚀 Server is listening on port 8081");
});
