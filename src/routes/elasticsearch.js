const express = require('express');
const router = express.Router();
const elasticsearch = require('../elasticsearch/elasticsearch.controller');

router
	.route('/')
	.get(elasticsearch.search)
	.post(elasticsearch.add)
	.put(elasticsearch.update)
	.delete(elasticsearch.delete);

module.exports = router;
