

const env = require('dotenv').config();
const bcrypt = require('bcrypt');

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

module.exports = {

    loginUser: async function (username, password) {

        let userId = -1;

        try {
            var poolConnection = await sql.connect(config);

            var resultSet = await poolConnection.request().query(`SELECT USER_ID, PASSWORD FROM USERS WHERE NAME = '${username}';`);

            if (resultSet.recordset.length === 0) {
                console.log("Invalid username");
                return {
                    success: false,
                    message: "Invalid username or password"
                }
            }

            const dbpassword = resultSet.recordset[0].PASSWORD;
            userId = resultSet.recordset[0].USER_ID;

            const validPassword = await bcrypt.compare(password, dbpassword);

            if (!validPassword) {
                console.log("Invalid password");
                return {
                    success: false,
                    message: "Invalid username or password"
                }
            }

            // close connection only when we're certain application is finished
            poolConnection.close();
        } catch (err) {
            console.error(err.message);
            return {
                success: false,
                message: "Error logging in"
            }
        }

        console.log("User logged in successfully");
        return {
            success: true,
            message: "User logged in successfully",
            userId: userId
        }
    },

    registerUser: async function (username, password, email, position) {
        try {
            var poolConnection = await sql.connect(config);

            // check if username already exists
            var resultSet = await poolConnection.request().query(`SELECT * FROM USERS WHERE NAME = '${username}';`);
            if (resultSet.recordset.length > 0) {
                console.log("Username already exists");
                return {
                    success: false,
                    message: "Username already exists"
                }
            }

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // insert new user
            await poolConnection.request().query(`INSERT INTO USERS (NAME, PASSWORD, EMAIL, POSITION) VALUES 
                                                ('${username}', '${hashedPassword}', '${email}', '${position}');`);
            poolConnection.close();
            
        } catch (err) {
            console.error(err.message);
            return {
                success: false,
                message: "Error registering user"
            }
        }

        console.log("User registered successfully");
        return {
            success: true,
            message: "User registered successfully"
        }
    },

    createBoard: async function (boardName, boardDescription, creator) {
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
    },

    getBoards: async function (userId) {

        if (userId === undefined) {
            console.log("Invalid user id");
            return {
                success: false,
                message: "Invalid user id",
                boards : []
            }
        }

        try {
            var poolConnection = await sql.connect(config);

            // check if user id exists
            var resultSet = await poolConnection.request().query(`SELECT * FROM USERS WHERE USER_ID = ${userId};`);
            if (resultSet.recordset.length === 0) {
                console.log("Invalid user id");
                return {
                    success: false,
                    message: "Invalid user id",
                    boards : []
                }
            }

            var resultSet = await poolConnection.request().query(`SELECT * FROM BOARDS 
                                                                    WHERE BOARD_ID IN 
                                                                        (SELECT ID_BOARD FROM USER_TO_BOARD_MAPPING 
                                                                        WHERE ID_USER = ${userId});`);

            console.log(`${resultSet.recordset.length} rows returned.`);

            console.log(resultSet.recordset);

            poolConnection.close();

        } catch (err) {
            console.error(err.message);
            return {
                success: false,
                message: "Error getting boards",
                boards : []
            }
        }

        return {
            success: true,
            message: "Boards retrieved successfully",
            boards: resultSet.recordset
        }
    },

    getTasks: async function (boardId) {

        if (boardId === undefined || boardId <= 0) {
            console.log("Invalid board id");
            return {
                success: false,
                message: "Invalid board id",
                tasks : []
            }
        }

        try {
            var poolConnection = await sql.connect(config);

            var resultSet = await poolConnection.request().query(`SELECT * FROM TASKS WHERE PARENT_BOARD = ${boardId};`);

            console.log(`${resultSet.recordset.length} rows returned.`);

            console.log(resultSet.recordset);

            poolConnection.close();

        } catch (err) {
            console.error(err.message);
            return {
                success: false,
                message: "Error getting tasks",
                tasks : []
            }
        }

        return {
            success: true,
            message: "Tasks retrieved successfully",
            tasks: resultSet.recordset
        }
    },

}