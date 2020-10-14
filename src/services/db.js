const mongoose = require('mongoose');

try {
    if (process.env.NODE_ENV =='production') {
        mongoose.connect('mongodb://evaristo_dp:universus909@cluster0-shard-00-00.uyvvp.mongodb.net:27017,cluster0-shard-00-01.uyvvp.mongodb.net:27017,cluster0-shard-00-02.uyvvp.mongodb.net:27017/sequeleBusiness001?ssl=true&replicaSet=atlas-14cmu3-shard-0&authSource=admin&retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } else {
        mongoose.connect('mongodb://localhost/sequelebussinessApp', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    }
    console.log('Database connecting successfully')
} catch (err) {
    console.log('Database failed: ', err)
}

module.exports = mongoose;