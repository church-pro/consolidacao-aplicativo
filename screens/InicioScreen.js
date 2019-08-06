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
						Notas de Atualizações 1.1
					</Text>
				</View>
				<View style={{ padding: 5 }}>
					<Text style={{ color: white, fontWeight: 'bold',}}>Abas</Text>
				</View>
				<View style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 1 }}>
					<View style={{ padding: 5 }}>
						<Text style={{ color: white }}># Novas abas: Início, Perfil e Clubes</Text>
					</View>
				</View>
				<View style={{ padding: 5 }}>
					<Text style={{ color: white, fontWeight: 'bold',}}>Início</Text>
				</View>
				<View style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 1 }}>
					<View style={{ padding: 5 }}>
						<Text style={{ color: white }}># Informações sobre atualizações</Text>
					</View>
				</View>
				<View style={{ padding: 5 }}>
					<Text style={{ color: white, fontWeight: 'bold',}}>Perfil</Text>
				</View>
				<View style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 1 }}>
					<View style={{ padding: 5 }}>
						<Text style={{ color: white }}># Dados de Progresso</Text>
					</View>
				</View>
				<View style={{ padding: 5 }}>
					<Text style={{ color: white, fontWeight: 'bold',}}>Clubes</Text>
				</View>
				<View style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 1 }}>
					<View style={{ padding: 5 }}>
						<Text style={{ color: white }}># Crie ou  Participe de vários Clubes</Text>
					</View>
					<View style={{ padding: 5 }}>
						<Text style={{ color: white }}># Compita com outros participantes do seu clube</Text>
					</View>
					<View style={{ padding: 5 }}>
						<Text style={{ color: white }}># Confira o progresso do seu time</Text>
					</View>
				</View>
			</LinearGradient>
		)
	}
}

export default InicioScreen
