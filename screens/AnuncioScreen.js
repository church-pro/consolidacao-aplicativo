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

	bannerError = (e) => {
		console.log('bannerError: ', e)
	}

	render() {
		const {
			navigation,
		} = this.props

		const { 
			qualAba,
		} = navigation.state.params

		return (
			<View style={{ flex: 1, backgroundColor: lightdark, padding: 20 }}>
				<Text style={{ color: white, fontWeight: 'bold', textAlign: 'center', fontSize: 22, marginVertical: 16 }}>
					Este anuncio ajuda a manter o projeto grátis
				</Text>
				<TouchableOpacity 
					onPress={() => navigation.navigate('Prospectos', {qualAba})}>
					<Text style={{ fontSize: 16, color: gray }}>
						X
					</Text>
				</TouchableOpacity>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<AdMobBanner
						bannerSize="fullBanner"
						adUnitID="ca-app-pub-6689947841260748/8147764780"
						onDidFailToReceiveAdWithError={this.bannerError} />
				</View>
				<TouchableOpacity
					onPress={() => console.log(1)}
					style={{
						width: '100%',
						backgroundColor: primary,
						height: 45,
						borderRadius: 6,
						justifyContent: 'center',
						shadowOffset: { width: 5, height: 5, },
						shadowColor: 'rgba(0,0,0,0.3)',
						shadowOpacity: 1.5,
					}} >
					<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
						Saiba Mais
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

export default AnuncioScreen
