// index.js
const mongoose = require('mongoose')
const app = require('./src/app');
const port = 3000;


const url = 'mongodb+srv://manojnandanwar:Thescorpionking3@mf-db.2kzvcgu.mongodb.net/?retryWrites=true&w=majority&appName=mf-db'; // Replace with your MongoDB URL
const dbName = 'mf-db';  // Replace with your database name Mutual-fund database

const PORT = process.env.PORT || 5000;

async function main() {

  try {
    await mongoose.connect(url);
   
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
  } 
}
main().catch(console.error);
module.exports = app;