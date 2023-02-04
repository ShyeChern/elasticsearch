require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./src/routes'));
// error middleware
app.use((err, req, res, next) => {
	res.status(500).send(err);
});
app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
