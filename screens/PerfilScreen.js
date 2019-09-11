import React from 'react';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native'
import { black, white, lightdark, dark, gray, gold, yellow, bronze, silver, darkGray, primary } from '../helpers/colors';
import {
	View,
	Text,
	TextInput,
	Alert,
	NetInfo,
} from 'react-native';
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'
import {
	VALOR_VISITA,
	VALOR_LIGAR,
	VALOR_MENSAGEM,
	NOME,
	EMAIL,
} from '../helpers/constants'
import {
	alterarNomeNaAPI,
	alterarEmailNaAPI,
	alterarSenhaNaAPI,
} from '../helpers/api'
import { Icon, Input } from 'react-native-elements';
import { stylesProspecto, styles } from '../components/Styles';
import Loading from '../components/Loading';
import {
	alterarUsuarioNoAsyncStorage,
	porProspectoDaSincronizacao,
} from '../actions'
import {
	sincronizar,
} from '../helpers/helper'
import { NavigationActions } from "react-navigation"

class PerfilScreen extends React.Component {

	static navigationOptions = ({ navigation }) => {
		if (navigation.state && navigation.state.params && navigation.state.params.no) {
			return {
				title: navigation.state.params.no.nome,
				headerTintColor: white,
				headerStyle: {
					backgroundColor: black,
					borderBottomWidth: 0,
				},
				headerBackTitle: null
			}
		} else {
			return {
				headerTintColor: white,
				header: null,
			}
		}
	}

	state = {
		carregando: false,
		perfil: true,
		config: false,
		mostrarEditar: true,
		editarNome: false,
		editarEmail: false,
		editarSenha: false,
		nome: '',
		email: '',
		confirmarEmail: '',
		antigaSenha: '',
		senha: '',
		confirmarSenha: ''
	}
	componentDidMount() {
		this.setState({ nome: this.props.usuario.nome })
	}

	alterarNome = () => {
		if (this.state.nome === '') {
			Alert.alert('Nome inválido', 'O campo está com erro.')
			return true
		}
		if (this.state.nome !== '') {
			try {
				NetInfo.isConnected
					.fetch()
					.then(isConnected => {
						if (isConnected) {
							this.setState({ carregando: true, })
							const {
								usuario,
								alterarUsuarioNoAsyncStorage,
							} = this.props
							const {
								nome,
							} = this.state
							const dados = {
								no_id: usuario._id,
								nome,
							}
							alterarNomeNaAPI(dados)
								.then(retorno => {
									if (retorno.ok) {
										usuario.nome = nome.toUpperCase()
										alterarUsuarioNoAsyncStorage(usuario)
											.then(() => {
												Alert.alert('Sucesso!', 'Nome alterado.')
												this.setState({
													carregando: false,
													editarNome: false,
													mostrarEditar: true,
												})
											})
									}
									if (!retorno.ok) {
										Alert.alert('Aviso', retorno.mensagem)
										this.setState({ carregando: false })
									}
								})
						} else {
							Alert.alert('Internet', 'Verifique sua internet')
						}
					})
			} catch (err) {
				Alert.alert('Internet', 'Verifique sua internet')
			}
		}
	}

	alterarEmail = () => {
		let camposComErro = ''
		let mostrarMensagemDeErro = false
		const {
			email,
			confirmarEmail,
		} = this.state

		if (email === '') {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'Email'
		}

		if (confirmarEmail !== email || confirmarEmail === '') {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'Repetir Email'
		}

		if (mostrarMensagemDeErro) {
			Alert.alert('Erro', `Campos invalidos: ${camposComErro}`)
		}

		if (!mostrarMensagemDeErro) {
			try {
				NetInfo.isConnected
					.fetch()
					.then(isConnected => {
						if (isConnected) {
							this.setState({ carregando: true, })
							const {
								usuario,
								alterarUsuarioNoAsyncStorage,
							} = this.props
							const dados = {
								no_id: usuario._id,
								email,
							}
							alterarEmailNaAPI(dados)
								.then(retorno => {
									if (retorno.ok) {
										usuario.email = email.toLowerCase()
										alterarUsuarioNoAsyncStorage(usuario)
											.then(() => {
												Alert.alert('Sucesso!', 'Email alterado.')
												this.setState({
													carregando: false,
													editarEmail: false,
													mostrarEditar: true,
												})
											})
									}
									if (!retorno.ok) {
										Alert.alert('Aviso', retorno.mensagem)
										this.setState({ carregando: false })
									}
								})
						} else {
							Alert.alert('Internet', 'Verifique sua internet')
						}
					})
			} catch (err) {
				Alert.alert('Internet', 'Verifique sua internet')
			}
		}
	}

