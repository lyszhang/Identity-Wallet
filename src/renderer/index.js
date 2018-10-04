/* eslint-env browser */ /* global angular, staticPath */
'use strict';
import { react2angular } from 'react2angular';
import dotenv from 'dotenv';
import { PriceBoxWrapper } from './react/price-box/index';
import { TokenBoxWrapper } from './react/token-box/index';
import { CryptoChartBoxWrapper, CryptoPriceTableWrapper } from './react/my-crypto/index';
import { TransferPriceWrapper } from './react/transfer-price/index';
import { TransactionNoGasErrorWrapper } from './react/transaction/transaction-no-gas-error';
import { TransactionErrorWrapper } from './react/transaction/transaction-error';
import { IdAttributeSchemaForm } from './react/id-attribute';
import { MarketplaceWrapper } from './react/marketplace';
import { TransactionsHistoryWrapper } from './react/transaction/transactions-history';
import { ExchangesWrapper } from './react/marketplace/exchanges';
import { ItemWrapper } from './react/marketplace/item';
import { WithoutBalanceWrapper } from './react/marketplace/no-balance';
import { UnlockWrapper } from './react/marketplace/unlock';
import { TransactionSendBoxWrapper } from './react/transaction/send';
import { TransactionSendProgressBoxWrapper } from './react/transaction/progress';
import { setGlobalContext, configureContext } from 'common/context';

const { Logger } = require('common/logger');

dotenv.config();

const ctx = configureContext('renderer').cradle;
setGlobalContext(ctx);

const path = require('path');

const log = new Logger('main');

log.info('initializing renderer');

const isDevelopment = process.env.NODE_ENV === 'development';
window.staticPath = isDevelopment ? '' : window.__dirname.replace(/app\.asar$/, 'static');

document.addEventListener(
	'dragover',
	function(event) {
		event.preventDefault();
		return false;
	},
	false
);

document.addEventListener(
	'drop',
	function(event) {
		event.preventDefault();
		return false;
	},
	false
);

/**
 *
 */
window.zxcvbn = require('zxcvbn');
window.qrcode = require('qrcode-generator');
window.BigNumber = require('bignumber.js');
window.ethUtil = require('ethereumjs-util');
window.ethUtil.crypto = require('crypto');

require('@uirouter/angularjs');
require('angular-material');
require('angular-messages');
require('angular-sanitize');
require('angular-local-storage');
require('angular-qrcode');
require('angular-zxcvbn');
require('./angular/app.templates');

/**
 * main module: 'kyc-wallet'
 */
window.app = angular.module('kyc-wallet', [
	'ngMaterial',
	'ngMessages',
	'ngSanitize',
	'ui.router',
	'templates',
	'LocalStorageModule',
	'monospaced.qrcode',
	'zxcvbn'
]);

/**
 * Internal Modules
 */
const appRun = require('./angular/configs/app.run');
const appStates = require('./angular/configs/app.states');

/**
 * constants
 */
const appConfig = require('common/config');

angular.module('kyc-wallet').constant('CONFIG', appConfig);

const appDictionaryConstant = require('./angular/constants/app.dictionary.constant');
angular.module('kyc-wallet').constant('DICTIONARY', appDictionaryConstant);

const appEventsConstant = require('./angular/constants/app.events.constant');
angular.module('kyc-wallet').constant('EVENTS', appEventsConstant);

/**
 * services
 */
const RPCService = require('./angular/services/rpc.service');
angular.module('kyc-wallet').service('RPCService', RPCService);

const SqlLiteService = require('./angular/services/sql-lite.service');
angular.module('kyc-wallet').service('SqlLiteService', SqlLiteService);

const CommonService = require('./angular/services/common.service');
angular.module('kyc-wallet').service('CommonService', CommonService);

const Web3Service = require('./angular/services/web3.service');
angular.module('kyc-wallet').service('Web3Service', Web3Service);

const EtherUnitsService = require('./angular/services/ether-units.service');
angular.module('kyc-wallet').service('EtherUnitsService', EtherUnitsService);

const SelfkeyService = require('./angular/services/selfkey.service');
angular.module('kyc-wallet').service('SelfkeyService', SelfkeyService);

