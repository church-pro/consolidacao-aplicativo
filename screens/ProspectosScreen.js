import React from 'react';
import {
	View,
	TouchableOpacity,
	ActivityIndicator,
	Text,
	ScrollView,
	Image,
	NetInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { white, gold, dark, lightdark, black, primary, gray, red } from '../helpers/colors'
import ListaDeProspectos from '../components/ListaDeProspectos'
import { connect } from 'react-redux'
import { stylesProspecto } from '../components/Styles'
import {
	SITUACAO_IMPORTAR,
	SITUACAO_CADASTRO,
	SITUACAO_MENSAGEM,
	SITUACAO_LIGAR,
	SITUACAO_VISITA,
	CHURCH_PRO,
	VALOR_MENSAGEM,
	VALOR_LIGAR,
	VALOR_VISITA,
} from '../helpers/constants'
import {
	sincronizar,
	sincronizacaoRapida,
} from '../helpers/helper'
import {
	sincronizacaoRapidaNaAPI,
} from '../helpers/api'
import consolidacao from '../assets/images/user.png'
import seta from '../assets/images/seta.png'
import {
	alterarUsuarioNoAsyncStorage,
	porProspectoDaSincronizacao,
} from '../actions'
import Loading from '../components/Loading'
import { Icon } from 'react-native-elements'
import Modal from "react-native-modal";

class ProspectosScreen extends React.Component {

	state = {
		carregando: true,
		buscaMensagem: true,
		buscaTelefone: false,
		buscaVisita: false,
		buscaAlcancados: false,
		sincronizando: false,
		mostraModal: false,
	}

	componentDidMount = () => {
		const {
			usuario,
			alterarUsuarioNoAsyncStorage,
		} = this.props
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if (isConnected) {
						if (usuario.email) {
							sincronizacaoRapidaNaAPI({usuario,})
								.then(retorno => {
									if(retorno.ok){
										if(retorno.resultado.no.notificacoes && retorno.resultado.no.notificacoes.length > 0){
											retorno.resultado.no.notificacoes
												.forEach(notificacaoParaValidar => {
													let adicionar = true
													if(usuario.notificacoes){
														usuario.notificacoes.forEach(item => {
															if(item.notificacao._id === notificacaoParaValidar.notificacao._id){
																adicionar = false
															}
														})
													}
													if(adicionar){
														if(usuario.notificacoes){
															usuario.notificacoes.push(notificacaoParaValidar)
														}else{
															usuario.notificacoes = [notificacaoParaValidar]
														}
													}
												})
										}
										if(retorno.resultado.notificacoesParaTodos){
											retorno.resultado.notificacoesParaTodos
												.forEach(notificacaoParaTodos => {
													let adicionar = true
													if(usuario.notificacoes){
														usuario.notificacoes.forEach(item => {
															if(item.notificacao._id === notificacaoParaTodos._id){
																adicionar = false
															}
														})
													}
													if(adicionar){
														console.log('adicionando notificcao para todos')
														const novoItem = {
															visto: false,
															notificacao: notificacaoParaTodos,
														}
														if(usuario.notificacoes){
															usuario.notificacoes.push(novoItem)
														}else{
															usuario.notificacoes = [novoItem]
														}
													}
												})
										}
										if(retorno.resultado.no.missoes && retorno.resultado.no.missoes.length > 0){
											retorno.resultado.no.missoes
												.forEach(missaoParaValidar => {
													let adicionar = true
													if(usuario.missoes){
														usuario.missoes.forEach(item => {
															if(item.missao._id === missaoParaValidar.missao._id){
																adicionar = false
															}
														})
													}
													if(adicionar){
														if(usuario.missoes){
															usuario.missoes.push(missaoParaValidar)
														}else{
															usuario.missoes = [missaoParaValidar]
														}
													}
												})
										}
										if(retorno.resultado.missoesParaTodos){
											retorno.resultado.missoesParaTodos
												.forEach(missaoParaTodos => {
													let adicionar = true
													if(usuario.missoes){
														usuario.missoes.forEach(item => {
															if(item.missao._id === missaoParaTodos._id){
																adicionar = false
															}
														})
													}
													if(adicionar){
														const novoItem = {
															visto: false,
															mensagens: 0,
															ligacoes: 0,
															visitas: 0,
															missao: missaoParaTodos,
														}
														if(usuario.missoes){
															usuario.missoes.push(novoItem)
														}else{
															usuario.missoes = [novoItem]
														}
													}
												})
										}
										alterarUsuarioNoAsyncStorage(usuario)
									}
								})
								.catch(err => {
									console.log('err: ', err)
									return false
								})
						}
					} else {
						console.log('Internet', 'Verifique sua internet!')
					}
				})
		} catch (err) {
			console.log('err: ', err)
		}
		this.setState({ carregando: false })
	}

	static navigationOptions = () => {
		return {
			header: null,
		}
	}

	comecarSincronizacao = () => {
		this.setState({ sincronizando: true })
		if (this.props.usuario) {
			sincronizar(this.props, () => { this.setState({ sincronizando: false }) })
		}
	}

	ajudadorDeModal = () => {
		this.setState({ mostraModal: !this.state.mostraModal })
	}

	irParaAtualizacoes = () => {
		this.setState({ mostraModal: false })

		this.props.navigation.navigate('Atualizacoes')
	}

	render() {
		let {
			prospectosFiltrados,
			navigation,
			usuario,
		} = this.props
		const {
			carregando,
			sincronizando,
		} = this.state

		let { buscaMensagem, buscaTelefone, buscaVisita, buscaAlcancados } = this.state

		let filtrar = false;
		if (buscaMensagem !== false || buscaTelefone !== false || buscaVisita !== false || buscaAlcancados !== false) {
			filtrar = true;
		}
		if(filtrar){
			prospectosFiltrados = prospectosFiltrados.filter(item => {
				if(buscaMensagem){
					if(
						item.situacao_id === SITUACAO_IMPORTAR ||
						item.situacao_id === SITUACAO_CADASTRO
					){
						return true
					}
				}
				if(buscaTelefone){
					if(item.situacao_id === SITUACAO_MENSAGEM){
						return true
					}
				}
				if(buscaVisita){
					if(item.situacao_id === SITUACAO_LIGAR){
						return true
					}
				}
				if(buscaAlcancados){
					if(item.situacao_id === SITUACAO_VISITA){
						return true
					}
				}
				return false
			})
		}

		let pontos = 0
		if (usuario.mensagens) {
			pontos += usuario.mensagens * VALOR_MENSAGEM
		}
		if (usuario.ligacoes) {
			pontos += usuario.ligacoes * VALOR_LIGAR
		}
		if (usuario.visitas) {
			pontos += usuario.visitas * VALOR_VISITA
		}
		if(usuario.missoes){
			usuario.missoes.forEach(item => {
				if(
					item.mensagens === item.missao.mensagens &&
					item.ligacoes === item.missao.ligacoes &&
					item.visitas === item.missao.visitas
				){
					pontos += item.missao.pontos
				}
			})
		}

		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				{
					sincronizando &&
					<View style={{
						flex: 0.1,
						flexDirection: 'row',
						alignItems: 'center',
						alignSelf: 'center',
					}}>
						<ActivityIndicator />
						<Text style={{ marginLeft: 5, color: white }}>
							Sincronizando ...
					</Text>
					</View>
				}
				{
					carregando &&
					<Loading title={'Buscando pessoas'} />
				}
				{
					!carregando &&
					<React.Fragment>
						{
							!sincronizando &&
							<View style={{
								padding: 10,
								alignItems: 'center',
							}}>
								<TouchableOpacity
									hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
									style={{ flexDirection: 'row', }}
									onPress={() => this.comecarSincronizacao()}>
									<Text style={{ marginLeft: 10, fontSize: 10, color: white }}>
										Última Sincronização: {usuario.ultima_sincronizacao_data} - {usuario.ultima_sincronizacao_hora}
									</Text>
									<Text
										style={{
											marginLeft: 10,
											backgroundColor: primary,
											padding: 2,
											fontSize: 10,
											borderRadius: 6,
											justifyContent: 'center',
											shadowOffset: { width: 5, height: 5, },
											shadowColor: 'rgba(0,0,0,0.3)',
											shadowOpacity: 1.0,
											color: white
										}}>
										Sincronizar
										</Text>
								</TouchableOpacity>
							</View>
						}
						<View style={{
							padding: 5,
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={{ color: white }}>
									{usuario.nome}
								</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={{ color: primary, marginRight: 8 }}>
									{pontos} XP
								</Text>
							</View>
						</View>

						<View style={[stylesProspecto.containerBadge]}>

							<TouchableOpacity
								style={{
									borderBottomWidth: buscaMensagem ? 2 : 0,
									borderBottomColor: buscaMensagem ? primary : 'transparent',
									marginRight: 0, flex: 1, padding: 10
								}}
								activeOpacity={1}
								onPress={() => {
									this.setState({
										buscaMensagem: !buscaMensagem,
										buscaTelefone: false,
										buscaVisita: false,
										buscaAlcancados: false,
									})
								}} >
								<Text style={{
									color: buscaMensagem === true ? primary : white,
									fontSize: 12,
									textAlign: 'center',
									fontWeight: buscaMensagem === true ? 'bold' : 'normal'
								}}>Mensagem</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{
									borderBottomWidth: buscaTelefone ? 2 : 0,
									borderBottomColor: buscaTelefone ? primary : 'transparent',
									marginRight: 0, flex: 1, padding: 5
								}}
								activeOpacity={1}
								onPress={() => {
									this.setState({
										buscaMensagem: false,
										buscaTelefone: !buscaTelefone,
										buscaVisita: false,
										buscaAlcancados: false,
									})
								}} >
								<Text
									style={{
										color: buscaTelefone === true ? primary : white,
										fontSize: 13,
										textAlign: 'center',
										fontWeight: buscaTelefone === true ? 'bold' : 'normal'
									}} >
									Ligar
							</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{
									borderBottomWidth: buscaVisita ? 2 : 0,
									borderBottomColor: buscaVisita ? primary : 'transparent',
									marginRight: 0, flex: 1, padding: 5
								}}
								activeOpacity={1}
								onPress={() => {
									this.setState({
										buscaMensagem: false,
										buscaTelefone: false,
										buscaVisita: !buscaVisita,
										buscaAlcancados: false,
									})
								}} >
								<Text
									style={{
										color: buscaVisita === true ? primary : white,
										fontSize: 12,
										textAlign: 'center',
										fontWeight: buscaVisita === true ? 'bold' : 'normal'
									}} >
									Visitar
							</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									borderBottomWidth: buscaAlcancados ? 2 : 0,
									borderBottomColor: buscaAlcancados ? primary : 'transparent',
									marginRight: 0, flex: 1, padding: 5
								}}
								activeOpacity={1}
								onPress={() => {
									this.setState({
										buscaMensagem: false,
										buscaTelefone: false,
										buscaVisita: false,
										buscaAlcancados: !buscaAlcancados,
									})
								}} >
								<Text
									style={{
										color: buscaAlcancados === true ? primary : white,
										fontSize: 12,
										textAlign: 'center',
										fontWeight: buscaAlcancados === true ? 'bold' : 'normal'
									}} >
									Alcançados
							</Text>
							</TouchableOpacity>
	
						</View>
						{
							prospectosFiltrados.length === 0 ?
								<View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
									<Text style={{ color: gray, fontSize: 20 }}>Você não possui</Text>
									<Text style={{ color: gray, fontSize: 20 }}>consolidações!</Text>
									<Image source={consolidacao} style={{ marginTop: 15, width: 120, height: 120, resizeMode: "contain", }} />
									<Text style={{ color: gray, fontSize: 14, padding: 15 }}>Para incluir, basta cadastrar ou importar </Text>

									<Image source={seta} style={{
										width: 100, height: 100, resizeMode: "contain",
										position: 'absolute', bottom: -120, right: -20
									}} />
								</View>
								:
								prospectosFiltrados &&
								<ListaDeProspectos
									prospectos={prospectosFiltrados}
									navigation={navigation}
								/>
						}
						{
							buscaMensagem &&
							<TouchableOpacity style={{
								backgroundColor: primary,
								borderRadius: 50 / 2,
								height: 50,
								width: 50,
								justifyContent: 'center',
								alignItems: 'center',
								position: 'absolute',
								bottom: 10,
								right: 5,
							}}
								onPress={() => navigation.navigate('ImportarProspectos')}
								hitSlop={{ top: 5, right: 5, bottom: 5, left: 0 }} >
								<Text style={{ fontSize: 22, fontWeight: 'bold', color: white, textAlign: 'center' }}>+</Text>
							</TouchableOpacity>
						}
					</React.Fragment>
				}
			</LinearGradient>
		)
	}
}

function mapStateToProps({ prospectos, usuario, }) {
	const prospectosFiltrados = prospectos.filter(prospecto =>
		prospecto.situacao_id === SITUACAO_IMPORTAR ||
		prospecto.situacao_id === SITUACAO_CADASTRO ||
		prospecto.situacao_id === SITUACAO_MENSAGEM ||
		prospecto.situacao_id === SITUACAO_LIGAR ||
		prospecto.situacao_id === SITUACAO_VISITA
	)
	return {
		prospectosFiltrados,
		prospectos,
		usuario,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		porProspectoDaSincronizacao: (prospectos) => dispatch(porProspectoDaSincronizacao(prospectos)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProspectosScreen)
