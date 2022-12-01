const inquirer = require("inquirer");
const mysql = require('mysql2');

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
            "quit",
        ]
    }
]

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employee_db'
    },
    console.log(`Connected to the classlist_db database.`)
  );
  
  // Query database
  db.query('SELECT * FROM students', function (err, results) {
    console.log(results);
  });


const app = async () => {
    let action = "";
    while (action != "Quit") {
        await inquirer.prompt(generalQuestions).then(answer => {
            action = answer.action;
            console.log(action)
            if (action === "View All Departments") {
                viewDepartments();
            }
        });
    }

}

module.exports = app;