const mongoose = require("mongoose");

exports.connectDB = (uri) => {
    mongoose
        .connect(uri, {
        dbName: "futuradb",
    })
        .then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};