const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { errorMiddleware } = require("./middlewares/error");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

const userRoutes = require("./routes/user");
const companyRoutes = require("./routes/company");
const leadRoutes = require("./routes/lead");

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/lead', leadRoutes);

app.use(errorMiddleware);

module.exports = app;