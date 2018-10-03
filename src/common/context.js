/* istanbul ignore file */
import { asClass, asValue, asFunction, createContainer, InjectionMode } from 'awilix';

import PriceService from '../main/token/price-service';
import configureStore from './store/configure-store';
import ExchangesService from '../main/exchanges/exchanges-service';
import IdAttributeTypeService from '../main/identity/id-attribute-type-service';
import TxHistoryService from '../main/blockchain/tx-history-service';
import Web3Service from '../main/blockchain/web3-service';
import { LWSService } from '../main/lws/lws-service';
import LedgerService from '../main/blockchain/leadger-service';
import { CrashReportService } from './logger/crash-report-service';
import TrezorService from '../main/blockchain/trezor-service';
import RpcHandler from '../main/rpc-handler';
import { StakingService } from '../main/blockchain/staking-service';
import EthGasStationService from '../main/blockchain/eth-gas-station-service';
import { createApp } from '../main/app';
import { MarketplaceService } from '../main/marketplace/marketplace-service';

let globalContext = null;

export const setGlobalCtx = ctx => {
	globalContext = ctx;
};
export const getGlobalCtx = () => globalContext;

export const registerCommonServices = (container, thread) =>
	container.register({
		initialState: asValue(global.state),
		threadName: asValue(thread),
		store: asFunction(({ initialState, threadName }) =>
			configureStore(initialState, threadName)
		).singleton()
	});

export const registerMainServices = container =>
	container.register({
		app: asFunction(createApp).singleton(),
		web3Service: asClass(Web3Service).singleton(),
		ledgerService: asClass(LedgerService).singleton(),
		// TODO: refactor to not use static methods
		CrashReportService: asValue(CrashReportService),
		txHistoryService: asClass(TxHistoryService).singleton(),
		TxHistoryService: asValue(TxHistoryService),
		priceService: asClass(PriceService).singleton(),
		lwsService: asClass(LWSService).singleton(),
		idAttributeTypeService: asClass(IdAttributeTypeService).singleton(),
		exchangesService: asClass(ExchangesService).singleton(),
		ethGasStationService: asClass(EthGasStationService).singleton(),
		trezorService: asFunction(() => {
			let Service = TrezorService();
			return new Service();
		}).singleton(),
		rpcHandler: asFunction(cradle => {
			let Handler = RpcHandler(cradle);
			return new Handler();
		}).singleton(),
		stakingService: asClass(StakingService).singleton(),
		marketplaceService: asClass(MarketplaceService).singleton()
	});

export const registerRendererServices = container => container.register({});

export const configureContext = thread => {
	const container = createContainer({
		injectionMode: InjectionMode.PROXY
	});
	registerCommonServices(container, thread);
	if (thread === 'main') registerMainServices(container);
	else registerRendererServices(container);
	return container;
};

export default configureContext;
