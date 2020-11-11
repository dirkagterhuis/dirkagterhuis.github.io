var express = require('express');
var app = express();
var path = require('path');

const port = process.env.PORT || 3000;
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
});