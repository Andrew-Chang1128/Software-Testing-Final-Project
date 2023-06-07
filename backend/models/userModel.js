const jwt = require("jsonwebtoken")

mysql = require('mysql2');
module.exports = class {
    constructor(){
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'test',
            password: 'password',
            database: 'STproject',
        });
    };
    close(){
      this.connection.end((error) => {
        if (error) {
          console.error('Error disconnecting from MySQL:', error);
          return;
        }
        console.log('Disconnected from MySQL server');
      });
    }
  
    createUser(username, password){
        console.log("inserting w ", username, password);
        const query = 'INSERT INTO users (name, password) VALUES (?, ?)';
        return new Promise((resolve, reject) => {
          this.connection.query(query, [username, password], (err, result) => {
            if (err) {
                console.error('Error inserting user information:', err);
                reject("Error creating user into  the database!");
            }else{
                resolve(true);
            }
          });
        })
    };
    login(username, password){
        console.log("fetching result with: ",username);
        const query = 'SELECT * FROM users WHERE name = ?';
        return new Promise((resolve, reject) => {
            this.connection.query(query, [username], (err, results) => {
              if (err) {
                console.error('Error fetching user from the database:', err);
                reject("Error fetching user from the database!");
              } else {
                const returnPwd = results[0].password;
                console.log("fetched pwd: ", returnPwd);
                if (returnPwd == password) {
                  const user = { user: username };
                  const jwtToken = jwt.sign(user, process.env.tokenSecret);
                  resolve(jwtToken);
                } else {
                  resolve(false);
                }
              }
            });
    });
    };
    checkUserExist(username, password){
      
      const query = 'SELECT * FROM users WHERE name = ?';
      return new Promise((resolve, reject) => {
          this.connection.query(query, [username], (err, results) => {
            if (err) {
              console.error('Error fetching user from the database:', err);
              reject("Error fetching user from the database!");
            } else {
              console.log(results)
              if (results.length != 0){
                resolve(true)
                
              }else{
                resolve(false);
              }
              // const returnPwd = results[0].password;
              // console.log("fetched pwd: ", returnPwd);
              // if (returnPwd == password) {
              //   const user = { user: username };
              //   const jwtToken = jwt.sign(user, process.env.tokenSecret);
              //   resolve(jwtToken);
              // } else {
              //   resolve(false);
              // }
            }
          });
      });
  };
}