	alterarSenha = () => {
		let camposComErro = ''
		let mostrarMensagemDeErro = false
		const {
			antigaSenha,
			senha,
			confirmarSenha,
		} = this.state

		if (antigaSenha === '') {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'Senha Atual'
		}

		if (senha === '') {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'Senha Nova'
		}

		if (confirmarSenha !== senha || confirmarSenha === '') {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'Repetir Senha'
		}

		if (mostrarMensagemDeErro) {
			Alert.alert('Erro', `Campos invalidos: ${camposComErro}`)
			return true
		}
		if (!mostrarMensagemDeErro) {
			try {
				NetInfo.isConnected
					.fetch()
					.then(isConnected => {
						if (isConnected) {
							this.setState({ carregando: true, })
							const {
								usuario,
								alterarUsuarioNoAsyncStorage,
							} = this.props
							const dados = {
								no_id: usuario._id,
								senha: antigaSenha,
								senhaNova: senha,
							}
							alterarSenhaNaAPI(dados)
								.then(retorno => {
									if (retorno.ok) {
										usuario.senha = senha
										alterarUsuarioNoAsyncStorage(usuario)
											.then(() => {
												Alert.alert('Sucesso!', 'Senha alterada.')
												this.setState({
													carregando: false,
													editarSenha: false,
													mostrarEditar: true,
												})
											})
									}
									if (!retorno.ok) {
										Alert.alert('Aviso', retorno.mensagem)
										this.setState({ carregando: false })
									}
								})
						} else {
							Alert.alert('Internet', 'Verifique sua internet')
						}
					})
			} catch (err) {
				Alert.alert('Internet', 'Verifique sua internet')
			}
		}
	}

