import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import { white, lightdark } from '../helpers/colors';

class AnuncioScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: lightdark }}>
				<View style={{ flex: 0.25 }}>
					<Text style={{ color: white}}>
						Este anuncio ajuda a manter o projeto gratis
					</Text>
				</View>
				<View style={{ flex: 1 }}>
					<TouchableOpacity>
						<Text style={{ color: white}}>
							Fechar
						</Text>
					</TouchableOpacity>

					<Text style={{ color: white}}>
						Anuncio
					</Text>
				</View>
				<View style={{ flex: 0.25 }}>
					{/* botao com sombra para parecer mais cartoon */}
					<TouchableOpacity>
						<Text style={{ color: white}}>
							Saiba Mais
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

export default AnuncioScreen
