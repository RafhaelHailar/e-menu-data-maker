const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.static("./public"));

app.listen(PORT, err => {
    if (err) return console.log(err);

    console.log("http://localhost:" + PORT);
});