	perguntarSeQuerSair = () => {
		Alert.alert(
			'Sair',
			'Realmente deseja sair?',
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{ text: 'Sim', onPress: () => this.sair() },
			],
			{ cancelable: false },
		)

	}

	sair = () => {
		const sair = true
		this.setState({ carregando: true })
		sincronizar(this.props, () => {
			this.setState({ carregando: false })
			this.props.navigation.navigate('Login')
		}, sair)
	}

	render() {
		const {
			usuario,
			navigation,
		} = this.props
		const {
			carregando,
			perfil,
			config,
			editarNome,
			editarEmail,
			editarSenha,
			mostrarEditar,
			nome,
			email,
			senha,
			confirmarEmail,
			confirmarSenha,
			antigaSenha,
		} = this.state

		const container = {
			padding: 10,
			borderWidth: 1,
			borderColor: gray,
			borderRadius: 6,
			marginTop: 10
		}

		const linha = {
			paddingVertical: 5,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			flexWrap: 'wrap',
		}

		const linhaBorder = {
			padding: 10,
			flexDirection: 'row',
			alignItems: 'center',
			borderWidth: 1,
			borderColor: gray,
			borderRadius: 6,
			flexWrap: 'wrap',
		}

		const texto = {
			color: white,
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
		const dados = [
			{
				label: 'Nome',
				valor: usuario.nome,
			},
			{
				label: 'Email',
				valor: usuario.email,
			},
			{
				label: 'Igreja',
				valor: usuario.nome_igreja,
			},
		]
		const items = [

			{
				label: 'Ações contabilizadas',
				valor: null,
			},
			{
				label: 'Mensagens Enviadas',
				valor: usuario.mensagens ? usuario.mensagens : 0,
			},
			{
				label: 'Ligações Atendidas',
				valor: usuario.ligacoes ? usuario.ligacoes : 0,
			},
			{
				label: 'Visitas Feitas',
				valor: usuario.visitas ? usuario.visitas : 0,
			},
			{
				label: 'Outras ações',
				valor: null,
			},
			{
				label: 'Importações',
				valor: usuario.importacoes ? usuario.importacoes : 0,
			},
			{
				label: 'Cadastros Novos',
				valor: usuario.cadastros ? usuario.cadastros : 0,
			},
			{
				label: 'Removidos',
				valor: usuario.removidos ? usuario.removidos : 0,
			},
			{
				label: 'Números Inválidos',
				valor: usuario.numeros_invalidos ? usuario.numeros_invalidos : 0,
			},
			{
				label: 'Ligações não atendidas',
				valor: usuario.ligacoes_nao_atendidas ? usuario.ligacoes_nao_atendidas : 0,
			},
			{
				label: 'Visitas marcadas sem ligar',
				valor: usuario.visitas_sem_ligar ? usuario.visitas_sem_ligar : 0,
			},
			{
				label: 'Falei mas não marquei',
				valor: usuario.ligacoes_sem_visita ? usuario.ligacoes_sem_visita : 0,
			},
			{
				label: 'Visitas Desmarcadas',
				valor: usuario.visitas_desmarcadas ? usuario.visitas_desmarcadas : 0,
			},
			{
				label: 'Marquei visita mas não fui',
				valor: usuario.marquei_mas_nao_visitei ? usuario.marquei_mas_nao_visitei : 0,
			},
			{
				label: 'Visitei mas não convidei',
				valor: usuario.visitas_sem_convite ? usuario.visitas_sem_convite : 0,
			},
		]

		let estouVendoMeuPerfil = true
		if (navigation.state && navigation.state.params && navigation.state.params.no) {
			estouVendoMeuPerfil = false
		}

		let cor = {
			mensagens: !usuario.mensagens || usuario.mensagens < 5 ? darkGray :
				usuario.mensagens >= 5 && usuario.mensagens <= 34 ? bronze :
					usuario.mensagens >= 35 && usuario.mensagens <= 99 ? silver :
						usuario.mensagens >= 100 ? gold : gold
			,
			ligacoes: !usuario.ligacoes || usuario.ligacoes < 5 ? darkGray :
				usuario.ligacoes >= 5 && usuario.ligacoes <= 34 ? bronze :
					usuario.ligacoes >= 35 && usuario.ligacoes <= 99 ? silver :
						usuario.ligacoes >= 100 ? gold : gold
			,
			visitas: !usuario.visitas || usuario.visitas < 5 ? darkGray :
				usuario.visitas >= 5 && usuario.visitas <= 34 ? bronze :
					usuario.visitas >= 35 && usuario.visitas <= 99 ? silver :
						usuario.visitas >= 100 ? gold : gold

		}


		return (
			<LinearGradient style={{ flex: 1, paddingBottom: 10 }} colors={[black, dark, lightdark, '#343434']}>
				{
					estouVendoMeuPerfil &&
					<View style={[stylesProspecto.containerBadge]}>

						<TouchableOpacity
							style={{
								borderBottomWidth: perfil ? 2 : 0,
								borderBottomColor: perfil ? primary : 'transparent',
								marginRight: 0, flex: 1, padding: 10
							}}
							activeOpacity={1}
							onPress={() => {
								this.setState({
									perfil: true,
									config: false,
								})
							}} >
							<Text style={{
								color: perfil === true ? primary : white,
								fontSize: 12,
								textAlign: 'center',
								fontWeight: perfil === true ? 'bold' : 'normal'
							}}>Dados</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{
								borderBottomWidth: config ? 2 : 0,
								borderBottomColor: config ? primary : 'transparent',
								marginRight: 0, flex: 1, padding: 5
							}}
							activeOpacity={1}
							onPress={() => {
								this.setState({
									perfil: false,
									config: true,
								})
							}} >
							<Text
								style={{
									color: config === true ? primary : white,
									fontSize: 13,
									textAlign: 'center',
									fontWeight: config === true ? 'bold' : 'normal'
								}} >
								Configurações
								</Text>
						</TouchableOpacity>
					</View>
				}
				{
					perfil &&
					<ScrollView style={{ paddingHorizontal: 20 }}>
						<View>
							<Text style={{ color: white, fontSize: 20, fontWeight: 'bold', marginVertical: 8 }}>
								{estouVendoMeuPerfil ? 'Meu Progresso' : 'Progresso do participante'}
							</Text>
						</View>
						<View>
							<Text style={{ color: white }}>
								Última Atualização: {usuario.ultima_sincronizacao_data} - {usuario.ultima_sincronizacao_hora}
							</Text>
						</View>
						<View style={container}>
							<View style={[{
								flexDirection: "column", alignItems: "flex-start", paddingVertical: 5,
								justifyContent: 'space-between',
								flexWrap: 'wrap',
							}]}
							>
								{
									dados.map(item => {
										let qualStilo = linha
										if (item.valor === null) {
											qualStilo = linhaBorder
										}
										return (
											<View key={item.label} style={{ paddingVertical: 5 }}>
												<Text style={{ color: white, fontWeight: "bold" }}>
													{item.label}
												</Text>
												<Text numberOfLines={1} style={texto}>
													{item.valor}
												</Text>
											</View>
										)
									})
								}
								<Text style={{ color: white, fontWeight: "bold" }}>
									Pontos
							</Text>
								<Text numberOfLines={1} style={{ color: primary }}>
									{pontos} XP
							</Text>
							</View>
						</View>
						<View style={container}>
							{

								<View>
									<Text style={[texto, { fontWeight: 'bold' }]}>
										Conquistas
									</Text>
									<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
										<View style={{ alignItems: "center" }}>
											<View style={{
												backgroundColor: cor.mensagens, height: 80, width: 80, borderRadius: 80 / 2, alignItems: "center", justifyContent: "center",
												borderWidth: 2, borderColor: '#fff'
											}}>
												<Icon type="font-awesome" name="envelope" size={30} color={white} />
												<View style={{ flexDirection: "row" }}>
													<Icon name="star" type="font-awesome" color={usuario.mensagens >= 5 ? yellow : gray} size={12} />
													<Icon name="star" type="font-awesome" color={usuario.mensagens >= 35 ? yellow : gray} size={12} containerStyle={{ marginHorizontal: 5 }} />
													<Icon name="star" type="font-awesome" color={usuario.mensagens >= 100 ? yellow : gray} size={12} />
												</View>
											</View>
											<View style={{ backgroundColor: cor.mensagens, borderRadius: 20, padding: 2, marginTop: 4, borderWidth: 1, borderColor: white, width: 55 }}>
												<Text style={{ color: white, textAlign: "center", fontSize: 12 }}>
													{!usuario.mensagens ? '0' : usuario.mensagens} /{
														!usuario.mensagens || usuario.mensagens < 5 ? ' 5 ' : '' ||
															usuario.mensagens >= 5 && usuario.mensagens <= 34 ? ' 35 ' : '' ||
																usuario.mensagens >= 35 ? ' 100 ' : ''
													}
												</Text>
											</View>
										</View>
										<View style={{ alignItems: "center" }}>
											<View style={{
												backgroundColor: cor.ligacoes, height: 80, width: 80, borderRadius: 80 / 2, alignItems: "center", justifyContent: "center",
												borderWidth: 2, borderColor: '#fff'
											}}>
												<Icon type="font-awesome" name="phone" size={30} color={white} />
												<View style={{ flexDirection: "row" }}>
													<Icon name="star" type="font-awesome" color={usuario.ligacoes >= 5 ? yellow : gray} size={12} />
													<Icon name="star" type="font-awesome" color={usuario.ligacoes >= 35 ? yellow : gray} size={12} containerStyle={{ marginHorizontal: 5 }} />
													<Icon name="star" type="font-awesome" color={usuario.ligacoes >= 100 ? yellow : gray} size={12} />
												</View>
											</View>
											<View style={{ backgroundColor: cor.ligacoes, borderRadius: 20, padding: 2, marginTop: 4, borderWidth: 1, borderColor: white, width: 55 }}>
												<Text style={{ color: white, textAlign: "center", fontSize: 12 }}>
													{!usuario.ligacoes ? '0' : usuario.ligacoes} /
												{
														!usuario.ligacoes || usuario.ligacoes < 5 ? ' 5 ' : '' ||
															usuario.ligacoes >= 5 && usuario.ligacoes <= 34 ? ' 35 ' : '' ||
																usuario.ligacoes >= 35 ? ' 100 ' : ''
													}
												</Text>
											</View>
										</View>
										<View style={{ alignItems: "center" }}>
											<View style={{
												backgroundColor: cor.visitas, height: 80, width: 80, borderRadius: 80 / 2, alignItems: "center", justifyContent: "center",
												borderWidth: 2, borderColor: '#fff'
											}}>
												<Icon type="font-awesome" name="home" size={30} color={white} />
												<View style={{ flexDirection: "row" }}>
													<Icon name="star" type="font-awesome" color={usuario.visitas >= 5 ? yellow : gray} size={12} />
													<Icon name="star" type="font-awesome" color={usuario.visitas >= 35 ? yellow : gray} size={12} containerStyle={{ marginHorizontal: 5 }} />
													<Icon name="star" type="font-awesome" color={usuario.visitas >= 100 ? yellow : gray} size={12} />
												</View>
											</View>
											<View style={{ backgroundColor: cor.visitas, borderRadius: 20, padding: 2, marginTop: 4, borderWidth: 1, borderColor: white, width: 55 }}>
												<Text style={{ color: white, textAlign: "center", fontSize: 12 }}>
													{!usuario.visitas ? '0' : usuario.visitas} /
												{
														!usuario.visitas || usuario.visitas < 5 ? ' 5 ' : '' ||
															usuario.visitas >= 5 && usuario.visitas <= 34 ? ' 35 ' : '' ||
																usuario.visitas >= 35 ? ' 100 ' : ''
													}</Text>
											</View>
										</View>

									</View>
								</View>

							}
						</View>
						<View style={container}>
							{
								items.map(item => {
									let qualStilo = linha
									if (item.valor === null) {
										qualStilo = linhaBorder
									}
									return (
										<View key={item.label} style={qualStilo}>
											<Text style={texto}>
												{item.label}
											</Text>
											<Text style={texto}>
												{item.valor}
											</Text>
										</View>
									)
								})
							}
						</View>
					</ScrollView>
				}
				{
					carregando &&
					<Loading title='Processando' />
				}
				{
					!carregando &&
					config &&
					<View style={[container, { margin: 20 }]}>
						{
							mostrarEditar &&
							<View>
								<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}
									onPress={() => this.setState({
										editarNome: true,
										editarEmail: false,
										editarSenha: false,
										mostrarEditar: false,
									})} >
									<Text style={{ color: white, fontSize: 20 }}>
										Editar Nome
									</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}
									onPress={() => this.setState({
										editarNome: false,
										editarEmail: true,
										editarSenha: false,
										mostrarEditar: false,
									})} >
									<Icon name="at" type="font-awesome" color={gray} size={15} containerStyle={{ marginRight: 5 }} />
									<Text style={{ color: white, fontSize: 20 }}>
										Editar Email
									</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}
									onPress={() => this.setState({
										editarNome: false,
										editarEmail: false,
										editarSenha: true,
										mostrarEditar: false,
									})} >
									<Icon name="lock" type="font-awesome" color={gray} size={16.5} containerStyle={{ marginRight: 5 }} />
									<Text style={{ color: white, fontSize: 20 }}>
										Editar Senha
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => this.perguntarSeQuerSair()}
									style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
									<Icon name="sign-out" type="font-awesome" color={gray} size={15} containerStyle={{ marginRight: 5 }} />
									<Text style={{ color: gray, fontSize: 20 }}>
										Sair
									</Text>
								</TouchableOpacity>
							</View>
						}
						{
							editarNome &&
							<View>
								<Input
									containerStyle={styles.containerInput}
									inputContainerStyle={styles.inputContainerStyle}
									keyboardAppearance='dark'
									returnKeyType="next"
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label={NOME}
									value={nome}
									inputStyle={styles.input}
									labelStyle={styles.label}
									onChangeText={texto => this.setState({ nome: texto })}

								/>

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
										onPress={() => this.setState({
											mostrarEditar: true,
											editarNome: false,
											editarEmail: false,
											editarSenha: false,
										})}
									>
										<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
											Voltar
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={{
											backgroundColor: primary,
											height: 45,
											borderRadius: 6,
											flex: 1,
											justifyContent: 'center',
											shadowOffset: { width: 5, height: 5, },
											shadowColor: 'rgba(0,0,0,0.3)',
											shadowOpacity: 1.0,
										}}
										onPress={() => this.alterarNome()} >
										<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
											Confirmar
										</Text>
									</TouchableOpacity>

								</View>
							</View>
						}
						{
							editarEmail &&
							<View>
								<Text style={{ color: white, alignItems: 'center', padding: 5, }}>
									Email: {usuario.email}
								</Text>
								<Input
									containerStyle={styles.containerInput}
									inputContainerStyle={styles.inputContainerStyle}
									keyboardType='email-address'
									keyboardAppearance='dark'
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label="NOVO EMAIL"
									value={email}
									inputStyle={styles.input}
									labelStyle={styles.label}
									onChangeText={texto => this.setState({ email: texto })}
								/>

								<Input
									containerStyle={styles.containerInput}
									inputContainerStyle={styles.inputContainerStyle}
									keyboardType='email-address'
									keyboardAppearance='dark'
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label="CONFIRME NOVO EMAIL"
									value={confirmarEmail}
									inputStyle={styles.input}
									labelStyle={styles.label}
									onChangeText={texto => this.setState({ confirmarEmail: texto })}
								/>

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
										onPress={() => this.setState({
											mostrarEditar: true,
											editarNome: false,
											editarEmail: false,
											editarSenha: false,
											email: '',
											confirmarEmail: '',
										})}
									>
										<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
											Voltar
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={{
											backgroundColor: primary,
											height: 45,
											borderRadius: 6,
											flex: 1,
											justifyContent: 'center',
											shadowOffset: { width: 5, height: 5, },
											shadowColor: 'rgba(0,0,0,0.3)',
											shadowOpacity: 1.0,
										}}
										onPress={() => this.alterarEmail()}
									>
										<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
											Confirmar
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						}
						{
							editarSenha &&
							<View>

								<Input
									containerStyle={styles.containerInput}
									inputContainerStyle={styles.inputContainerStyle}
									keyboardType='default'
									secureTextEntry={true}
									keyboardAppearance='dark'
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label="ANTIGA SENHA"
									value={antigaSenha}
									inputStyle={styles.input}
									labelStyle={styles.label}
									onChangeText={texto => this.setState({ antigaSenha: texto })}
								/>
								<Input
									containerStyle={styles.containerInput}
									inputContainerStyle={styles.inputContainerStyle}
									keyboardType='default'
									secureTextEntry={true}
									keyboardAppearance='dark'
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label="NOVA SENHA"
									value={senha}
									inputStyle={styles.input}
									labelStyle={styles.label}
									onChangeText={texto => this.setState({ senha: texto })}
								/>
								<Input
									containerStyle={styles.containerInput}
									inputContainerStyle={styles.inputContainerStyle}
									keyboardType='default'
									secureTextEntry={true}
									keyboardAppearance='dark'
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label="CONFIRME NOVA SENHA"
									value={confirmarSenha}
									inputStyle={styles.input}
									labelStyle={styles.label}
									onChangeText={texto => this.setState({ confirmarSenha: texto })}
								/>

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
										onPress={() => this.setState({
											mostrarEditar: true,
											editarNome: false,
											editarEmail: false,
											editarSenha: false,
											antigaSenha: '',
											senha: '',
											confirmarSenha: '',
										})}
									>
										<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
											Voltar
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={{
											backgroundColor: primary,
											height: 45,
											borderRadius: 6,
											flex: 1,
											justifyContent: 'center',
											shadowOffset: { width: 5, height: 5, },
											shadowColor: 'rgba(0,0,0,0.3)',
											shadowOpacity: 1.0,
										}}
										onPress={() => this.alterarSenha()}
									>
										<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
											Confirmar
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						}
					</View>
				}
			</LinearGradient>
		)
	}
}

const mapStateToProps = ({ usuario, prospectos }, { navigation }) => {
	let no = usuario
	if (navigation.state && navigation.state.params && navigation.state.params.no) {
		no = navigation.state.params.no
	}
	return {
		usuario: no,
		prospectos,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		porProspectoDaSincronizacao: (prospectos) => dispatch(porProspectoDaSincronizacao(prospectos)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PerfilScreen)
