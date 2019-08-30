import React from 'react'
import { Platform, StatusBar, StyleSheet, View, } from 'react-native'
import { AppLoading, Asset, Font, Icon, Notifications, } from 'expo'
import AppNavigator from './navigation/AppNavigator'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { Constants } from 'expo'
import { gray, dark, black } from './helpers/colors'
import { recuperarNotificacoes, submeterNotificacoes, } from './helpers/api'

const logger = store => next => action => {
	console.group(action.type ? action.type : 'Redux-Thunk')
	console.info('DESPACHANDO ACAO: ', action)
	let resultado = next(action)
	console.log('PROXIMO STORE: ', store.getState())
	console.groupEnd(action.type ? action.type : 'Redux-Thunk')
	return resultado
}
const store = createStore(rootReducer, applyMiddleware(thunk))

function BarraDeEstado({ backgroundColor, ...props }) {
	return (
		<View style={{ backgroundColor, height: Constants.statusBarHeight }}>
			<StatusBar translucent backgroundColor={backgroundColor} {...props} />
		</View>
	)
}

export default class App extends React.Component {
	state = {
		isLoadingComplete: false,
	};

	render() {
		Notifications.addListener(retorno => {
			console.log('Notifications.addListener')
			recuperarNotificacoes()
				.then(notificacoes => {
					console.log('recuperarNotificacoes: ', notificacoes)
					let submeter = false
					if(notificacoes.mensagem === retorno.notificationId){
						delete notificacoes.mensagem
						submeter = true
					}
					if(notificacoes.ligar === retorno.notificationId){
						delete notificacoes.ligar
						submeter = true
					}
					if(notificacoes.visitar === retorno.notificationId){
						delete notificacoes.visitar
						submeter = true
					}
					if(submeter){
						submeterNotificacoes(notificacoes)
							.then(retorno => console.log('submeterNotificacoes: ', retorno))
					}
				})
		})

		if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
			return (
				<AppLoading
					startAsync={this._loadResourcesAsync}
					onError={this._handleLoadingError}
					onFinish={this._handleFinishLoading}
				/>
			);
		} else {
			return (
				<View style={styles.container}>
					<BarraDeEstado barStyle='light-content' />
					<Provider store={store}>
						<AppNavigator />
					</Provider>
				</View>
			)
		}
	}

	_loadResourcesAsync = async () => {
		return Promise.all([
			Font.loadAsync({
				Roboto: require('native-base/Fonts/Roboto.ttf'),
				Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
				...Icon.Ionicons.font,
			}),
		]);
	};

	_handleLoadingError = error => {
		console.warn(error);
	};

	_handleFinishLoading = () => {
		this.setState({ isLoadingComplete: true });
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Platform.OS === "ios" ? black : gray,
	},
});
