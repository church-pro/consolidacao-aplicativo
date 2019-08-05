import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark } from '../helpers/colors';
import {
	View,
	Text,
} from 'react-native';

class InicioScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	render() {
		return (
			<View style={{color: '#000000'}}>
				<Text>
					InicioScreen
				</Text>
				<Text>
					Atualizacoes
				</Text>
				<Text>
				1 Novas abas: Inicio e Perfil
				</Text>
				<Text>
				2 Medalhas das pessoas: Na aba de pessoas pessoas divididas por medalhas 
				</Text>
			</View>
		)
	}
}

export default InicioScreen
