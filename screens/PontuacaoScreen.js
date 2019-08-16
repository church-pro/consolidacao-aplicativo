import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import { blue, white, lightdark } from '../helpers/colors';
import ProgressCircle from 'react-native-progress-circle'
import { connect } from 'react-redux'
import { 
	SITUACAO_LIGAR,
	SITUACAO_MENSAGEM,
	SITUACAO_VISITA,
	VALOR_VISITA,
	VALOR_LIGAR,
	VALOR_MENSAGEM,
} from '../helpers/constants'

class PontuacaoScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	state = {
		velocimetro: 0,
		pontos: 0,
		informacao: '',
	}

	componentDidMount(){
		const {
			situacao_id,
		} = this.props
		const {
			velocimetro,
		} = this.state
		let pontos = 0
		let informacao = ''
		if(situacao_id === SITUACAO_MENSAGEM){
			pontos = VALOR_MENSAGEM
			informacao = 'Parabéns! A pessoa está agora na aba ligar.'
		}
		if(situacao_id === SITUACAO_LIGAR){
			pontos = VALOR_LIGAR
			informacao = 'Parabéns! A pessoa está agora na aba visita.'
		}
		if(situacao_id === SITUACAO_VISITA){
			pontos = VALOR_VISITA
			informacao = 'Parabéns! Você concluiu o projeto!'
		}
		this.setState({pontos})
		const interval = setInterval(() => {
			this.setState(state => {
				let velocimetro = state.velocimetro
				if(velocimetro === 100){
					clearInterval(interval)
				}else{
					velocimetro += 1
				}
				return {
					velocimetro,
					informacao,
				}
			})
		}, 1)
	}
	render() {
		const {
			velocimetro,
			pontos,
			informacao,
		} = this.state
		const {
			qualAba,
			navigation,
		} = this.props
		return (
			<View style={{ flex: 1, backgroundColor: lightdark }}>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1,}}>
						<ProgressCircle
							percent={velocimetro}
							radius={50}
							borderWidth={10}
							color="#3399FF"
							bgColor="#000000"
						>
						</ProgressCircle>
					</View>
					<View style={{ flex: 1 }}>
						<Text style={{ color: white}}>
							{/* por em negrito */}
							{`Ação concluída! +${pontos} XP`}
						</Text>
						<Text style={{ color: white}}>
							{informacao}
						</Text>
					</View>
				</View>
				<View style={{ flex: 0.25 }}>
					{/* botao com sombra para parecer mais cartoon */}
					<TouchableOpacity
						style={{backgroundColor: blue}}
							onPress={() => navigation.navigate('Prospectos', {qualAba})}>
						<Text style={{ color: white}}>
							Continuar
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}


const mapStateToProps = (state, { navigation, }) => {
	return {
		qualAba: navigation.state.params.qualAba,
		situacao_id: navigation.state.params.situacao_id,
	}
}

export default connect(mapStateToProps, null)(PontuacaoScreen)
