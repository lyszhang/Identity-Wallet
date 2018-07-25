import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as localeActions from 'common/locale/actions';
import { CryptoPriceBox } from 'selfkey-ui';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getCryptoValue, getToValue } from '../../common/price-utils';

const mapStateToProps = (state, props) => {
	return {
		...getLocale(state),
		toCurrency: getFiatCurrency(state).fiatCurrency,
		cryptoValue: getCryptoValue(state, props),
		toValue: getToValue(state, props)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(localeActions, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CryptoPriceBox);
