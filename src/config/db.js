const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        const mongoURI =
            process.env.NODE_ENV === "test"
                ? process.env.MONGO_TEST_URI
                : process.env.MONGO_URI;


        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(error, 'mongodb connection failed..');
    }

};

module.exports = connectDB;


