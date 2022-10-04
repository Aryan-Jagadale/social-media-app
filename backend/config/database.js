const mongoose  = require('mongoose')




exports.connectDataBase = () => {
    mongoose.connect(process.env.MONGO_URI).then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
}
