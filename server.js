
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

    console.log(boardName);
    console.log(boardDescription);
    console.log(creator);

    const result = await utils.createBoard(boardName, boardDescription, creator);
    if (result) {
        res.send("Board created successfully");
    }
    else {
        res.send("Error creating board");
    }

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


    
    






app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});


