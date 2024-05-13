
const express = require('express');
const oracledb = require('oracledb');
const env = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');



const sql = require('mssql');

const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: 'boardbusters.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'Database-IP', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
};

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


async function checkLogin(username, password) {
    try {
        var poolConnection = await sql.connect(config);

        var resultSet = await poolConnection.request().query(`SELECT * FROM USERS WHERE NAME = '${username}' AND PASSWORD = '${password}';`);

        console.log(`${resultSet.recordset.length} rows returned.`);

        console.log(resultSet.recordset);

        // close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

async function registerUser(username, password, email, position) {
    try {
        var poolConnection = await sql.connect(config);

        // check if username already exists
        var resultSet = await poolConnection.request().query(`SELECT * FROM USERS WHERE NAME = '${username}';`);
        if (resultSet.recordset.length > 0) {
            console.log("Username already exists");
            return false;
        }

        // insert new user
        await poolConnection.request().query(`INSERT INTO USERS (NAME, PASSWORD, EMAIL, POSITION) VALUES 
                                            ('${username}', '${password}', '${email}', '${position}');`);
        
        console.log("User registered successfully");

        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }

    return true;
}

async function createBoard(boardName, boardDescription, creator) {
    try {
        var poolConnection = await sql.connect(config);

        // check if board already exists
        var resultSet = await poolConnection.request().query(`SELECT * FROM BOARDS WHERE NAME = '${boardName}';`);
        if (resultSet.recordset.length > 0) {
            console.log("Board already exists");
            return false;
        }

        // insert new board
        await poolConnection.request().query(`INSERT INTO BOARDS (NAME, DESCRIPTION, CREATOR) VALUES 
                                            ('${boardName}', '${boardDescription}', '${creator}');`);
        
        console.log("Board created successfully");

        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }

    return true;
}

async function getBoards() {
    try {
        var poolConnection = await sql.connect(config);

        var resultSet = await poolConnection.request().query(`SELECT * FROM BOARDS;`);

        console.log(`${resultSet.recordset.length} rows returned.`);

        console.log(resultSet.recordset);

        poolConnection.close();

        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
    }

    return [];
}

app.post('/api/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password

    console.log(username);
    console.log(password);

    await checkLogin(username, password);

});

app.post('/api/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password
    const email = req.body.email;
    const position = req.body.position;

    console.log(username);
    console.log(password);
    console.log(email);
    console.log(position);

    const result = await registerUser(username, password, email, position);
    if (result) {
        res.send("User registered successfully");
    }
    else {
        res.send("Error registering user");
    }

});

app.post('/api/createBoard', async (req, res) => {
    const boardName = req.body.boardName;
    const boardDescription = req.body.boardDescription;
    const creator = req.body.creator;

    console.log(boardName);
    console.log(boardDescription);
    console.log(creator);

    const result = await createBoard(boardName, boardDescription, creator);
    if (result) {
        res.send("Board created successfully");
    }
    else {
        res.send("Error creating board");
    }

});

app.get('/api/getBoards', async (req, res) => {
    
    const boards = await getBoards();
    res.send(boards);

});


    
    






app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});


