const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)

        console.log(`Mongodb Connected Successfully ${conn.connection.host}`.bgCyan.white);

    }
    catch(error) {
        console.log(`Error in ${error.message}`);
        process.exit(1);
    }
}

module.exports =  connectDB;