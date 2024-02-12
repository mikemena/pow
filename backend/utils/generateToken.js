const fs = require('fs');
const jwt = require('jsonwebtoken');

const userPayload = {
  id: 2, // Example user ID, adjust as needed
  username: 'tokyo' // Example username, adjust as needed
};

const secretKey = 'CKM23%red%2024'; // Use your actual secret key here

const token = jwt.sign(userPayload, secretKey, { expiresIn: '5h' }); // Token expires in 5 hour

fs.writeFileSync('token.txt', token, err => {
  if (err) {
    console.error('Error writing token to file:', err);
    return;
  }
  console.log('Token has been saved to token.txt');
});

console.log(token);
