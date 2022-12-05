const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

const initalquestions = [
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
            "Add An Employee",
            "Update An Employee Role",
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
        .prompt(initalquestions)
        .then(function (answer) {
            switch (answer.action) {
                case "View All Departments":
                    viewDepartments();
                    break;

                case "View All Roles":
                    viewRoles()
                    break;

                case "View All Employees":
                    viewEmployees()
                    break;

                case "Add A Department":
                    addDepartment()
                    break;

                case "Add A Role":
                    addRole()
                    break;

                case "Add An Employee":
                    addEmployee()
                    break;

                case "Update An Employee Role":
                    updateRole();
                    break;

                case "Quit":
                    process.exit();
            }
        });
}

function viewDepartments() {
    // execute sql statemaent
    db.execute('SELECT id as department_id, name as department_name FROM department', (err, results) => {
        console.table(results);

        // Start intial Questions Again
        startApp()
    });
}

function viewRoles() {
    // execute sql statemaent
    db.execute(`SELECT role.id as role_id, role.title as title, role.salary as salary, department.name as department
                FROM role LEFT JOIN department ON role.department_id = department.id`, (err, results) => {
        console.table(results);

        // Start intial Questions Again
        startApp()
    });
}

function viewEmployees() {
    // execute sql statemaent
    db.execute(`SELECT employee.id as employee_id, employee.first_name , employee.last_name, role.title, role.salary, department.name as department, CONCAT(manager.first_name,' ', manager.last_name) as manager
                FROM employee JOIN role ON employee.role_id = role.id LEFT JOIN employee manager ON manager.id = employee.manager_id LEFT JOIN department ON role.department_id = department.id`, (err, results) => {
        console.table(results);

        // Start intial Questions Again
        startApp()
    });
}

function addDepartment() {
    inquirer.prompt(
        {
            type: "input",
            name: "departmentName",
            message: "What is the name of the department?",
        }
    ).then(answer => {
        // insert department into database
        db.execute("INSERT INTO department (name) VALUES (?)", [answer.departmentName]);
        console.log(`Added ${answer.departmentName} to the database`);
        // Start intial Questions Again
        startApp();
    })
}

function addRole() {
    db.execute('SELECT * FROM department', (err, results) => {
        inquirer.prompt([
            {
                type: "input",
                name: "role",
                message: "What is the name of the role?",
            },
            {
                type: "number",
                name: "salary",
                message: "What is the salary of the role?",
            },
            {
                type: "list",
                name: "departmentName",
                message: "Which departmnet does the role belong to?",
                choices: results,
            },
        ]).then(answer => {

            // find department id match with chosen department name 
            let departmentId;
            for (let i = 0; i < results.length; i++) {
                console.log(results[i].name, answer.departmentName)
                if (results[i].name == answer.departmentName) {
                    departmentId = results[i].id;
                }
            }

            // insert role into database
            db.execute("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.role, answer.salary, departmentId]);
            console.log(`Added ${answer.role} to the database`)
            // Start intial Questions Again
            startApp();
        })
    });

}


function addEmployee() {
    db.execute('SELECT * FROM role', (err, roleResults) => {
        // list role title
        let roles = [];
        for (role of roleResults) {
            roles.push(role.title);
        }

        db.execute('SELECT * FROM employee', (err, employeeResults) => {
            // list employee name
            let employees = ["None"];
            for (employee of employeeResults) {
                employees.push(employee.first_name + " " + employee.last_name);
            }
            inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the employee's first name?",
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the employee's last name?",
                },
                {
                    type: "list",
                    name: "roleTitle",
                    message: "What is the employee's role?",
                    choices: roles,
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: employees,
                },
            ]).then(answer => {

                // find role id match with chosen role title 
                let roleId;
                for (let i = 0; i < roleResults.length; i++) {
                    if (roleResults[i].title == answer.roleTitle) {
                        roleId = roleResults[i].id;
                    }
                }

                // find manager id match with chosen manager name
                let managerId;
                let fullName;
                for (let i = 0; i < employeeResults.length; i++) {
                    fullName = employeeResults[i].first_name + " " + employeeResults[i].last_name;
                    if (fullName == answer.manager) {
                        managerId = employeeResults[i].id;
                        break;
                    }
                }

                // if user chose "none" for manager' name set manager id to null
                if (!managerId) {
                    managerId = null;
                }



                // insert employee into database
                db.execute(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                    [answer.firstName, answer.lastName, roleId, managerId]);
                console.log(`Added ${fullName} to the database`)
                // Start intial Questions Again
                startApp();
            })
        });

    });

}

function updateRole() {
    db.execute('SELECT * FROM role', (err, roleResults) => {
        // list role title
        let roles = [];
        for (role of roleResults) {
            roles.push(role.title);
        }

        db.execute('SELECT * FROM employee', (err, employeeResults) => {
            // list employee name
            let employees = [];
            for (employee of employeeResults) {
                employees.push(employee.first_name + " " + employee.last_name);
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Which employee's roke do you want to update?",
                    choices: employees,
                },
                {
                    type: "list",
                    name: "assignedRole",
                    message: "Which role do you want to assign the selected employee?",
                    choices: roles,
                }
            ]).then(answer => {

                // find role id match with chosen role title 
                let roleId;
                for (let i = 0; i < roleResults.length; i++) {
                    if (roleResults[i].title == answer.assignedRole) {
                        roleId = roleResults[i].id;
                    }
                }

                // find employee id match with chosen employee name 
                let employeeId;
                for (let i = 0; i < employeeResults.length; i++) {
                    fullName = employeeResults[i].first_name + " " + employeeResults[i].last_name;
                    if (fullName == answer.employee) {
                        employeeId = employeeResults[i].id;
                        break;
                    }
                }
                // update employee's role
                db.execute("UPDATE employee SET role_id = ? where id = ?", [roleId, employeeId]);
                console.log("Updated employee's role");
                // Start intial Questions Again
                startApp();
            });
        })
    })

}
