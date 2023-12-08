const express = require('express');

const app = express();

const router = require('./router');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 8080;
app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

app.listen(port, (req, res) => {
  console.log(`Running on ${port}`);
});
