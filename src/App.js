import React, { Component, lazy, Suspense } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const Checkout = lazy(() => import('./containers/Checkout/Checkout'));
const Orders = lazy(() => import('./containers/Orders/Orders'));
const Auth = lazy(() => import('./containers/Auth/Auth'));

class App extends Component {
	componentDidMount() {
		this.props.onTryAutoSignup();
	}

	render() {
		let routes = (
			<Switch>
				<Route path='/auth' component={Auth} />
				<Route path='/' exact component={BurgerBuilder} />
				<Redirect to='/' />
			</Switch>
		);

		if (this.props.isAuthenticated) {
			routes = (
				<Switch>
					<Route path='/checkout' component={Checkout} />
					<Route path='/orders' component={Orders} />
					<Route path='/logout' component={Logout} />
					<Route path='/auth' component={Auth} />
					<Route path='/' exact component={BurgerBuilder} />
					<Redirect to='/' />
				</Switch>
			);
		}

		return (
			<div>
				<Suspense fallback={<div>Loading...</div>}>
					<Layout>{routes}</Layout>
				</Suspense>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckState()),
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
