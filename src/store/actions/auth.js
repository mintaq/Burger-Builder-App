import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START,
	};
};

export const authSuccess = (idToken, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken,
		userId,
	};
};

export const authFail = error => {
	return {
		type: actionTypes.AUTH_FAIL,
		error,
	};
};

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('expirationDate');
	localStorage.removeItem('userId');

	return {
		type: actionTypes.AUTH_LOGOUT,
	};
};

export const checkAuthTimeout = expirationTime => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout());
		}, expirationTime * 1000);
	};
};

export const auth = (email, password, isSignup) => {
	return dispatch => {
		dispatch(authStart());
		const authData = { email, password, returnSecureToken: true };
		let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCkEn-I3Odj_b4YAyYOkZ3rwC4ETAOTEfo';
		if (!isSignup) {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCkEn-I3Odj_b4YAyYOkZ3rwC4ETAOTEfo';
		}
		axios
			.post(url, authData)
			.then(result => {
				const expirationDate = new Date(new Date().getTime() + result.data.expiresIn * 1000);
				localStorage.setItem('token', result.data.idToken);
				localStorage.setItem('expirationDate', expirationDate);
				localStorage.setItem('userId', result.data.localId);

				dispatch(authSuccess(result.data.idToken, result.data.localId));
				dispatch(checkAuthTimeout(result.data.expiresIn));
			})
			.catch(err => {
				dispatch(authFail(err.response.data.error));
			});
	};
};

export const setAuthRedirectPath = path => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path,
	};
};

export const authCheckState = () => {
	return dispatch => {
		const token = localStorage.getItem('token');
		if (!token) {
			dispatch(logout());
		} else {
			const expirationDate = new Date(localStorage.getItem('expirationDate'));
			if (expirationDate <= new Date()) {
				dispatch(logout());
			} else {
				const userId = localStorage.getItem('userId');
				dispatch(authSuccess(token, userId));
				dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
			}
		}
	};
};
