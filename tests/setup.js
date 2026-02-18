// const mongoose = require('mongoose');
// const connectDB = require('../src/config/db');

// beforeAll(async () => {
//         await connectDB();
//     });

//     // afterEach(async () => {
//     //     if (mongoose.connection.readyState === 1) {
//     //         await mongoose.connection.db.collection("users").deleteMany({});
//     //     }
//     // });

//     afterAll(async () => {
//         await mongoose.connection.close();
//     });