
const express = require('express');
const oracledb = require('oracledb');
const env = require('dotenv').config();

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

console.log("Starting...");
connectAndQuery();

async function connectAndQuery() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(`SELECT * FROM TASKS;`);

        console.log(`${resultSet.recordset.length} rows returned.`);

        console.log(resultSet.recordset);

        // close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

const app = express();

app.get('/', (req, res) => {
    // runApp();
    res.send('Hello World');
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});


