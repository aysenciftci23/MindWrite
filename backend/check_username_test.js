const http = require('http');

const checkUsername = (username) => {
    const url = `http://localhost:3000/auth/check-username?username=${encodeURIComponent(username)}`;
    console.log(`Checking: ${url}`);

    http.get(url, (res) => {
        let data = '';

        console.log(`Status Code: ${res.statusCode}`);

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`Response: ${data}`);
        });
    }).on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });
};

checkUsername('testuser');
checkUsername('randomuser_' + Date.now());
