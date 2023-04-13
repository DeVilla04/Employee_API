import db from "../db.js";

// List all the employees with pagination
const getEmployees = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  db.query(
    "SELECT * FROM employees LIMIT ? OFFSET ?",
    [limit, offset],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // get the employee's contact details from the contacts table
        db.query("SELECT * FROM contacts", (err, contacts) => {
          if (err) {
            res.status(500).send(err);
          } else {
            const employees = results.map((employee) => {
              employee.Emergency_Contacts = contacts.filter(
                (contact) => contact.employee_id === employee.id
              );
              return employee;
            });
            res.send(employees);
          }
        });
      }
    }
  );
};

// Get a single employee
const getEmployee = async (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM employees WHERE id = ?", id, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length === 0) {
      res.status(404).send(`Employee with ID ${id} not found`);
    } else {
      // get the employee's contact details from the contacts table
      db.query(
        "SELECT * FROM contacts WHERE employee_id = ?",
        id,
        (err, results) => {
          if (err) {
            res.status(500).send(err);
          } else {
            result[0].Emergency_Contacts = results;
            res.send(result);
          }
        }
      );
    }
  });
};

// Create a new employee
const createEmployee = async (req, res) => {
  console.log(req.body);
  const employee = req.body;
  let contact = {
    primary_name: employee.primary_name,
    primary_phone: employee.primary_phone,
    primary_relationship: employee.primary_relationship,
    secondary_name: employee.secondary_name,
    secondary_phone: employee.secondary_phone,
    secondary_relationship: employee.secondary_relationship,
  };
  // remove contact details from employee object
  let contact_keys = Object.keys(contact);
  contact_keys.forEach((key) => delete employee[key]);

  db.query("INSERT INTO employees SET ?", employee, (err1, result1) => {
    if (err1) {
      res.status(500).send(err1);
    } else {
      // insert the employee's contact details into the contacts table
      contact.employee_id = result1.insertId;
      db.query("INSERT INTO contacts SET ?", contact, (err2, result2) => {
        if (err2) {
          res.status(500).send(err2);
        } else {
          const result = [result1, result2];
          res.status(201).send(result);
        }
      });
    }
  });
};

// Update an existing employee
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const employee = req.body;
  let contact = {
    primary_name: employee.primary_name,
    primary_phone: employee.primary_phone,
    primary_relationship: employee.primary_relationship,
    secondary_name: employee.secondary_name,
    secondary_phone: employee.secondary_phone,
    secondary_relationship: employee.secondary_relationship,
  };
  // remove contact details from employee object
  let contact_keys = Object.keys(contact);
  contact_keys.forEach((key) => delete employee[key]);

  // update the employee in the employees table
  db.query(
    "UPDATE employees SET ? WHERE id = ?",
    [employee, id],
    (err1, result1) => {
      if (err1) {
        res.status(500).send(err1);
      } else {
        // update the employee's contact details in the contacts table
        db.query(
          "UPDATE contacts SET ? WHERE employee_id = ?",
          [contact, id],
          (err2, result2) => {
            if (err2) {
              res.status(500).send(err2);
            } else {
              const result = [result1, result2];
              res.status(200).send(result);
            }
          }
        );
      }
    }
  );
};

// Delete an existing employee
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
};

export {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
