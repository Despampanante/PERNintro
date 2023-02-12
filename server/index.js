const cors = require("cors");
const pool = require("./db");

var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/antisago.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/antisago.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/antisago.com/chain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate, ca: ca};

// your express configuration here
//


//middleware
var corsMiddleware = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', 'localhost'); //replace localhost with actual host
	res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
	next();
}
app.use(corsMiddleware);
app.use(express.json()); //req.body

//ROUTES//

//create a todo
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *", 
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
       console.error(err.message); 
    }
})

//get all todos
app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//get a todo 
app.get("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query(
            "SELECT * FROM todo WHERE todo_id = $1",
            [id]
        );
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//update a todo
app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
        );
        res.json("Todo was updated");
    } catch (err) {
        console.error(err.message);
    }
})

//delete a todo
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } =  req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was delted!");
    } catch (err) {
        console.log(err.message);
    }
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(5000);

