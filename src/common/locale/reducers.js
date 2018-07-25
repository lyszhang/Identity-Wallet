import * as types from './types';

const initialState = {
	locale: 'en'
};

const localeReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.UPDATE_LOCALE:
			return {
				...state,
				locale: action.payload
			};
		default:
			return state;
	}
};

const reducer = localeReducer;

export default reducer;