const HardwareWalletService = require('./angular/services/hardware-wallet.service');
angular.module('kyc-wallet').service('HardwareWalletService', HardwareWalletService);

const SignService = require('./angular/services/sign.service');
angular.module('kyc-wallet').service('SignService', SignService);

const TxHistoryService = require('./angular/services/tx-history.service');
angular.module('kyc-wallet').service('TxHistoryService', TxHistoryService);

/**
 * directives
 */
const SkCloseWarningBoxDirective = require('./angular/directives/commons/sk-close-warning-box.directive');
angular.module('kyc-wallet').directive('skCloseWarningBox', SkCloseWarningBoxDirective);

const SkOfflineWarningBoxDirective = require('./angular/directives/commons/sk-offline-warning-box.directive');
angular.module('kyc-wallet').directive('skOfflineWarningBox', SkOfflineWarningBoxDirective);

const SkLoadingDirective = require('./angular/directives/commons/sk-loading.directive');
angular.module('kyc-wallet').directive('skLoading', SkLoadingDirective);

const SkIconDirective = require('./angular/directives/commons/sk-icon.directive');
angular.module('kyc-wallet').directive('skIcon', SkIconDirective);

const SkButtonLoadingDirective = require('./angular/directives/commons/sk-button-loading.directive');
angular.module('kyc-wallet').directive('skButtonLoading', SkButtonLoadingDirective);

const SkSelectIfDirective = require('./angular/directives/commons/sk-select-if.directive');
angular.module('kyc-wallet').directive('skSelectIf', SkSelectIfDirective);

const skShowLoading = require('./angular/directives/commons/sk-show-loading.directive');
angular.module('kyc-wallet').directive('skShowLoading', skShowLoading);

const SkLinearProgressDirective = require('./angular/directives/commons/sk-linear-progress.directive');
angular.module('kyc-wallet').directive('skLinearProgress', SkLinearProgressDirective);

const SkTokenBoxDirective = require('./angular/directives/commons/sk-token-box.directive');
angular.module('kyc-wallet').directive('skTokenBox', SkTokenBoxDirective);

const SkCustomTokenBoxDirective = require('./angular/directives/commons/sk-custom-token-box.directive');
angular.module('kyc-wallet').directive('skCustomTokenBox', SkCustomTokenBoxDirective);

const SkCirclePieChartDirective = require('./angular/directives/commons/sk-circle-pie-chart.directive');
angular.module('kyc-wallet').directive('skCirclePieChart', SkCirclePieChartDirective);

const SkUserInfoBoxDirective = require('./angular/directives/commons/sk-user-info-box.directive');
angular.module('kyc-wallet').directive('skUserInfoBox', SkUserInfoBoxDirective);

const ScrollToEndDirective = require('./angular/directives/commons/scroll-to-end.directive');
angular.module('kyc-wallet').directive('scrollToEnd', ScrollToEndDirective);

const CopyToClipboardDirective = require('./angular/directives/commons/copy-to-clipboard.directive');
angular.module('kyc-wallet').directive('copyToClipboard', CopyToClipboardDirective);

const SkDoubleHeaderDirective = require('./angular/directives/commons/sk-double-header.directive');
angular.module('kyc-wallet').directive('skDoubleHeader', SkDoubleHeaderDirective);

const SkTxHistoryDirective = require('./angular/directives/commons/sk-tx-history.directive');
angular.module('kyc-wallet').directive('skTxHistory', SkTxHistoryDirective);

/**
 * React Components
 */

const cryptoPriceBox = react2angular(PriceBoxWrapper, [
	'cryptoCurrency',
	'cryptoValue',
	'toCurrency',
	'toValue'
]);
angular.module('kyc-wallet').component('cryptoPriceBox', cryptoPriceBox);

const tokenBoxWrapper = react2angular(TokenBoxWrapper, [
	'cryptoCurrencyShort',
	'cryptoCurrencyName',
	'transferAction',
	'customTokenText'
]);
angular.module('kyc-wallet').component('tokenBox', tokenBoxWrapper);

const cryptoChartBoxWrapper = react2angular(CryptoChartBoxWrapper, [
	'tokens',
	'manageCryptoAction'
]);
angular.module('kyc-wallet').component('cryptoChartBox', cryptoChartBoxWrapper);

