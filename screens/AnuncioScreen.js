import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import { gray, primary, white, lightdark } from '../helpers/colors';
import {
	AdMobBanner,
} from 'expo-ads-admob';
import { adMobAndroid } from '../helpers/constants'

class AnuncioScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	state = {
		mostrarBotoes: false,
	}

	bannerError = (e) => {
		console.log('bannerError: ', e)
	}

	componentDidMount(){
		setTimeout(() => {
			this.setState({mostrarBotoes: true})
		}, 3000);
	}

	render() {
		const {
			mostrarBotoes,
		} = this.state
		const {
			navigation,
		} = this.props
		const { 
			qualAba,
		} = navigation.state.params
		return (
			<View style={{ flex: 1, backgroundColor: lightdark, padding: 20 }}>
				<Text style={{ color: white, fontWeight: 'bold', textAlign: 'center', fontSize: 22, marginVertical: 16 }}>
					Este anúncio ajuda a manter o projeto grátis
				</Text>
				{
					mostrarBotoes &&
						<TouchableOpacity 
							onPress={() => navigation.navigate('Prospectos', {qualAba})}>
							<Text style={{ fontSize: 16, color: gray }}>
								X
							</Text>
						</TouchableOpacity>
				}
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10, }}>
					<AdMobBanner
						bannerSize="mediumRectangle"
						adUnitID="ca-app-pub-6689947841260748/8147764780"
						onDidFailToReceiveAdWithError={this.bannerError}>
					</AdMobBanner>
				</View>
			</View>
		)
	}
}

export default AnuncioScreen
