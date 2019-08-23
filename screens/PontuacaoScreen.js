import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import { primary, white, lightdark } from '../helpers/colors';
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
import CPButton from '../components/CPButton';

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

	componentDidMount() {
		const {
			situacao_id,
		} = this.props
		const {
			velocimetro,
		} = this.state
		let pontos = 0
		let informacao = ''
		if (situacao_id === SITUACAO_MENSAGEM) {
			pontos = VALOR_MENSAGEM
			informacao = 'A pessoa está agora na aba LIGAR.'
		}
		if (situacao_id === SITUACAO_LIGAR) {
			pontos = VALOR_LIGAR
			informacao = 'A pessoa está agora na aba VISITA.'
		}
		if (situacao_id === SITUACAO_VISITA) {
			pontos = VALOR_VISITA
			informacao = 'Você concluiu o projeto!'
		}
		this.setState({ pontos })
		const interval = setInterval(() => {
			this.setState(state => {
				let velocimetro = state.velocimetro
				if (velocimetro === 100) {
					clearInterval(interval)
				} else {
					velocimetro += 1
				}
				return {
					velocimetro,
					informacao,
				}
			})
		}, 5)
	}

	ajudadorDeSubmissao = () => {
		const { 
			situacao_id,
			usuario, 
			qualAba, 
			navigation,
		} = this.props

		if(situacao_id === SITUACAO_MENSAGEM){
			if (usuario.mensagens === 5) {
				const conquista = {
					tipo: 1,
					nivel: 1
				}
				navigation.navigate('Conquistas', { qualAba, conquista })
			}
			if (usuario.mensagens === 35) {
				const conquista = {
					tipo: 1,
					nivel: 2
				}
				navigation.navigate('Conquistas', { qualAba, conquista })
			}
			if (usuario.mensagens === 100) {
				const conquista = {
					tipo: 1,
					nivel: 3
				}
				navigation.navigate('Conquistas', { qualAba, conquista })
			}
		}
		if(situacao_id === SITUACAO_LIGAR){
			if (usuario.ligacoes === 5) {
				const conquista = {
					tipo: 2,
					nivel: 1
				}
				navigation.navigate('Conquistas', { qualAba, conquista })
			}
			if (usuario.ligacoes === 35) {
				const conquista = {
					tipo: 2,
					nivel: 2
				}
				navigation.navigate('Conquistas', { qualAba, conquista })
			}
			if (usuario.ligacoes === 100) {
				const conquista = {
					tipo: 2,
					nivel: 3
				}
				navigation.navigate('Conquistas', { qualAba, conquista })
			}
		}
		if(situacao_id === SITUACAO_VISITA){
			if (usuario.visitas === 5) {
				const conquista = {
					tipo: 3,
					nivel: 1
				}
				navigation.navigate('Conquistas', { qualAba, conquista })
			}
			if (usuario.visitas === 35) {
				const conquista = {
					tipo: 3,
					nivel: 2
				}
				navigation.navigate('Conquistas', { qualAba, conquista })
			}
			if (usuario.visitas === 100) {
				const conquista = {
					tipo: 3,
					nivel: 3
				}
				navigation.navigate('Conquistas', { qualAba, conquista })
			}
		}

		navigation.navigate('Prospectos', { qualAba })
	}

	render() {
		const {
			velocimetro,
			pontos,
			informacao,
		} = this.state

		return (
			<View style={{ flex: 1, backgroundColor: lightdark, alignItems: 'center', padding: 20 }}>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Text style={{ color: white, fontWeight: 'bold', textAlign: 'center', fontSize: 22, marginVertical: 16 }}>
						Parabéns!
					</Text>
					<ProgressCircle
						percent={velocimetro}
						radius={50}
						borderWidth={10}
						color="#3399FF"
						bgColor={lightdark}
					>
					</ProgressCircle>

					<Text style={{ color: white, fontWeight: 'bold', textAlign: 'center', fontSize: 18, marginVertical: 16 }}>
						{`Ação concluída! +${pontos} XP`}
					</Text>
					<Text style={{ color: white, textAlign: 'center', paddingHorizontal: 8 }}>
						{informacao}
					</Text>
				</View>

				<TouchableOpacity
					onPress={this.ajudadorDeSubmissao}
					style={{
						width: '100%',
						backgroundColor: primary,
						height: 45,
						borderRadius: 6,
						justifyContent: 'center',
						shadowOffset: { width: 5, height: 5, },
						shadowColor: 'rgba(0,0,0,0.3)',
						shadowOpacity: 1.5,
					}}
				>
					<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
						Continuar
					</Text>
				</TouchableOpacity>

			</View>
		)
	}
}


const mapStateToProps = (state, { navigation }) => {

	let usuario = state.usuario
	return {
		qualAba: navigation.state.params.qualAba,
		situacao_id: navigation.state.params.situacao_id,
		usuario,
	}
}

export default connect(mapStateToProps, null)(PontuacaoScreen)
