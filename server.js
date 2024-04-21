
const express = require('express');
const oracledb = require('oracledb');
const env = require('dotenv').config();

async function runApp() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTIONSTRING
        });
        console.log("Successfully connected to Oracle Database");

        // Create a table
        await connection.execute(`begin execute immediate 'drop table todoitem'; exception when others then if sqlcode <> -942 then raise; end if; end;`);
        await connection.execute(`create table todoitem ( id number generated always as identity, description varchar2(4000), creation_ts timestamp with time zone default current_timestamp, done number(1,0), primary key (id))`);


        // Now query the rows back
        result = await connection.execute(sql);
        const rs = result.resultSet; let row;
        while ((row = await rs.getRow())) {
            if (row.DONE)
                console.log(row.DESCRIPTION, "is done");
            else
                console.log(row.DESCRIPTION, "is NOT done");
        }
        await rs.close();
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
runApp();

const app = express();

app.get('/', (req, res) => {
    // runApp();
    res.send('Hello World');
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});


