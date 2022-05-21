const mysql = require('mysql2');
const inquirer = require('inquirer');
const Table = require('cli-table');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'arzu1234',
  database: 'playlist_db'
});

inquirer.prompt([
    {
        type: 'list',
        name: 'command',
        message: 'What would you like to do?',
        choices: [
            "Add a song",
            "List the songs"
            ]
    }])
    .then(answers => {
        switch(answers.command) {
            case "Add a song":
                inquirer.prompt([{
                    type: 'input',
                    name: "name",
                    message: "What is the name of the track?",
                    default: "Track",
                },
                {
                    type: 'input',
                    name: "artist",
                    message: "What is the name of the artist?",
                    default: "Artist",

                },
                {
                    type: 'input',
                    name: "genre",
                    message: "What is the genre?",
                    default: "Unknown",
                }
                ]).then(answers => {
                    const name = answers.name.trim().toLowerCase();
                    const artist = answers.artist.trim().toLowerCase();
                    const genre = answers.genre.trim().toLowerCase();
                    pool.query(`INSERT INTO tracks (title, artist, genre) VALUES ("${name}", "${artist}", "${genre}")`, function(err, rows, fields) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Track added!");
                        }
                    })
                });
                break;
            case "List the songs":
                pool.query("select * from tracks", function(err, rows, fields) {
                    if(!err) {
                        const table = new Table({
                            head: Object.keys(rows[0]),
                            colWidths: [20, 20, 20, 20]
                        });

                        rows.forEach(row => {
                            table.push(Object.values(row));
                        })
                        console.log(table.toString());
                    } else {
                        console.log("Something went wrong: " + err);
                    }
                });
                break;

        }
   });