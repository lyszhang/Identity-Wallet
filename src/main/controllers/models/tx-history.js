const isSyncing = require('../tx-history-service').isSyncing;

// TODO copy in utils when sql-util-refactor will be finished
let paginator = knex => {
	return async (query, options) => {
		const perPage = options.perPage || 10;
		let page = options.page || 1;

		const countQuery = knex.count('* as total').from(query.clone().as('inner'));

		if (page < 1) {
			page = 1;
		}
		const offset = (page - 1) * perPage;

		query.offset(offset);

		if (perPage > 0) {
			query.limit(perPage);
		}

		const [data, countRows] = await Promise.all([query, countQuery]);

		const total = countRows[0].total;

		return {
			data,
			pagination: {
				total,
				perPage,
				currentPage: page,
				lastPage: Math.ceil(total / perPage),
				from: offset,
				to: offset + data.length
			}
		};
	};
};

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'tx_history';
	const Controller = function() {};

	let knex = sqlLiteService.knex;

	/**
	 *
	 */
	Controller.addOrUpdate = _addOrUpdate;
	Controller.findByTxHash = _findByTxHash;
	Controller.findByPublicKey = _findByPublicKey;
	Controller.findByPublicKeyAndTokenSymbol = _findByPublicKeyAndTokenSymbol;
	Controller.findByPublicKeyAndContractAddress = _findByPublicKeyAndContractAddress;

	async function _addOrUpdate(txHistory) {
		let records = await _findByTxHash(txHistory.hash);
		let record = records ? records[0] : null;
		if (record) {
			Object.assign(record, txHistory);
			return sqlLiteService.updateById(TABLE_NAME, record);
		}
		return sqlLiteService.insertIntoTable(TABLE_NAME, txHistory);
	}

	function _findByTxHash(hash) {
		return knex(TABLE_NAME).where({ hash: hash });
	}

	async function _findByPublicKeyAndContractAddress(publicKey, contractAddress, pager) {
		publicKey = publicKey.toLowerCase();
		let query = knex(TABLE_NAME)
			.where({ from: publicKey, contractAddress })
			.orWhere({ to: publicKey, contractAddress })
			.orderBy('timeStamp', 'desc');

		return paginator(knex)(query, pager).then(res => {
			res.isSyncing = isSyncing(publicKey);
			return res;
		});
	}

	async function _findByPublicKey(publicKey, pager) {
		publicKey = publicKey.toLowerCase();
		let query = knex(TABLE_NAME)
			.where({ from: publicKey })
			.orWhere({ to: publicKey })
			.orderBy('timeStamp', 'desc');

		return paginator(knex)(query, pager).then(res => {
			res.isSyncing = isSyncing(publicKey);
			return res;
		});
	}

	async function _findByPublicKeyAndTokenSymbol(publicKey, tokenSymbol, pager) {
		publicKey = publicKey.toLowerCase();
		let query = knex(TABLE_NAME)
			.where({ from: publicKey, tokenSymbol })
			.orWhere({ to: publicKey, tokenSymbol })
			.orderBy('timeStamp', 'desc');

		return paginator(knex)(query, pager).then(res => {
			res.isSyncing = isSyncing(publicKey);
			return res;
		});
	}

	return Controller;
};
