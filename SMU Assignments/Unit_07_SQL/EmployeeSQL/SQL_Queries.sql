-- Scripts to create departments, dept_emp, dept_manager, employees and salaries tables

-- Create employees table
create table employees (
	emp_no INT not null primary key,                            --PK
	emp_title_id VARCHAR(10) NULL,
	birth_date DATE NULL,
	first_name VARCHAR(30) null,
	last_name VARCHAR(30) null,
	sex VARCHAR(1) null,
	hire_date DATE null,
	last_updated TIMESTAMP NULL default CURRENT_TIMESTAMP
);

-- Create departments table
create table departments (
	dept_no VARCHAR(20) not null primary key,                   --PK
	dept_name VARCHAR(50) null,
	last_updated TIMESTAMP NULL default CURRENT_TIMESTAMP
);

-- Create dept_emp table
create table dept_emp (
	id serial primary key,                                      --PK                                      
	emp_no INT null references employees(emp_no),               --FK
	dept_no VARCHAR(20) null references departments(dept_no),   --FK
	last_updated TIMESTAMP NULL default CURRENT_TIMESTAMP
);

-- Create dept_manager table
create table dept_manager (
	id serial primary key,                                      --PK
	dept_no VARCHAR(20) null references departments(dept_no),   --FK
	emp_no INT null references employees(emp_no),               --FK
	last_updated TIMESTAMP NULL default CURRENT_TIMESTAMP
);

-- Create salaries table
create table salaries (
	id serial primary key,                                      --PK
	emp_no INT null references employees(emp_no),               --FK
	salary INT null,
	last_updated TIMESTAMP NULL default CURRENT_TIMESTAMP
);

-- Create titles table
create table titles (
	title_id VARCHAR(10) not null primary key,                  --PK
	title VARCHAR(50) null,
	last_updated TIMESTAMP NULL default CURRENT_TIMESTAMP
);

-- Added foreign key to employees table to reference titles(title_id)
alter table 
	employees
add constraint 
	constraint_fk 
foreign key 
	(emp_title_id) 
references 
	titles(title_id)

-- ****************************************************** Part two queries (Data Analysis) ******************************************************

-- 1.List employee number, last name, first name, sex and salary.
select
	e.emp_no,
	e.last_name,
	e.first_name,
	e.sex,
	s.salary 
from 
	employees e
	join salaries s on e.emp_no = s.emp_no

-- 2. List first name, last name, and hire date for employees hired in 1986.
select
	e.first_name,
	e.last_name,
	e.hire_date
from 
	employees e
where
	e.hire_date >= '1986-01-01' and e.hire_date <= '1986-12-31' 
order by 
	hire_date asc

-- 3. List manager department number, department name, manager employee number, last name and first name.
create view department_heads as
	select 
		dm.dept_no,
		e.emp_no,
		e.last_name,
		e.first_name 
	from 
		employees e 
		join dept_manager dm on e.emp_no = dm.emp_no
;		
select 
	dh.dept_no,
	d.dept_name,
	dh.emp_no,
	dh.last_name,
	dh.first_name
from
	department_heads dh
	join departments d on dh.dept_no = d.dept_no

-- 4. List department of each employee with employee number, last name, first name and department name.
create view department_emps AS
	select 
		de.dept_no,
		d.dept_name,
		de.emp_no 
	from 
		dept_emp de 
		join departments d on de.dept_no = d.dept_no
		
select 
	demp.emp_no,
	e.last_name,
	e.first_name,
    demp.dept_name
from 
	department_emps demp
	join employees e on demp.emp_no = e.emp_no 

-- 5. List first name, last name and sex for employees whos first name is "Hercules" and last names begin with "B".
select 
	first_name,
	last_name,
	sex
from 
	employees
where
	first_name = 'Hercules' and last_name like 'B%'

-- 6. List employees in Sales department, including their employee number, last name, first name, and department.
-- referenced previously created view department_emps
select 
	demp.emp_no,
	e.last_name,
	e.first_name,
    demp.dept_name
from 
	department_emps demp
	join employees e on demp.emp_no = e.emp_no
where 
	dept_name = 'Sales'

--7. List all employees in Sales and Development departments, including employee number, last name, first name, and department name.
-- referenced previously created view department_emps
select 
	demp.emp_no,
	e.last_name,
	e.first_name,
    demp.dept_name
from 
	department_emps demp
	join employees e on demp.emp_no = e.emp_no
where 
	dept_name in ('Sales','Development')

-- 8. List frequency count of employee last names in descending order.
select 
	last_name,
	count(last_name)
from 
	employees
group by
	last_name 
order by 
	last_name desc