import React from 'react';
import {
	View,
	Text,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { Button, Card, Icon, Input, CheckBox } from 'react-native-elements'
import { white, red, gray, black, lightdark, dark, gold, primary } from '../helpers/colors'
import { connect } from 'react-redux'
import {
	SITUACAO_REMOVIDO,
	SITUACAO_LIGAR,
} from '../helpers/constants'
import {
	alterarProspectoNoAsyncStorage,
	adicionarSituacoesAoAsyncStorage,
} from '../actions'
import CPButton from '../components/CPButton';
import { LinearGradient } from 'expo'
import {
	pegarDataEHoraAtual
} from '../helpers/helper'

class PerguntasScreen extends React.Component {

	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Perguntas',
			headerTintColor: white,
		}
	}

	state = {
		carregando: false,
	}

	componentDidMount() {
		const {
			estados
		} = this.props
		this.setState(estados)
	}

	ajudadorDeSubmit() {
		this.setState({ carregando: true })
		const {
			prospecto,
			alterarProspectoNoAsyncStorage,
			adicionarSituacoesAoAsyncStorage,
			navigation,
		} = this.props
		const {
			situacao_id_nova,
			situacao_id_extra,
			paraOndeVoltar,
			qualAba,
			paraOndeNavegar,
			alertTitulo,
			alertMensagem,
		} = this.state

		prospecto.situacao_id = situacao_id_nova
		let situacoes = []
		const situacao = {
			prospecto_id: prospecto.celular_id,
			situacao_id: situacao_id_nova,
			data_criacao: pegarDataEHoraAtual()[0],
			hora_criacao: pegarDataEHoraAtual()[1],
		}
		situacoes.push(situacao)
		if (situacao_id_extra) {
			const situacaoExtra = {
				prospecto_id: prospecto.celular_id,
				situacao_id: situacao_id_extra,
				data_criacao: pegarDataEHoraAtual()[0],
				hora_criacao: pegarDataEHoraAtual()[1],
			}
			situacoes.push(situacaoExtra)
		}
		if (
			paraOndeNavegar === null ||
			situacao_id_nova === SITUACAO_REMOVIDO
		) {
			this.props.adicionarSituacoesAoAsyncStorage(situacoes)
				.then(() => {
					if (prospecto.situacao_id !== SITUACAO_LIGAR) {
						delete prospecto.local
						delete prospecto.data
						delete prospecto.hora
					}
					alterarProspectoNoAsyncStorage(prospecto)
						.then(() => {
							Alert.alert(alertTitulo, alertMensagem)
							this.setState({ carregando: false })
							navigation.navigate(paraOndeVoltar, { qualAba })
						})
				})
		}
		if (
			paraOndeNavegar &&
			situacao_id_nova !== SITUACAO_REMOVIDO
		) {
			dados = {
				prospecto_id: prospecto._id,
				situacao_id_nova,
				situacoes,
				paraOndeVoltar,
				qualAba,
				alertTitulo,
				alertMensagem,
			}
			navigation.navigate(paraOndeNavegar, dados)
		}
	}

	render() {
		const {
			prospecto,
			navigation,
			perguntas,
		} = this.props
		const estados = this.state
		const {
			carregando
		} = estados
		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				<View style={{ flex: 1, paddingHorizontal: 20 }}>

					{
						carregando &&
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<ActivityIndicator
								size="large"
								color={primary}
							/>
						</View>
					}

					{
						perguntas &&
						estados &&
						!carregando &&
						perguntas.map(pergunta => {
							let resposta = <View key={pergunta.titulo}></View>
							if (estados[[pergunta.mostrar]]) {
								resposta =
									<Card key={pergunta.titulo} containerStyle={{ backgroundColor: dark, borderColor: 'transparent', borderRadius: 1, margin: 0, marginTop: 0, padding: 8 }}>
										<Text style={{
											color: white, textAlign: 'center', fontWeight: 'bold', padding: 0, paddingBottom: 4,
										}}>
											{pergunta.titulo}
										</Text>
										<View style={{ backgroundColor: lightdark, alignItems: 'flex-start' }}>
											{
												pergunta.opcoes.map(opcao => {
													return <CheckBox
														key={opcao.titulo}
														title={opcao.titulo}
														textStyle={{ color: white }}
														checked={estados[[opcao.estado]]}
														onPress={() => this.setState(opcao.onPress)}
														checkedIcon='dot-circle-o'
														checkedColor={primary}
														uncheckedIcon='circle-o'
														containerStyle={{
															backgroundColor: 'transparent',
															padding: 0,
															borderColor: 'transparent',
														}}
													/>
												})
											}
										</View>
									</Card>
							}
							return resposta
						})
					}
					{
						estados &&
						estados.mostrarBotaoConfirmar &&
						!carregando &&
						<CPButton
							title='Confirmar'
							OnPress={() => { this.ajudadorDeSubmit() }}
						/>
					}
				</View>
			</LinearGradient>
		)
	}

}

function mapStateToProps({ prospectos }, { navigation }) {
	const { params } = navigation.state
	const {
		prospecto_id,
		estados,
		perguntas,
	} = params
	return {
		prospecto: prospectos && prospectos.find(prospecto => prospecto._id === prospecto_id),
		estados,
		perguntas,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
		adicionarSituacoesAoAsyncStorage: (situacoes) => dispatch(adicionarSituacoesAoAsyncStorage(situacoes)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PerguntasScreen)