const transferPriceWrapper = react2angular(TransferPriceWrapper, [
	'cryptoCurrencyShort',
	'cryptoCurrencyName'
]);
angular.module('kyc-wallet').component('transferPrice', transferPriceWrapper);

const cryptoPriceTableWrapper = react2angular(CryptoPriceTableWrapper, ['toggleAction']);
angular.module('kyc-wallet').component('cryptoPriceTable', cryptoPriceTableWrapper);

const transactionNoGasErrorWrapper = react2angular(TransactionNoGasErrorWrapper, [
	'cryptoCurrency',
	'closeAction',
	'openLink'
]);
angular.module('kyc-wallet').component('transactionNoGasError', transactionNoGasErrorWrapper);

const transactionErrorWrapper = react2angular(TransactionErrorWrapper, [
	'cryptoCurrency',
	'closeAction',
	'message'
]);
angular.module('kyc-wallet').component('transactionError', transactionErrorWrapper);

const transactionSendBoxWrapper = react2angular(TransactionSendBoxWrapper, [
	'cryptoCurrency',
	'closeAction',
	'navigateToTransactionProgress',
	'showConfirmTransactionInfoModal',
	'isHardwareWallet',
	'closeModal',
	'norifySignTxFailure',
	'navigateToTransactionNoGasError',
	'navigateToTransactionError',
	'isSendCustomToken',
	'trezorAccountIndex',
	'walletProfile'
]);
angular.module('kyc-wallet').component('transactionSendBox', transactionSendBoxWrapper);

const transactionSendProgressBoxWrapper = react2angular(TransactionSendProgressBoxWrapper, [
	'cryptoCurrency',
	'closeAction',
	'openLink'
]);
angular
	.module('kyc-wallet')
	.component('transactionSendProgressBox', transactionSendProgressBoxWrapper);

const idAttributeSchemaForm = react2angular(IdAttributeSchemaForm, [
	'attr',
	'type',
	'onClose',
	'onSave'
]);
angular.module('kyc-wallet').component('idAttributeSchemaForm', idAttributeSchemaForm);

const marketplaceWrapper = react2angular(MarketplaceWrapper, ['learnMoreActions']);
angular.module('kyc-wallet').component('marketplace', marketplaceWrapper);

const transactionsHistoryWrapper = react2angular(TransactionsHistoryWrapper, ['list', 'openLink']);
angular.module('kyc-wallet').component('transactionsHistory', transactionsHistoryWrapper);

const exchangesWrapper = react2angular(ExchangesWrapper, ['viewAction', 'backAction']);
angular.module('kyc-wallet').component('exchanges', exchangesWrapper);

const itemWrapper = react2angular(ItemWrapper, ['name', 'unlockAction', 'backAction']);
angular.module('kyc-wallet').component('item', itemWrapper);

const withoutBalanceWrapper = react2angular(WithoutBalanceWrapper, ['closeAction']);
angular.module('kyc-wallet').component('withoutBalance', withoutBalanceWrapper);

const unlockMarketplace = react2angular(UnlockWrapper, ['closeAction', 'confirmAction']);
angular.module('kyc-wallet').component('unlockMarketplace', unlockMarketplace);
/**
 * controllers
 */

/**
 * commons
 */
const ToastController = require('./angular/controllers/commons/toast-controller.js');
angular.module('kyc-wallet').controller('ToastController', ToastController);

const TermsDialogController = require('./angular/controllers/commons/dialogs/terms-controller.js');
angular.module('kyc-wallet').controller('TermsDialogController', TermsDialogController);

const StartupGuideDialogController = require('./angular/controllers/commons/dialogs/startup-guide-controller.js');
angular
	.module('kyc-wallet')
	.controller('StartupGuideDialogController', StartupGuideDialogController);

const ReceiveTokenDialogController = require('./angular/controllers/commons/dialogs/receive-token-controller.js');
angular
	.module('kyc-wallet')
	.controller('ReceiveTokenDialogController', ReceiveTokenDialogController);

const SendTokenDialogController = require('./angular/controllers/commons/dialogs/send-token-controller.js');
angular.module('kyc-wallet').controller('SendTokenDialogController', SendTokenDialogController);

