
const express = require("express");
require("../src/db/conn")
const MensRanking = require("../src/models/test")
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerOptions');
const app = express();
const port = process.env.PORT;
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const router = require("../src/routers/route")
const bodyParser = require('body-parser');

app.use('/mans',router)
app.listen(port, () => {
    console.log(`is live. ${port}`);
    app.use(bodyParser.json());

} )