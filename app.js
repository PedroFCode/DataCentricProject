
//import modules
const database = require("./database")
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');


const port = 3000;
const app = express();

//connection to mongodb
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/employeesDB');
}

//mongoose schema
const employeeSchema = new mongoose.Schema({
    _id: String,
    phone: String,
    email: String
});

//Model for all employees
const employeeModel = mongoose.model('employees', employeeSchema)


//used in json output
app.set('json spaces', 2)
app.set('view engine', "ejs");

//Adds the body parser to the app
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Home page
app.get("/", (req, res) => {
    res.send(
        `
        <h1> Home Menu </h1>
        <a href="http://localhost:${port}/employees">Employees</a><br/>
        <a href="http://localhost:${port}/dept">Departments</a><br/>
        <a href="http://localhost:${port}/employeesMongoDB">Employees(MongoDB)</a>
        `
    )
})

//Getters
//Renders the showEmployees.ejs page
app.get("/employees", (req, res) => {
    database.getEmployees()
    .then((data) => {
        res.render("showEmployees", {"employees": data})

    })
    .catch((error) => {
        console.log("pool error " + error)
    })
})

//Renders updateEmployees.ejs with specified EID
app.get("/employees/update/:eid", (req, res) => {
    database.getEmployees()
        .then((employees) => {
            employees.forEach(employee => {
                if (req.params.eid == employee.eid) {
                    res.render("updateEmployee", { "employee": employee })
                }
            });

        })
        .catch((error) => {
            console.log("pool error " + error)
        })
})

//Updates employees with information entered
app.post("/employees/update/:eid", (req, res) => {
    database.updateEmployee(req.params.eid, req.body)
        .then((data) => {
            res.redirect("/employees")
        })
        .catch((error) => {
            res.send(error)
        })
})

//Renders the showDepartments.ejs page
app.get("/dept", (req, res) => {
    database.getDept()
    .then((data) => {
        res.render("showDepartments", {"departments": data})

    })
    .catch((error) => {
        console.log("pool error " + error)
    })
})

//used to delete a department specifed by the user
//Will not delete department with employees
app.get("/dept/delete/:did", (req, res) => {
    database.deleteDept(req.params.did)
        .then((data) => {
            res.redirect("/dept")
        })
        .catch((error) => {
            console.log(error)
            res.send(`
        <h1>${req.params.did} has employees and cannot be deleted</h1>
        <a href="http://localhost:3000/">Back</a>
        `)
        })
})

//renders the showEmployeesMongo page
app.get("/employeesMongoDB", (req, res) => {
    employeeModel.find((error, employees) => {
        res.render("showEmployeesMongo", { "employees": employees })
    })
});

//Renders the addEmployees.ejs page
app.get("/employeesMongoDB/add", (req, res) => {
    res.render("addEmployee")
})

//Adds an employee to mongo database
//Will only add existing employees in mysql
//Will not allow you to add an employee that was already added
app.post("/employeesMongoDB/add", (req, res) => {
    var isEmployeeFound = false;
    database.getEmployees()
        .then((employees) => {

            employees.forEach(employee => {
                if (req.body._id == employee.eid) {
                    console.log(employee)
                    isEmployeeFound = true;
                    console.log(isEmployeeFound);
                }
            })
            if (isEmployeeFound == false) {
                res.send(`
                    <h1>Error Message</h1>
                    <br/>
                    <h2>EID ${req.body._id} doesnt exist in MySQL Database</h2>
                    <a href="http://localhost:${port}/">Back</a>
                    `)
                return;
            }
            var employee = new employeeModel(req.body);
            employee.save((error, result) => {
                if (error) {
                    res.send(`
                        <h1>Error Message</h1>
                        <br/>
                        <h2>ID ${req.body._id} already exists in MongoDB</h2>
                        <a href="http://localhost:${port}/">Back</a>
                        `)
                    return;
                }
                res.redirect("/employeesMongoDB")
            });
        })
        .catch((error) => {
            console.log("pool error " + error)
        })
})

//shows the port being used
app.listen(port, () => console.log(`Visit http://localhost:${port}`))
