
const express = require('express');
const oracledb = require('oracledb');
const env = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');


const utils = require('./utils/server-utils.js');


// console.log("Starting...");
// connectAndQuery();

// async function connectAndQuery() {
//     try {
//         var poolConnection = await sql.connect(config);

//         console.log("Reading rows from the Table...");
//         var resultSet = await poolConnection.request().query(`SELECT * FROM TASKS;`);

//         console.log(`${resultSet.recordset.length} rows returned.`);

//         console.log(resultSet.recordset);

//         // close connection only when we're certain application is finished
//         poolConnection.close();
//     } catch (err) {
//         console.error(err.message);
//     }
// }

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    // runApp();
    res.send('Hello World');
});

app.post('/api/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password

    console.log(username);
    console.log(password);

    const result = await utils.loginUser(username, password);

    res.send(result);
});

app.post('/api/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password
    const email = req.body.email;
    const position = req.body.position;

    console.log("Attempting to register: username: " + username + ", password: " + password + ", email: " + email + ", position: " + position);

    const result = await utils.registerUser(username, password, email, position);
    
    res.send(result);
});

app.post('/api/createBoard', async (req, res) => {
    const boardName = req.body.boardName;
    const boardDescription = req.body.boardDescription;
    const creator = req.body.creator;
    const boardsUsers = req.body.boardsUsers;

    console.log(boardName);
    console.log(boardDescription);
    console.log(creator);
    console.log(boardsUsers);

    const result = await utils.createBoard(boardName, boardDescription, creator, boardsUsers);
    
    res.send(result);

});

app.post('/api/getBoards', async (req, res) => {
    
    const userId = req.body.userId;

    console.log(userId);

    const boards = await utils.getBoards(userId);
    res.send(boards);

});

app.post('/api/getTasks', async (req, res) => {
        
    const boardId = req.body.boardId;

    console.log(boardId);

    const tasks = await utils.getTasks(boardId);
    res.send(tasks);
    
    });

app.post('/api/getUsers', async (req, res) => {
    
    const tasks = await utils.getUsers();
    res.send(tasks);
    
    });


app.post('/api/createTask', async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const deadline = req.body.deadline;
    const assignedUser = req.body.assignedUser;
    const boardId = req.body.boardId;
    const creator = req.body.creator;

    console.log(title);
    console.log(description);
    console.log(deadline);
    console.log(assignedUser);
    console.log(boardId);
    console.log(creator);

    const result = await utils.createTask(title, creator, description, assignedUser, boardId, deadline);

    
    res.send(result);

});


    
    






app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});


