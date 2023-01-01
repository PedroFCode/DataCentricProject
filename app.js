
//import modules
const database = require("./database")
const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

//used for indentation in json output
app.set('json spaces', 2)
app.set('view engine', "ejs");

// Add the body parser to the app
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//GETTERS
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


app.get("/employees", (req, res) => {
    database.getEmployees()
    .then((data) => {
        res.render("showEmployees", {"employees": data})

    })
    .catch((error) => {
        console.log("pool error " + error)
    })
})

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

app.post("/employees/update/:eid", (req, res) => {
    database.updateEmployee(req.params.eid, req.body)
        .then((data) => {
            res.redirect("/employees")
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get("/dept", (req, res) => {
    database.getDept()
    .then((data) => {
        res.render("showDepartments", {"departments": data})

    })
    .catch((error) => {
        console.log("pool error " + error)
    })
})

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

app.listen(port, () => console.log(`Visit http://localhost:${port}`))
