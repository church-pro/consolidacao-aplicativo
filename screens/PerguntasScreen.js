import React from 'react';
import {
	View,
	Text,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { Card, CheckBox } from 'react-native-elements'
import { white, black, lightdark, dark, primary } from '../helpers/colors'
import { connect } from 'react-redux'
import {
	SITUACAO_LIGAR,
	SITUACAO_MENSAGEM,
	SITUACAO_VISITA,
	SITUACAO_EVENTO,
	SITUACAO_REMOVIDO,
	SITUACAO_MENSAGEM_NUMERO_INVALIDO,
	SITUACAO_LIGAR_NUMERO_INVALIDO,
	SITUACAO_LIGAR_APENAS_TOCOU,
	SITUACAO_LIGAR_MARCOU_VISITA_SEM_FALAR,
	SITUACAO_LIGAR_FALEI_MAS_NAO_MARQUEI,
	SITUACAO_VISITA_DESMARCOU,
	SITUACAO_VISITA_NAO_FUI,
	SITUACAO_VISITEI_MAS_NAO_CONVIDEI,
	SITUACAO_EVENTO_NAO_VEIO,
} from '../helpers/constants'
import {
	alterarProspectoNoAsyncStorage,
	alterarUsuarioNoAsyncStorage,
} from '../actions'
import {
	submeterSituacoes,
} from '../helpers/api'
import CPButton from '../components/CPButton'
import { LinearGradient } from 'expo'
import {
	pegarDataEHoraAtual
} from '../helpers/helper'
import { stylesPerguntas, styles } from '../components/Styles';
import Loading from '../components/Loading';

class PerguntasScreen extends React.Component {

	static navigationOptions = ({ navigation }) => {
		return {
			header: null,
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
			alterarUsuarioNoAsyncStorage,
			navigation,
			usuario
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
		let numeroDeDiasParaTerminar = 1
		if (situacao_id_nova === SITUACAO_MENSAGEM) {
			numeroDeDiasParaTerminar = 2
			if (usuario.mensagens) {
				usuario.mensagens += 1
			} else {
				usuario.mensagens = 1
			}
		}
		if (situacao_id_nova === SITUACAO_LIGAR) {
			numeroDeDiasParaTerminar = 3
			if (usuario.ligacoes) {
				usuario.ligacoes += 1
			} else {
				usuario.ligacoes = 1
			}
		}
		if (situacao_id_nova === SITUACAO_VISITA) {
			if (usuario.visitas) {
				usuario.visitas += 1
			} else {
				usuario.visitas = 1
			}
		}
		if (situacao_id_nova === SITUACAO_EVENTO) {
			if (usuario.eventos) {
				usuario.eventos += 1
			} else {
				usuario.eventos = 1
			}
		}

		prospecto.dataParaFinalizarAAcao = pegarDataEHoraAtual(1)[0]
		if (situacao_id_nova === SITUACAO_VISITA) {
			delete prospecto.dataParaFinalizarAAcao
		}

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

			if (
				situacao_id_extra === SITUACAO_MENSAGEM_NUMERO_INVALIDO ||
				situacao_id_extra === SITUACAO_LIGAR_NUMERO_INVALIDO
			) {
				if (usuario.numeros_invalidos) {
					usuario.numeros_invalidos += 1
				} else {
					usuario.numeros_invalidos = 1
				}
			}
			if (situacao_id_extra === SITUACAO_LIGAR_APENAS_TOCOU) {
				if (usuario.ligacoes_nao_atendidas) {
					usuario.ligacoes_nao_atendidas += 1
				} else {
					usuario.ligacoes_nao_atendidas = 1
				}
			}
			if (situacao_id_extra === SITUACAO_LIGAR_MARCOU_VISITA_SEM_FALAR) {
				if (usuario.visitas_sem_ligar) {
					usuario.visitas_sem_ligar += 1
				} else {
					usuario.visitas_sem_ligar = 1
				}
			}
			if (situacao_id_extra === SITUACAO_LIGAR_FALEI_MAS_NAO_MARQUEI) {
				if (usuario.ligacoes_sem_visita) {
					usuario.ligacoes_sem_visita += 1
				} else {
					usuario.ligacoes_sem_visita = 1
				}
			}
			if (situacao_id_extra === SITUACAO_VISITA_DESMARCOU) {
				if (usuario.visitas_desmarcadas) {
					usuario.visitas_desmarcadas += 1
				} else {
					usuario.visitas_desmarcadas = 1
				}
			}
			if (situacao_id_extra === SITUACAO_VISITA_NAO_FUI) {
				if (usuario.marquei_mas_nao_visitei) {
					usuario.marquei_mas_nao_visitei += 1
				} else {
					usuario.marquei_mas_nao_visitei = 1
				}
			}
			if (situacao_id_extra === SITUACAO_VISITEI_MAS_NAO_CONVIDEI) {
				if (usuario.visitas_sem_convite) {
					usuario.visitas_sem_convite += 1
				} else {
					usuario.visitas_sem_convite = 1
				}
			}
			if (situacao_id_extra === SITUACAO_EVENTO_NAO_VEIO) {
				if (usuario.nao_vieram) {
					usuario.nao_vieram += 1
				} else {
					usuario.nao_vieram = 1
				}
			}
		}
		if (situacao_id_nova === null) {
			navigation.goBack()
		} else {
			if (situacao_id_nova === SITUACAO_REMOVIDO) {
				if (usuario.removidos) {
					usuario.removidos += 1
				} else {
					usuario.removidos = 1
				}
			}
			if (
				paraOndeNavegar === null ||
				situacao_id_nova === SITUACAO_REMOVIDO
			) {
				alterarUsuarioNoAsyncStorage(usuario)
					.then(() => {
						submeterSituacoes(situacoes)
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
				<View style={styles.container}>

					{
						carregando &&
						<Loading />
					}

					{
						perguntas &&
						estados &&
						!carregando &&
						perguntas.map(pergunta => {
							let resposta = <View key={pergunta.titulo}></View>
							if (estados[[pergunta.mostrar]]) {
								resposta =
									<Card key={pergunta.titulo} containerStyle={stylesPerguntas.card}>
										<Text style={stylesPerguntas.perguntaTitulo}>
											{pergunta.titulo}
										</Text>
										<View style={stylesPerguntas.containerRespostas}>
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
														size={25}
														containerStyle={stylesPerguntas.containerCheckbox}
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

function mapStateToProps({ prospectos, usuario, }, { navigation }) {
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
		usuario,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PerguntasScreen)
