import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import employeeRoute from "./routes/employee.js";
import db from "./db.js";

// Create express app
const app = express();

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS middleware
const corsOptions = {
  method: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// db connection
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
  // Create database if it doesn't exist
  db.query(`SHOW DATABASES LIKE 'employees'`, (err, result) => {
    if (err) {
      throw err;
    }
    // Create tables if they don't exist
    const createEmployee = `CREATE TABLE employees (id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL,job_title VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL UNIQUE,phone VARCHAR(255) NOT NULL,address VARCHAR(255) NOT NULL,city VARCHAR(255) NOT NULL,state VARCHAR(255) NOT NULL);`;
    const createContact = `CREATE TABLE contacts (id INT PRIMARY KEY AUTO_INCREMENT,employee_id INT NOT NULL,primary_name VARCHAR(255) NOT NULL,primary_phone VARCHAR(255) NOT NULL,primary_relationship VARCHAR(255) NOT NULL,secondary_name VARCHAR(255) ,secondary_phone VARCHAR(255) ,secondary_relationship VARCHAR(255) ,FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE);`;
    if (result.length === 0) {
      // Database doesn't exist
      db.query("CREATE DATABASE employees", (err, result) => {
        // Create the database
        if (err) {
          throw err;
        }
        console.log("Database created");
      });
      db.query(`USE employees`, (err, result) => {
        // Use the database
        if (err) {
          throw err;
        }
        console.log("Using database employees");
      });
      db.query(createEmployee, (err, result) => {
        // Create the employees table
        if (err) {
          throw err;
        }
        console.log("Table employees created");
      });
      db.query(createContact, (err, result) => {
        // Create the contacts table
        if (err) {
          throw err;
        }
        console.log("Table contacts created");
      });
    } else {
      // Database exists
      db.query(`USE employees`, (err, result) => {
        // Use the database
        if (err) {
          throw err;
        }
        console.log("Using database employees");
      });
      db.query(
        // Check if the tables exist
        `SELECT table_name as table_name FROM information_schema.tables WHERE table_schema = 'employees' AND table_name IN ('EMPLOYEES', 'CONTACTS');`,
        (err, result) => {
          if (err) {
            throw err;
          }

          if (result.length === 0) {
            // Tables don't exist
            db.query(createEmployee, (err, result) => {
              // Create the employees table
              if (err) {
                throw err;
              }
              console.log("Table employees created");
            });
            db.query(createContact, (err, result) => {
              // Create the contacts table
              if (err) {
                throw err;
              }
              console.log("Table contacts created");
            });
          } else {
            // Tables exist
            console.log("Tables already exist");
          }
        }
      );
    }
  });
});

// Routes
app.use("/", employeeRoute);

// Start server
const PORT = 4040;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
