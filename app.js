const express = require('express');

app = express();
app.listen(80);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}\\index.html`);
})