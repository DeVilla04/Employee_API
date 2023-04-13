import express from "express";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controller/employee.js";
const router = express.Router();

router.get("/all", getEmployees); // List all the employees with pagination
router.get("/:id", getEmployee); // Get a single employee using id
router.post("/create", createEmployee); // Create a new employee
router.put("/update/:id", updateEmployee); // Update an employee using id
router.delete("/delete/:id", deleteEmployee); // Delete an employee using id

export default router;
