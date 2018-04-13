'use strict';

const Token = requireAppModule('angular/classes/token');

function ManageCryptosController($rootScope, $scope, $log, $q, $timeout, $mdDialog, $state, SqlLiteService, Web3Service, CommonService) {
    'ngInject'

    $log.info('ManageCryptosController');

    let reloadPieChartIsNeeded = false;
    $scope.cancel = (event) => {
        $state.go('member.dashboard.main');
        if (reloadPieChartIsNeeded) {
            $rootScope.$broadcast("piechart:reload");
        }
    }

    $scope.data = [];
    let wallet = $rootScope.wallet;

    let processTokens = (walletTokens) => {
        let data = Object.keys(walletTokens).map((tokenKey) => {
            let walletToken = walletTokens[tokenKey];
            walletToken.totalValue = CommonService.commasAfterNumber(walletToken.calculateBalanceInUSD(), 2);

            let lastPrice = SqlLiteService.getTokenPriceBySymbol(walletToken.symbol.toUpperCase());
            walletToken.lastPrice = lastPrice ? lastPrice.priceUSD : 0;
            walletToken.balance = CommonService.commasAfterNumber(walletToken.getFormattedBalance(), 2);
            walletToken.name = tokenKey == 'KEY' ? 'SelfKey' : tokenKey;

            return walletToken;
        });

        let ethPrice = SqlLiteService.getTokenPriceBySymbol('ETH');
        data.push({
            symbol: 'ETH',
            name: 'Ethereum',
            lastPrice: ethPrice ? ethPrice.priceUSD : 0,
            balance: CommonService.commasAfterNumber(wallet.getFormattedBalance(), 2),
            totalValue: CommonService.commasAfterNumber(wallet.calculateBalanceInUSD(), 2),
            contractAddress: ''
        });
        data.sort((a, b) => {
            let symbolA = a.symbol.toLowerCase();
            let symbolB = b.symbol.toLowerCase();
            if (symbolA == 'eth') {
                return -1;
            }

            if (symbolB == 'eth') {
                return 1;
            }

            if (symbolA == 'key') {
                return -1;
            }

            if (symbolB == 'key') {
                return 1;
            }

            return parseFloat(b.totalValue || 0) - parseFloat(a.totalValue || 0);
        });

        $scope.data = data;
    };

    processTokens(wallet.tokens);

    const PRIMARY_TOKEN_KEYS = ['KEY', 'ETH'];
    $scope.isDeletable = (token) => {
        if (PRIMARY_TOKEN_KEYS.indexOf(token.symbol.toUpperCase()) != -1) {
            return false;
        }
        return true;
    };


    $scope.deleteCustomToken = (event, token, index) => {
        $rootScope.openConfirmationDialog(event, 'Removing tokens from this list only disables them from the display, and does not impact their status on the Ethereum blockchain.\n', 'Are you sure?').then((val) => {
            if (val == 'accept') {
                SqlLiteService.updateWalletToken({
                    tokenId: token.id,
                    walletId: wallet.id,
                    id: token.walletTokenId,
                    balance: token.balance,
                    recordState: 0
                }).then(() => {
                    delete $rootScope.wallet.tokens[token.symbol.toUpperCase()];
                    $scope.data.splice(index, 1);
                    reloadPieChartIsNeeded = true;
                });
            }
        });

    }
};

module.exports = ManageCryptosController;
