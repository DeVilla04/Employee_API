import express from "express";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controller/employee.js";
const router = express.Router();

router.get("/all", getEmployees);
router.get("/:id", getEmployee);
router.post("/create", createEmployee);
router.put("/update/:id", updateEmployee);
router.delete("/delete/:id", deleteEmployee);

export default router;
