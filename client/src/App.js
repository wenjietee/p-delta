import './App.css';
import Axios from './utils/Axios';
import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Article from './pages/Article';
import ArticleCreate from './pages/ArticleCreate';
import ArticleEdit from './pages/ArticleEdit';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import HeaderPublic from './components/HeaderPublic';
import HeaderProtected from './components/HeaderProtected';
import Footer from './components/Footer';

const App = () => {
	const [isAuth, setAuth] = useState(false);
	const [user, setUser] = useState();
	useEffect(() => {
		const access = localStorage.getItem('access');

		// Verify token
		if (access) {
			try {
				let { data } = Axios.get('api/verify/');
				console.log(data);
				// verify auth
				setAuth(true);
				// set user data
				setUser(data);
				console.log('verification success');
			} catch (error) {
				// logout user if auth failed
				console.log('verification', error);

				logout();
			}
		} else {
			setAuth(false);
		}
	}, [user]);

	// handle login
	const login = async (username, password) => {
		try {
			let { data } = await Axios.post('api/login/', {
				username: username,
				password: password,
			});

			// set tokens
			localStorage.setItem('access', data.access);
			localStorage.setItem('refresh', data.refresh);

			// set user data
			setUser(data.user);
			// login user
			setAuth(true);
		} catch (error) {
			alert(
				`Error ${error.response.status}: ${error.response.data.detail}`
			);
		}
	};

	const logout = () => {
		// remove tokens
		localStorage.removeItem('access');
		localStorage.removeItem('refresh');

		// logout user
		setAuth(false);
	};
	return (
		<React.Fragment>
			<Router>
				{isAuth ? (
					<HeaderProtected logout={logout} user={user} />
				) : (
					<HeaderPublic />
				)}
				<main>
					<Switch>
						<PublicRoute
							exact
							path='/'
							login={login}
							isAuth={isAuth}
							component={Landing}
						/>
						<PublicRoute
							exact
							path='/login'
							login={login}
							isAuth={isAuth}
							component={Login}
						/>
						<PublicRoute
							exact
							path='/register'
							isAuth={isAuth}
							component={Register}
						/>

						<ProtectedRoute
							exact
							path='/article/create'
							isAuth={isAuth}
							component={ArticleCreate}
						/>
						<ProtectedRoute
							exact
							path='/article/:id'
							isAuth={isAuth}
							user={user}
							component={Article}
						/>
						<ProtectedRoute
							exact
							path='/article/:id/edit'
							isAuth={isAuth}
							component={ArticleEdit}
						/>
						<ProtectedRoute
							exact
							path='/profile'
							isAuth={isAuth}
							user={user}
							component={Profile}
						/>
						<ProtectedRoute
							exact
							path='/profile/edit'
							isAuth={isAuth}
							user={user}
							component={ProfileEdit}
						/>
						<ProtectedRoute
							exact
							path='/home'
							logout={logout}
							isAuth={isAuth}
							user={user}
							component={Home}
						/>
						<Route exact path='/404' component={NotFound} />
						<Redirect to='/404' />
					</Switch>
				</main>
				<Footer />
			</Router>
		</React.Fragment>
	);
};

export default App;
