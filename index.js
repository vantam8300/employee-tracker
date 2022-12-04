const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

const generalQuestions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add A Department",
            "Add A Role",
            "Add an Employee",
            "Update an Employee Role",
            "Quit",
        ]
    }
]
var db = mysql.createConnection({
    host: "localhost",
    // Your username
    user: "root",
    // Your password
    password: "",
    database: "employee_db"
});

db.connect(function (err) {
    if (err) {
        throw err
    } else {
        startApp();
    }
});

//Function that starts the app and prompt the questions
function startApp() {
    inquirer
        .prompt(generalQuestions)
        .then(function (answer) {
            switch (answer.action) {
                case "View All Departments":
                    viewDepartments();
                    break;


                case "EXIT":
                    console.log("Thanks for using Employee Tracker! Have a nice day!")
                    process.exit();
            }
        });
}

function viewDepartments() {
    db.execute('SELECT * FROM department', (err, results) => {
        console.table(results);
        startApp()
    });
}