const SendTransactionController = require('./angular/controllers/commons/dialogs/send-transaction-controller.js');
angular.module('kyc-wallet').controller('SendTransactionController', SendTransactionController);

const SendTransactionProgressController = require('./angular/controllers/commons/dialogs/send-transaction-progress-controller.js');
angular
	.module('kyc-wallet')
	.controller('SendTransactionProgressController', SendTransactionProgressController);

const SendTransactionFailureController = require('./angular/controllers/commons/dialogs/send-transaction-failure-controller.js');
angular
	.module('kyc-wallet')
	.controller('SendTransactionFailureController', SendTransactionFailureController);

const UpdateDialogController = require('./angular/controllers/commons/dialogs/update-controller.js');
angular.module('kyc-wallet').controller('UpdateDialogController', UpdateDialogController);

const PasswordWarningDialogController = require('./angular/controllers/commons/dialogs/password-warning-controller.js');
angular
	.module('kyc-wallet')
	.controller('PasswordWarningDialogController', PasswordWarningDialogController);

const IdWalletInfoController = require('./angular/controllers/commons/dialogs/id-wallet-info-controller.js');
angular.module('kyc-wallet').controller('IdWalletInfoController', IdWalletInfoController);

const InfoDialogController = require('./angular/controllers/commons/dialogs/info-dialog-controller.js');
angular.module('kyc-wallet').controller('InfoDialogController', InfoDialogController);

const ConnectingToHardwareWalletController = require('./angular/controllers/commons/dialogs/connecting-to-hardware-wallet-controller.js');
angular
	.module('kyc-wallet')
	.controller('ConnectingToHardwareWalletController', ConnectingToHardwareWalletController);

const TrezorPinController = require('./angular/controllers/commons/dialogs/trezor-pin-controller.js');
angular.module('kyc-wallet').controller('TrezorPinController', TrezorPinController);

const TrezorPassphraseController = require('./angular/controllers/commons/dialogs/trezor-passphrase-controller.js');
angular.module('kyc-wallet').controller('TrezorPassphraseController', TrezorPassphraseController);

const ChooseHardwareWalletAddressController = require('./angular/controllers/commons/dialogs/choose-hardware-wallet-address-controller.js');
angular
	.module('kyc-wallet')
	.controller('ChooseHardwareWalletAddressController', ChooseHardwareWalletAddressController);

const AddEditDocumentDialogController = require('./angular/controllers/commons/dialogs/id-attributes/add-edit-document-controller.js');
angular
	.module('kyc-wallet')
	.controller('AddEditDocumentDialogController', AddEditDocumentDialogController);

const AddEditStaticDataDialogController = require('./angular/controllers/commons/dialogs/id-attributes/add-edit-static-data-controller.js');
angular
	.module('kyc-wallet')
	.controller('AddEditStaticDataDialogController', AddEditStaticDataDialogController);

const AddIdAttributeDialogController = require('./angular/controllers/commons/dialogs/id-attributes/add-id-attribute-controller.js');
angular
	.module('kyc-wallet')
	.controller('AddIdAttributeDialogController', AddIdAttributeDialogController);

const AddCustomTokenDialogController = require('./angular/controllers/commons/dialogs/add-custom-token-controller.js');
angular
	.module('kyc-wallet')
	.controller('AddCustomTokenDialogController', AddCustomTokenDialogController);

const NewERC20TokenInfoController = require('./angular/controllers/commons/dialogs/new-erc20-token-info-controller.js');
angular.module('kyc-wallet').controller('NewERC20TokenInfoController', NewERC20TokenInfoController);

const ConfirmationDialogController = require('./angular/controllers/commons/dialogs/confirmation-dialog-controller.js');
angular
	.module('kyc-wallet')
	.controller('ConfirmationDialogController', ConfirmationDialogController);

/**
 * guest
 */
const GuestLayoutController = require('./angular/controllers/guest/layout-controller.js');
angular.module('kyc-wallet').controller('GuestLayoutController', GuestLayoutController);

const GuestLoadingController = require('./angular/controllers/guest/loading-controller.js');
angular.module('kyc-wallet').controller('GuestLoadingController', GuestLoadingController);

/**
 * const wallet
 */
const GuestImportWalletController = require('./angular/controllers/guest/import/import-controller.js');
angular.module('kyc-wallet').controller('GuestImportWalletController', GuestImportWalletController);

