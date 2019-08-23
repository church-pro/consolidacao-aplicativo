import React from 'react';
import {
	View,
	Text,
	Alert,
	ActivityIndicator,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import { Card, CheckBox } from 'react-native-elements'
import { white, black, lightdark, dark, primary, gray } from '../helpers/colors'
import { connect } from 'react-redux'
import {
	SITUACAO_IMPORTAR,
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
	sincronizacaoRapidaNaAPI,
} from '../helpers/api'
import CPButton from '../components/CPButton'
import { LinearGradient } from 'expo'
import {
	pegarDataEHoraAtual,
	montarObjetoParaPerguntas,
	sincronizacaoRapida,
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

	ajudadorDeSubmit = async () => {
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
			qualAba,
			paraOndeNavegar,
			paraOndeVoltar,
			alertTitulo,
			alertMensagem,
		} = this.state

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
			if (paraOndeNavegar === null) {
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
				}
				if (situacao_id_nova === SITUACAO_VISITA) {
					if (usuario.visitas) {
						usuario.visitas += 1
					} else {
						usuario.visitas = 1
					}
				}
				prospecto.situacao_id = situacao_id_nova
				prospecto.dataParaFinalizarAAcao = pegarDataEHoraAtual(numeroDeDiasParaTerminar)[0]
				if ( situacao_id_nova === SITUACAO_VISITA) {
					delete prospecto.dataParaFinalizarAAcao
				}
				await sincronizacaoRapida(usuario, sincronizacaoRapidaNaAPI) 
				await alterarUsuarioNoAsyncStorage(usuario)
				await submeterSituacoes(situacoes)
				if (prospecto.situacao_id !== SITUACAO_LIGAR) {
					delete prospecto.local
					delete prospecto.data
					delete prospecto.hora
				}
				await alterarProspectoNoAsyncStorage(prospecto)
				this.setState({ carregando: false })
				const dados = {
					qualAba,
					situacao_id: situacao_id_nova,
				}	
				if(
					(
						situacao_id_nova === SITUACAO_MENSAGEM ||
						situacao_id_nova === SITUACAO_LIGAR ||
						situacao_id_nova === SITUACAO_VISITA 
					) && situacao_id_extra === null
				){
					navigation.navigate('Pontuacao', dados)
				}
				if(
					(
						situacao_id_nova === SITUACAO_IMPORTAR ||
						situacao_id_nova === SITUACAO_MENSAGEM ||
						situacao_id_nova === SITUACAO_LIGAR ||
						situacao_id_nova === SITUACAO_VISITA 
					) && situacao_id_extra !== null
				){
					let mensagem = 'Ação concluída! A pessoa está no próximo passo.'
					if(situacao_id_nova === SITUACAO_IMPORTAR){
						mensagem = 'Ação concluída! A pessoa está na aba MENSAGEM'
					}
					Alert.alert('Progresso', mensagem)
					navigation.navigate('Prospectos', {qualAba})
				}
			}

			/* marcar data e hora */
			if (paraOndeNavegar) {
				dados = {
					prospecto_id: prospecto._id,
					situacao_id_nova,
					situacao_id_extra,
					situacoes,
					paraOndeVoltar: 'Prospectos',
					qualAba,
					alertTitulo,
					alertMensagem,
				}
				this.setState({ carregando: false })
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
				<ScrollView style={styles.container}>
					{
						prospecto &&
						estados &&
						!carregando &&
						<View style={{ flex: 0.1, padding: 10, alignItems: 'center' }}>
							<Text style={{ color: white }}>
								{prospecto.nome}
							</Text>
						</View>
					}

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
					{
						estados &&
						!carregando &&
						<View style={{ flexDirection: 'row', marginTop: 25 }}>
							<TouchableOpacity
								style={{
									backgroundColor: gray,
									height: 45,
									borderRadius: 6,
									flex: 1,
									justifyContent: 'center',
									shadowOffset: { width: 5, height: 5, },
									shadowColor: 'rgba(0,0,0,0.3)',
									shadowOpacity: 1.0,
									marginRight: 8,
								}}
								onPress={() => this.props.navigation.goBack()} >
								<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
									Voltar
									</Text>
							</TouchableOpacity>
						</View>
					}
				</ScrollView>
			</LinearGradient>
		)
	}
}

function mapStateToProps({ prospectos, usuario, administracao }, { navigation }) {
	let prospectoSelecionado = null
	let estados = null
	let perguntas = null
	if (navigation.state.params) {
		const { params } = navigation.state
		if (params.prospecto_id) {
			prospectoSelecionado = prospectos.find(prospecto => prospecto._id === params.prospecto_id)
		}
	}
	if (prospectoSelecionado) {
		const retorno = montarObjetoParaPerguntas(prospectoSelecionado.situacao_id)
		estados = retorno.estados
		perguntas = retorno.perguntas
	}
	return {
		prospecto: prospectoSelecionado,
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
