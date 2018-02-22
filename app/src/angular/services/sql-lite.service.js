'use strict';

const IdAttributeType = requireAppModule('angular/classes/id-attribute-type');
const IdAttribute = requireAppModule('angular/classes/id-attribute');
const Ico = requireAppModule('angular/classes/ico');

function SqlLiteService($rootScope, $log, $q, $timeout, CONFIG, ElectronService, CommonService, RPCService, EVENTS) {
    'ngInject';

    $log.debug('SqlLiteService Initialized');

    let ID_ATTRIBUTE_TYPES_STORE = {};
    let TOKENS_STORE = {};
    let TOKEN_PRICES_STORE = {};
    let WALLETS_STORE = {};
    let GUIDE_SETTINGS = {};
    // APP_SETTINGS = {}
    // WALLET_SETTINGS = {}

    class SqlLiteService {

        constructor() {
            if (RPCService.ipcRenderer) {
                this.loadData().then((resp) => {
                    $log.info("DONE", ID_ATTRIBUTE_TYPES_STORE, TOKENS_STORE, TOKEN_PRICES_STORE, WALLETS_STORE);
                }).catch((error) => {
                    $log.error(error);
                });
            } else {
                defer.reject({ message: 'electron RPC not available' });
            }
        }

        /**
         * Load
         */
        loadData() {
            let promises = [];

            promises.push(this.loadGuideSettings());
            promises.push(this.loadIdAttributeTypes());
            promises.push(this.loadTokens());
            promises.push(this.loadTokenPrices());
            promises.push(this.loadWallets());

            return $q.all(promises).then((data) => {
                $rootScope.$broadcast(EVENTS.APP_DATA_LOAD);
            });
        }

        loadTokens() {
            return RPCService.makeCall('getTokens', null).then((tokens) => {
                if (tokens) {
                    for (let i in tokens) {
                        let item = tokens[i];
                        TOKENS_STORE[item.symbol] = item;
                    }
                }
            });
        }

        loadIdAttributeTypes() {
            return RPCService.makeCall('getIdAttributeTypes', null).then((idAttributeTypes) => {
                if (idAttributeTypes) {
                    for (let i in idAttributeTypes) {
                        let item = idAttributeTypes[i];
                        ID_ATTRIBUTE_TYPES_STORE[item.key] = item;
                    }
                }
            });
        }

        loadTokenPrices() {
            return RPCService.makeCall('getTokenPrices', null).then((tokenPrices) => {
                if (tokenPrices) {
                    for (let i in tokenPrices) {
                        let item = tokenPrices[i];
                        TOKEN_PRICES_STORE[item.id] = item;
                    }
                }
            });
        }

        loadWallets() {
            return RPCService.makeCall('getWallets', null).then((wallets) => {
                if (wallets) {
                    for (let i in wallets) {
                        let item = wallets[i];
                        WALLETS_STORE[item.publicKey] = item;
                    }
                }
            });
        }

        loadGuideSettings() {
            return RPCService.makeCall('getGuideSettings', null).then((guideSettings) => {
                console.log(guideSettings, "<<<<<<<<<<")

                if (guideSettings && guideSettings.length) {
                    GUIDE_SETTINGS = guideSettings[0];
                }
            });
        }

        /**
         *
         */
        getWalletPublicKeys () {
            return Object.keys(WALLETS_STORE);
        }

        getWallets () {
            return WALLETS_STORE;
        }

        saveWallet (data) {
            return RPCService.makeCall('saveWallet', data);
        }

        getGuideSettings () {
            return GUIDE_SETTINGS;
        }

        saveGuideSettings (data) {
            return RPCService.makeCall('saveGuideSettings', data);
        }

    }

    return new SqlLiteService();
}

module.exports = SqlLiteService;