const GuestImportKeystoreController = require('./angular/controllers/guest/import/keystore-controller.js');
angular
	.module('kyc-wallet')
	.controller('GuestImportKeystoreController', GuestImportKeystoreController);

const GuestImportPrivateKeyController = require('./angular/controllers/guest/import/private-key-controller.js');
angular
	.module('kyc-wallet')
	.controller('GuestImportPrivateKeyController', GuestImportPrivateKeyController);

/**
 * create wallet
 */
const GuestKeystoreCreateStep1Controller = require('./angular/controllers/guest/create/step-1.controller.js');
angular
	.module('kyc-wallet')
	.controller('GuestKeystoreCreateStep1Controller', GuestKeystoreCreateStep1Controller);

const GuestKeystoreCreateStep2Controller = require('./angular/controllers/guest/create/step-2.controller.js');
angular
	.module('kyc-wallet')
	.controller('GuestKeystoreCreateStep2Controller', GuestKeystoreCreateStep2Controller);

const GuestKeystoreCreateStep3Controller = require('./angular/controllers/guest/create/step-3.controller.js');
angular
	.module('kyc-wallet')
	.controller('GuestKeystoreCreateStep3Controller', GuestKeystoreCreateStep3Controller);

const GuestKeystoreCreateStep4Controller = require('./angular/controllers/guest/create/step-4.controller.js');
angular
	.module('kyc-wallet')
	.controller('GuestKeystoreCreateStep4Controller', GuestKeystoreCreateStep4Controller);

const GuestKeystoreCreateStep5Controller = require('./angular/controllers/guest/create/step-5.controller.js');
angular
	.module('kyc-wallet')
	.controller('GuestKeystoreCreateStep5Controller', GuestKeystoreCreateStep5Controller);

const GuestKeystoreCreateStep6Controller = require('./angular/controllers/guest/create/step-6.controller.js');
angular
	.module('kyc-wallet')
	.controller('GuestKeystoreCreateStep6Controller', GuestKeystoreCreateStep6Controller);

/**
 * member
 */
const MemberLayoutController = require('./angular/controllers/member/layout-controller.js');
angular.module('kyc-wallet').controller('MemberLayoutController', MemberLayoutController);

const MemberRightSidenavController = require('./angular/controllers/member/right-sidenav-controller.js');
angular
	.module('kyc-wallet')
	.controller('MemberRightSidenavController', MemberRightSidenavController);

/**
 * setup
 */
const MemberSetupLayoutController = require('./angular/controllers/member/setup/layout-controller.js');
angular.module('kyc-wallet').controller('MemberSetupLayoutController', MemberSetupLayoutController);

const MemberSetupChecklistController = require('./angular/controllers/member/setup/checklist-controller.js');
angular
	.module('kyc-wallet')
	.controller('MemberSetupChecklistController', MemberSetupChecklistController);

const MemberSetupAddDocumentController = require('./angular/controllers/member/setup/add-document-controller.js');
angular
	.module('kyc-wallet')
	.controller('MemberSetupAddDocumentController', MemberSetupAddDocumentController);

/**
 * dashboard
 */
const MemberDashboardMainController = require('./angular/controllers/member/dashboard/main-controller.js');
angular
	.module('kyc-wallet')
	.controller('MemberDashboardMainController', MemberDashboardMainController);

/**
 * wallet (TODO rename to token)
 */
const ManageTokenController = require('./angular/controllers/member/wallet/manage-token-controller.js');
angular.module('kyc-wallet').controller('ManageTokenController', ManageTokenController);

const ManageCryptosController = require('./angular/controllers/member/wallet/manage-cryptos-controller.js');
angular.module('kyc-wallet').controller('ManageCryptosController', ManageCryptosController);

/**
 * id wallet
 */
const MemberIdWalletMainController = require('./angular/controllers/member/id-wallet/main-controller.js');
angular
	.module('kyc-wallet')
	.controller('MemberIdWalletMainController', MemberIdWalletMainController);

/**
 * marketplace
 */
const MemberMarketplaceController = require('./angular/controllers/member/marketplace/marketplace-controller.js');
angular.module('kyc-wallet').controller('MemberMarketplaceController', MemberMarketplaceController);

