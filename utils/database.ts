import mysql from "mysql"
import dotenv from "dotenv";

dotenv.config()

export const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST ,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: 'passpark'
});

export const connectDb = () =>{
    connection.connect((err) => {
        if (err) {
          console.error('Error connecting to database: ' + err.stack);
          return;
        }
        console.log('Connected to database as id ' + connection.threadId);
      });
      
}