require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const PORT = 5000;


// MySQL Connection

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


// Connect to MySQL

db.connect((err) => {

    if (err) {
        console.log("MySQL connection failed!");
        console.log(err.message);
        return;
    }

    console.log("MySQL connected successfully!");
});


// Test Route

app.get("/", (req, res) => {
    res.send("Portfolio Backend is Running!");
});


// Start Server
// Contact Form API

app.post("/api/messages", (req, res) => {

    const { name, email, message } = req.body;

    // Check required fields

    if (!name || !email || !message) {

        return res.status(400).json({
            success: false,
            message: "Please fill all fields."
        });

    }


    // Insert message into MySQL

    const sql = `
        INSERT INTO messages (name, email, message)
        VALUES (?, ?, ?)
    `;


    db.query(
        sql,
        [name, email, message],
        (err, result) => {

            if (err) {

                console.log("Database error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to save message."
                });

            }


            res.status(201).json({
                success: true,
                message: "Message sent successfully!"
            });

        }
    );

});
// Get All Projects

app.get("/api/projects", (req, res) => {

    const sql = "SELECT * FROM projects";

    db.query(sql, (err, results) => {

        if (err) {

            console.log("Database error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch projects."
            });

        }

        res.json({
            success: true,
            projects: results
        });

    });

});
// Add New Project

app.post("/api/projects", (req, res) => {

    const {
        title,
        description,
        technologies,
        github_link,
        live_link,
        image_url
    } = req.body;


    // Check required fields

    if (!title || !description || !technologies) {

        return res.status(400).json({
            success: false,
            message: "Title, description and technologies are required."
        });

    }


    // SQL Query

    const sql = `
    INSERT INTO projects
    (title, description, technologies, github_link, live_link, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
`;


    db.query(
        sql,
[
    title,
    description,
    technologies,
    github_link || "#",
    live_link || "#",
    image_url || ""
],
        (err, result) => {

            if (err) {

                console.log("Database error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to add project."
                });

            }


            res.status(201).json({
                success: true,
                message: "Project added successfully!",
                projectId: result.insertId
            });

        }
    );

});
// Delete Project

app.delete("/api/projects/:id", (req, res) => {

    const projectId = req.params.id;

    const sql = "DELETE FROM projects WHERE id = ?";

    db.query(sql, [projectId], (err, result) => {

        if (err) {

            console.log("Database error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to delete project."
            });

        }

        res.json({
            success: true,
            message: "Project deleted successfully!"
        });

    });

});
// Update Project

app.put("/api/projects/:id", (req, res) => {

    const projectId = req.params.id;

    const {
        title,
        description,
        technologies
    } = req.body;


    if (!title || !description || !technologies) {

        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });

    }


    const sql = `
        UPDATE projects
        SET title = ?, description = ?, technologies = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [title, description, technologies, projectId],
        (err, result) => {

            if (err) {

                console.log("Database error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update project."
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Project not found."
                });

            }


            res.json({
                success: true,
                message: "Project updated successfully!"
            });

        }
    );

});
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {
        return res.json({
            success: true,
            message: "Login successful!"
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password."
    });
});
app.get("/api/messages", (req, res) => {
    const sql = "SELECT * FROM messages ORDER BY created_at DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.log("Database error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch messages."
            });
        }

        res.json({
            success: true,
            messages: results
        });
    });
});
app.delete("/api/messages/:id", (req, res) => {
    const messageId = req.params.id;

    const sql = "DELETE FROM messages WHERE id = ?";

    db.query(sql, [messageId], (err, result) => {
        if (err) {
            console.log("Database error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to delete message."
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Message not found."
            });
        }

        res.json({
            success: true,
            message: "Message deleted successfully!"
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});