const MemberMarketplaceExchangeListController = require('./angular/controllers/member/marketplace/exchange-list-controller.js');
angular
	.module('kyc-wallet')
	.controller('MemberMarketplaceExchangeListController', MemberMarketplaceExchangeListController);

const MemberMarketplaceExchangeItemController = require('./angular/controllers/member/marketplace/exchange-item-controller.js');
angular
	.module('kyc-wallet')
	.controller('MemberMarketplaceExchangeItemController', MemberMarketplaceExchangeItemController);

const MemberMarketplaceNoBalanceController = require('./angular/controllers/member/marketplace/no-balance-controller.js');
angular
	.module('kyc-wallet')
	.controller('MemberMarketplaceNoBalanceController', MemberMarketplaceNoBalanceController);

const MemberMarketplaceUnlockController = require('./angular/controllers/member/marketplace/unlock-controller.js');
angular
	.module('kyc-wallet')
	.controller('MemberMarketplaceUnlockController', MemberMarketplaceUnlockController);

/**
 * config states
 */
angular.module('kyc-wallet').config(appStates);

/**
 * config run
 */
angular.module('kyc-wallet').run(appRun);

const title = document.createElement('title');
title.innerHTML = 'SelfKey Identity Wallet';
document.head.appendChild(title);

const icon32 = document.createElement('link');
icon32.href = path.join(staticPath, 'assets/images/favicons/kyc-32x32.png');
icon32.rel = 'icon';
icon32.sizes = '32x32';
document.head.appendChild(icon32);

const icon192 = document.createElement('link');
icon192.href = path.join(staticPath, 'assets/images/favicons/kyc-192x192.png');
icon192.rel = 'icon';
icon192.sizes = '192x192';
document.head.appendChild(icon192);

const iconApple = document.createElement('link');
iconApple.href = path.join(staticPath, 'assets/images/favicons/kyc-180x180.png');
iconApple.rel = 'apple-touch-icon-precomposed';
document.head.appendChild(iconApple);

const animate = document.createElement('link');
animate.href = path.join(staticPath, 'assets/libs/animate/animate.css');
animate.rel = 'stylesheet';
document.head.appendChild(animate);

const material = document.createElement('link');
material.href = path.join(staticPath, 'assets/libs/angular-material/angular-material.min.css');
material.rel = 'stylesheet';
document.head.appendChild(material);

const materialIcons = document.createElement('link');
materialIcons.href = path.join(
	staticPath,
	'assets/libs/material-icons/icon.css?family=Material+Icons'
);
materialIcons.rel = 'stylesheet';
document.head.appendChild(materialIcons);

const ionIcons = document.createElement('link');
ionIcons.href = path.join(staticPath, 'assets/libs/ionicons/css/ionicons.min.css');
ionIcons.rel = 'stylesheet';
document.head.appendChild(ionIcons);

const main = document.createElement('link');
main.href = path.join(staticPath, 'stylesheets/css/main.css');
main.rel = 'stylesheet';
document.head.appendChild(main);

const bodyClass = document.createAttribute('class');
bodyClass.value = 'gradient-1';
document.body.setAttributeNode(bodyClass);

const bodyNgKeyPress = document.createAttribute('ng-keypress');
bodyNgKeyPress.value = '$root.broadcastKeyPress($event)';
document.body.setAttributeNode(bodyNgKeyPress);

const uiView = document.createElement('div');
const attUiView = document.createAttribute('ui-view');
attUiView.value = 'main';
uiView.setAttributeNode(attUiView);
const attLayoutFill = document.createAttribute('layout-fill');
uiView.setAttributeNode(attLayoutFill);
document.body.appendChild(uiView);

const skCloseWarningBox = document.createElement('sk-close-warning-box');
document.body.appendChild(skCloseWarningBox);

const skskOfflineWarningBox = document.createElement('sk-offline-warning-box');
document.body.appendChild(skskOfflineWarningBox);

const loader = document.createElement('script');
loader.src = path.join(staticPath, 'assets/libs/loader.js');
document.body.appendChild(loader);

angular.element(() => {
	angular.bootstrap(document, ['kyc-wallet'], {
		strictDi: true
	});
});
log.info('load complete');
