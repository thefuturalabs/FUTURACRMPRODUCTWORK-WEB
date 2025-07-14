const {config} = require("dotenv");
const { connectDB } = require("./utils/features");
config({
    path:'./.env'
});

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
connectDB(mongoURI);
const app = require("./app");


app.listen(port, ()=>{

    console.log(`Server is running on port ${port}`);
    
});