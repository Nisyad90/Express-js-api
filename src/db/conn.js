const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO,{
}).then(() => {
    console.log("done done")
}).catch(() => {
    console.log("no done")
})