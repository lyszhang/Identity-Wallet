const { knex, sqlUtil } = require('../services/knex');
const TABLE_NAME = 'wallet_settings';

module.exports = {
	create: (data, tx) => sqlUtil.insertAndSelect(TABLE_NAME, data, tx),

	findByWalletId: (walletId, tx) => sqlUtil.select(TABLE_NAME, '*', { walletId }, tx),

	updateById: (id, data, tx) => sqlUtil.updateById(TABLE_NAME, id, data, tx)
};

const { Model } = require('objection');
const BaseModel = require('./base');
const TABLE_NAME = 'wallet_settings';

class WalletSetting extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['walletId'],
			properties: {
				id: { type: 'integer' },
				walletId: { type: 'integer' },
				showDesktopNotifications: { type: 'integer' },
				previousTransactionCount: { type: 'integer' },
				ERC20TxHistoryLastBlock: { type: 'integer' },
				EthTxHistoryLastBlock: { type: 'integer' },
				airDropCode: { type: 'integer' },
				createdAt: { type: 'integer' },
				updatedAt: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('./wallet');
		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: `${this.tableName}.walletId`,
					to: `${Wallet.tableName}.id`
				}
			}
		};
	}

	static create(itm) {
		return this.query().insertAndFetch(itm);
	}

	static findByWalletId(walletId) {
		return this.query().where({ walletId });
	}

	static updateById(id, itm) {
		return this.query().patchAndFetchById(id, itm);
	}
}

module.exports = ActionLog;
