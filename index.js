import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "College",
  password: "abcd",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/admin", (req, res) => {
  res.render("admin.ejs");
});
let incorrect = "Wrong password";
let user;
let role;
let pass;
let check;
let username
app.post("/login", async (req, res) => {
    role = req.body.role;
  user = req.body.user;
  pass = req.body.password;
  if (role === "student") {
    check = await db.query("SELECT * FROM student WHERE name = $1", [
      user,
    ]);
    if (check.rows.length > 0) {
        // console.log(check.rows.length);
      username = check.rows[0];
      const password = username.password;
      if (pass === password) {
        res.render("student.ejs", {
          user: user,
        });
      }else{
        res.render("index.ejs",{
            incorrect : incorrect,
        });
    }
    }else{
        incorrect = "Wrong username";
        res.render("index.ejs",{incorrect : incorrect});
    }
  }

  if (role === "faculty") {
    check = await db.query("SELECT * FROM faculty WHERE name = $1", [
      user,
    ]);
    if (check.rows.length > 0) {
        // console.log(check.rows.length);
      username = check.rows[0];
      const password = username.password;
      if (pass === password) {
        res.render("faculty.ejs", {
          user: user,
        });
      }else{
        res.render("index.ejs",{
            incorrect : incorrect,
        });
    }
    }else{
        incorrect = "Wrong username";
        res.render("index.ejs",{incorrect : incorrect});
    }
  }
  if (role === "admin") {
    check = await db.query("SELECT * FROM admin WHERE name = $1", [
      user,
    ]);
    if (check.rows.length > 0) {
        // console.log(check.rows.length);
      username = check.rows[0];
      const password = username.password;
      if (pass === password) {
        res.render("admin.ejs", {
          user: user,
        });
      }else{
        res.render("index.ejs",{
            incorrect : incorrect,
        });
    }
    }else{
        incorrect = "Wrong username";
        res.render("index.ejs",{incorrect : incorrect});
    }
  }
});

app.post("/student",(req,res)=>{
    res.render("student.ejs",{
        check : check,
    });
});
app.post("/editstudent",(req,res)=>{
    res.render("editstudent.ejs");
});
app.post("/editfaculty",(req,res)=>{
    res.render("editfaculty.ejs");
});
app.post("/studentdetails",async (req,res)=>{
    const result = await db.query("SELECT * FROM student WHERE department_id = $1",[check.rows[0].department_id]);
    // console.log(result.rows);
    res.render("faculty.ejs",{
        // check:check,
        result : result,
    });
});
app.post("/adminstudent",async (req,res)=>{
    const result = await db.query("SELECT name,department,attendance FROM student");
    // console.log(result.rows);
    res.render("admin.ejs",{
        // check:check,
        result : result,
    });
});
app.post("/studentadd",async (req,res)=>{
    const name = req.body.name;
    const department = req.body.department;
    const department_id = req.body.department_id;
    const grade = req.body.grade;
    const attendance = req.body.attendance;
    const password = req.body.password;
    await db.query("INSERT INTO student(name,password,department_id,grade,attendance,department) VALUES ($1,$2,$3,$4,$5,$6)",[
      name,password,department_id,grade,attendance,department,
    ]);
    res.render("admin.ejs");
});
app.post("/facultyadd",async (req,res)=>{
    const name = req.body.name;
    const department = req.body.department;
    const department_id = req.body.department_id;
    const phone = req.body.phone;
    const password = req.body.password;
    await db.query("INSERT INTO faculty(name,phone,department_id,password,department) VALUES ($1,$2,$3,$4,$5)",[
      name,phone,department_id,password,department,
    ]);
    res.render("admin.ejs");
});
app.post("/deletest",async (req,res)=>{
  const name  = req.body.name;
  await db.query("DELETE FROM student WHERE name = $1",[name,]);
  res.render("admin.ejs");
});
app.post("/deleteF",async (req,res)=>{
  const name  = req.body.name;
  await db.query("DELETE FROM faculty WHERE name = $1",[name,]);
  res.render("admin.ejs");
});
app.post("/facultydetails",async (req,res)=>{
    const result = await db.query("SELECT name,department,phone FROM faculty");
    // console.log(result.rows);
    res.render("admin.ejs",{
        // check:check,
        result2 : result,
    });
});


app.post("/faculty",(req,res)=>{
    res.render("faculty.ejs",{
        check : check,
    });
});

app.post("/grade",(req,res)=>{
    res.render("student.ejs",{
        grade : check,
    });
});
app.post("/contact",async (req,res)=>{
    const result = await db.query("SELECT name,phone from faculty");
    // console.log(result.rows);
    res.render("student.ejs",{
        result : result,
    });
});

app.listen(port, () => {
  console.log(`running at ${port}`);
});
