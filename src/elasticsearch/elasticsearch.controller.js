const { Client } = require('@elastic/elasticsearch');
const client = new Client({
	cloud: { id: process.env.ES_CLOUD_ID },
	auth: { apiKey: process.env.ES_API_KEY },
});

const index = 'es';
module.exports.add = async (req, res, next) => {
	try {
		const document = {
			character: req.body.character ?? 'Ned Stark',
			quote: req.body.quote ?? 'Winter is coming.',
			order: Math.floor(Math.random() * 3) + 1,
		};
		const result = await client.index({
			index,
			document,
		});
		res.send(result);
	} catch (err) {
		return next(err);
	}
};

module.exports.update = async (req, res, next) => {
	try {
		// search and limit only 1 data
		const data = await client.search({
			index,
			query: {
				match: { character: 'Ned Stark' },
			},
			from: 0,
			size: 1,
			sort: [{ order: 'asc' }],
		});

		let result;
		if (data.hits.hits.length > 0) {
			// update
			result = await client.update({
				index,
				id: data.hits.hits[0]._id,
				doc: {
					quote: 'Updated.',
				},
			});
		}
		res.send(result);
	} catch (err) {
		return next(err);
	}
};

module.exports.delete = async (req, res, next) => {
	try {
		const result = await client.deleteByQuery({
			index,
			query: {
				match: { quote: 'Updated.' },
			},
		});
		res.send(result);
	} catch (err) {
		return next(err);
	}
};

module.exports.search = async (req, res, next) => {
	try {
		const searchText = req.query.search ?? '';
		const result = await client.search({
			index,
			query: {
				bool: {
					must: [
						{ match: { quote: { query: searchText, fuzziness: 'auto' } } },
						{ range: { order: { gte: 1, lte: 3 } } },
					],
				},
			},
		});
		res.send(result);
	} catch (err) {
		return next(err);
	}
};

/**
 * Other sample that might helpful
 */

/* Create new field
	await client.updateByQuery({
		index,
		script: {
			source: 'ctx._source.order = Math.floor(Math.random() * 3) + 1',
			lang: 'painless',
		},
	});
*/
/* Update mapping
	await client.indices.putMapping({
		index,
		properties: {
			order: { type: 'keyword' },
		},
	});
*/
