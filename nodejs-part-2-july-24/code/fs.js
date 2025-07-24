const fs = require('fs').promises;
const path = require('path');
const joinedPath = path.join(__dirname, 'output.txt');

// fs.writeFileSync(
//     joinedPath,
//     'Hello, this is a test file created by server.js!',
//     'utf8'
// );

// fs.unlinkSync(
//   path.join(__dirname, 'output.txt')
// );

// fs.readFile(joinedPath, 'utf8', (err, data) => {
//   if (err) {
//     console.error(`Error reading file: ${err.message}`);
//     return;
//   }
//   console.log(`File content: ${data}`);
// });

function main() {
    try {
         console.log(1);
        fs.readFile(joinedPath, 'utf8')
            .then(data => {
                console.log(`File content: ${data}`);
            })
            .catch(err => {
                console.error(`Error reading file: ${err.message}`);
            });
        console.log(2);
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
    }
}

main();