import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, gray, dark } from '../helpers/colors';
import {
	View,
	Text,
} from 'react-native';
import { LinearGradient } from 'expo'

class InicioScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	render() {
		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				<View>
					<Text style={{ fontSize: 24, fontWeight: 'bold', paddingVertical: 15, paddingHorizontal: 10, color: white }}>
						Atualizações
					</Text>
				</View>

				<View style={{ padding: 10 }}>
					<View style={{ padding: 10, borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 6 }}>
						<Text style={{ color: white }}>1 Novas abas: Inicio e Perfil</Text>
					</View>

					<View style={{ padding: 10, borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 6 }}>
						<Text style={{ color: white }}>2 Medalhas das pessoas: Na aba de pessoas pessoas divididas por medalhas</Text>
					</View>

				</View>
			</LinearGradient>
		)
	}
}

export default InicioScreen
