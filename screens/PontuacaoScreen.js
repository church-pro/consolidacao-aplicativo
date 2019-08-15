import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import { white, lightdark } from '../helpers/colors';
import ProgressCircle from 'react-native-progress-circle'

class PontuacaoScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	state = {
		pontos: 0,
	}

	componentDidMount(){
		const total = 95
		this.interval = setInterval(() => {
			this.setState(state => {
				const pontosAtuais = state.pontos
				return {
					pontos: pontosAtuais < total ? pontosAtuais + 1 : pontosAtuais,
				}
			})
		}, 20)
	}
	render() {
		const {
			pontos
		} = this.state
		return (
			<View style={{ flex: 1, backgroundColor: lightdark }}>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, backgroundColor: white,}}>
						<ProgressCircle
							percent={pontos}
							radius={50}
							borderWidth={10}
							color="#3399FF"
							bgColor="#aaaaaa"
						>
							<Text style={{ fontSize: 18}}>
								{`${pontos}%`}
							</Text>
						</ProgressCircle>
						<Text style={{ color: white}}>
							Velocimetro
						</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Text style={{ color: white}}>
							{/* por em negrito */}
							{`Ação concluída! +${pontos} XP`}
						</Text>
					</View>
				</View>
				<View style={{ flex: 0.25 }}>
					{/* botao com sombra para parecer mais cartoon */}
					<TouchableOpacity
						onPress={() => navigation.navigate('Anuncio')}>
						<Text style={{ color: white}}>
							Continuar
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

export default PontuacaoScreen
