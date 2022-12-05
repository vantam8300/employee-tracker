INSERT INTO department (name) 
VALUES ("IT"), ("HR");

INSERT INTO role (title, salary, department_id) 
VALUES ("Engineer", 100000, 1),
("Intern", 50000, 1),
("Recruiter", 70000, 2);


INSERT INTO employee (first_name, last_name, role_id) 
VALUES ("John", "Doe", 2),
("Mike", "Chan", 1),
("Ashley", "Rodriguez", 3);
