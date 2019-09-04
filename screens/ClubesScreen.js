import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, dark, primary, gray, red } from '../helpers/colors';
import {
	View,
	Text,
	NetInfo,
	TouchableOpacity,
	TextInput,
	Alert,
	ScrollView,
	Image
} from 'react-native';
import {
	clubesNaAPI,
	buscarClubesNaAPI,
	participarDeClubeNaAPI,
	criarClubeNaAPI,
	removerClubeNaAPI,
	alterarNomeDoClubeNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements';
import { stylesMarcar } from '../components/Styles';
import empty from '../assets/images/empty.png'
import sad from '../assets/images/sad.png'

class ClubesScreen extends React.Component {

	static navigationOptions = () => {
		return {
			headerTintColor: white,
			header: null,
		}
	}

	state = {
		clubes: [],
		clubesQueParticipo: [],
		mostrarBuscar: false,
		mostrarCriar: false,
		nome: '',
		busca: '',
		clubesBuscados: [],
		carregando: false,
		semInternet: false,
		clubeSelecionado: null
	}

	criarClube() {
		const {
			nome,
		} = this.state
		const {
			usuario,
		} = this.props
		if (nome === '') {
			return Alert.alert('Aviso', 'Preencha o nome do clube')
		}
		this.setState({ carregando: true })
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if (isConnected) {
						criarClubeNaAPI({ nome, no_id: usuario._id })
							.then(retorno => {
								if (retorno.ok) {
									Alert.alert('Sucesso', 'Clube cadastrado com sucesso')
									this.setState({
										mostrarCriar: false,
										nome: '',
									})
									this.buscarMeusClubes()
								}
								if (!retorno.ok) {
									Alert.alert('Aviso', retorno.mensagem)
									this.setState({ carregando: false })
								}
							})
					} else {
						this.setState({
							carregando: false,
						})
					}
				})
		} catch (err) {
			Alert.alert('Internet', 'Verifique sua internet!')
		}
	}

	buscarClubes() {
		const {
			busca,
		} = this.state
		if (busca === '') {
			return Alert.alert('Aviso', 'Preencha o campo de busca')
		}

		this.setState({ carregando: true })
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if (isConnected) {
						buscarClubesNaAPI({ busca })
							.then(retorno => {
								if (retorno.ok) {
									this.setState({
										clubesBuscados: retorno.resultado.clubes,
									})
								}
								this.setState({ carregando: false })
							})
					} else {
						this.setState({
							carregando: false,
						})
					}
				})
		} catch (err) {
			Alert.alert('Internet', 'Verifique sua internet!')
		}
	}

	selecionarClube(clube_id) {
		Alert.alert(
			'Participar do Clube',
			'Realmente deseja participar desse clube?',
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{ text: 'Sim', onPress: () => this.participarDoClube(clube_id) },
			],
			{ cancelable: false },
		)
	}

	participarDoClube(clube_id) {
		const {
			usuario,
		} = this.props
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					this.setState({ carregando: true })
					if (isConnected) {
						const dados = {
							clube_id,
							no_id: usuario._id,
						}
						participarDeClubeNaAPI(dados)
							.then(retorno => {
								if (retorno.ok) {
									this.buscarMeusClubes()
								}
								if (!retorno.ok) {
									Alert.alert('Aviso', retorno.mensagem)
								}
								this.setState({
									carregando: false,
									mostrarBuscar: false,
									clubesBuscados: [],
									busca: '',
								})
							})
					} else {
						this.setState({
							carregando: false,
						})
					}
				})
		} catch (err) {
			Alert.alert('Internet', 'Verifique sua internet!')
		}
	}

	componentDidMount() {
		this.buscarMeusClubes()
	}

	buscarMeusClubes() {
		const {
			usuario
		} = this.props
		this.setState({ semInternet: false, })
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if (isConnected) {
						this.setState({ carregando: true })
						clubesNaAPI({ no_id: usuario._id })
							.then(retorno => {
								if (retorno.ok) {
									this.setState({
										clubes: retorno.resultado.clubes,
										clubesQueParticipo: retorno.resultado.clubesQueParticipo,
										carregando: false
									})
								}
							})
					} else {
						this.setState({ semInternet: true })
					}
				})
		} catch (err) {
			this.setState({ semInternet: true })
		}
	}

	perguntarSeQuerRemover(clube_id) {
		Alert.alert(
			'Remover',
			'Realmente deseja remover essa pessoa?',
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{ text: 'Sim', onPress: () => this.removerClube(clube_id) },
			],
			{ cancelable: false },
		)
	}

	removerClube = async (clube_id) => {
		const dados = {
			clube_id
		}
		this.setState({ carregando: true })
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if (isConnected) {
						this.setState({ carregando: true })
						const retorno = removerClubeNaAPI(dados)
						this.buscarMeusClubes()
						Alert.alert('Removeido', 'Clube removido com sucesso!')
						this.setState({ carregando: false })
					} else {
						this.setState({
							carregando: false,
						})
					}
				})
		} catch (err) {
			Alert.alert('Internet', 'Verifique sua internet!')
		}
	}

	editarClube = async (clube_id) => {
		const {
			nome,
		} = this.state

		const dados = {
			clube_id,
			nome
		}
		this.setState({ carregando: true })
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if (isConnected) {

						this.setState({ carregando: true })
						const retorno = alterarNomeDoClubeNaAPI(dados)
						this.buscarMeusClubes()
						Alert.alert('Sucesso', 'Nome do clube alterado com sucesso!')
						this.setState({ mostrarCriar: false })
					} else {
						this.setState({
							carregando: false,
						})
					}
				})
		} catch (err) {
			Alert.alert('Internet', 'Verifique sua internet!')
		}
	}

	render() {
		let { clubesBuscados, clubeSelecionado } = this.state
		const {
			clubes,
			clubesQueParticipo,
			mostrarCriar,
			mostrarBuscar,
			nome,
			busca,
			carregando,
			semInternet,

		} = this.state

		const { usuario } = this.props

		if (clubesBuscados) {
			clubesBuscados = clubesBuscados.sort((a, b) => {
				return a.nome > b.nome ? 1 : -1
			})
		}

		return (
			<View style={{ flex: 1, backgroundColor: dark }}>
				{
					semInternet &&

					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: gray, fontSize: 18 }}>Sem conexão</Text>
						<Image source={sad} style={{ height: 120, width: 130, marginVertical: 15 }} />
						<TouchableOpacity
							onPress={() => this.buscarMeusClubes()}>
							<Text style={{ color: gray, fontSize: 18 }}>Tentar Novamente</Text>
						</TouchableOpacity>
					</View>
				}
				{
					!semInternet &&
					carregando &&
					<Loading title={'Buscando clubes ...'} />
				}
				{
					!semInternet &&
					!carregando &&
					!mostrarBuscar &&
					!mostrarCriar &&
					<View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}>
							<Text style={{ color: white, fontSize: 30, fontWeight: 'bold' }}>
								Clubes
							</Text>
							<TouchableOpacity
								onPress={() => this.buscarMeusClubes()}>
								<Icon
									name='retweet'
									type='font-awesome'
									color={white}
									size={22}
								/>
								<Text style={{ color: white }}>Atualizar Clubes</Text>
							</TouchableOpacity>
						</View>
						{
							clubes &&
								clubes.length === 0 && 
								clubesQueParticipo &&
								clubesQueParticipo.length === 0 ?
								<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
									<Text style={{ color: gray, fontSize: 18 }}>Você não possui nenhum clube...</Text>
									<Image source={empty} style={{ height: 100, width: 100, marginVertical: 15 }} />
									<Text style={{ color: gray, fontSize: 18 }}>Crie ou participe de algum.</Text>
								</View>
								:
								<ScrollView>

									<Text style={{ color: white, fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>
										Meus clubes
									</Text>
									<View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>
										{
											clubes &&
											clubes.map(clube =>
												<View style={{
													borderTopWidth: 1,
													borderTopColor: dark,
													padding: 12,
													flexDirection: 'row',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
												key={clube._id} >
												{clube.no_id === usuario._id &&
														<>
														<TouchableOpacity style={{ marginRight: 8 }} onPress={() => this.perguntarSeQuerRemover(clube._id)}>
															<Icon name="trash" type="font-awesome" color={red} size={20} />
														</TouchableOpacity>
														<TouchableOpacity style={{ marginRight: 8 }} onPress={() => this.setState({ mostrarCriar: true, nome: clube.nome, clubeSelecionado: clube._id })}>
															<Icon name="edit" type="font-awesome" color={gray} size={20} />
														</TouchableOpacity>
														</>
												}
												<TouchableOpacity
													style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}
													onPress={() => this.props.navigation.navigate('Clube', { clube, atualizarDados: this.buscarMeusClubes })} >
													<Text style={{ color: white }}> {clube.nome} </Text>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<Text style={{ color: white }}> {clube.nos ? clube.nos.length : 0} membros </Text>
														<Icon type="font-awesome" name="angle-right" size={22} containerStyle={{ marginLeft: 5 }} color={white} />
													</View>
												</TouchableOpacity>
											</View>
											)
										}
									</View>

									<Text style={{ color: white, fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
										Clubes que participo
									</Text>

									<View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>
										{
											clubesQueParticipo &&
											clubesQueParticipo.map(clube =>
												<View style={{
													borderTopWidth: 1,
													borderTopColor: dark,
													padding: 12,
													flexDirection: 'row',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
												key={clube._id} >
												<TouchableOpacity
													style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}
													onPress={() => this.props.navigation.navigate('Clube', { clube })} >
													<Text style={{ color: white }}> {clube.nome} </Text>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<Text style={{ color: white }}> {clube.nos ? clube.nos.length : 0} membros </Text>
														<Icon type="font-awesome" name="angle-right" size={22} containerStyle={{ marginLeft: 5 }} color={white} />
													</View>
												</TouchableOpacity>
											</View>
											)
										}
									</View>

								</ScrollView>
						}

						<View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
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
									marginRight: 8,
								}}
								onPress={() => this.setState({ mostrarCriar: true })}>
								<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
									Criar
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
								onPress={() => this.setState({ mostrarBuscar: true })}>
								<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
									Participar
									</Text>
							</TouchableOpacity>
						</View>

					</View>
				}
				{
					mostrarCriar &&
					!mostrarBuscar && !carregando &&
					<View style={{ paddingTop: 20, paddingHorizontal: 20, }}>
						<Text style={{ color: white, fontSize: 30, fontWeight: 'bold' }}>
							{clubeSelecionado ? 'Editar Clube' : 'Criar Clube'}
						</Text>
						<View style={[stylesMarcar.containerInput, { marginTop: 15 }]}>
							<TouchableOpacity
								activeOpacity={1}
								onPress={() => this.inputLocal.focus()}
							>
								<Text style={stylesMarcar.labelMarcar}>Nome</Text>
							</TouchableOpacity>
							<View style={stylesMarcar.inputContainerStyle}>
								<TextInput
									ref={(input) => { this.inputLocal = input; }}
									keyboardAppearance='dark'
									placeholder=""
									style={stylesMarcar.inputMarcar}
									value={nome}
									onChangeText={texto => this.setState({ nome: texto })}
								/>
							</View>
						</View>

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
								onPress={() => this.setState({ mostrarCriar: false, nome: '', clubeSelecionado: null })}
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
								onPress={() => {
									clubeSelecionado ? this.editarClube(clubeSelecionado) : this.criarClube()
								}}
							>
								<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
									{clubeSelecionado ? 'Editar' : 'Confirmar'}
								</Text>
							</TouchableOpacity>

						</View>

					</View>
				}
				{
					!mostrarCriar &&
					mostrarBuscar &&
					<View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
						{
							!carregando &&
							<View>
								<Text style={{ color: white, fontSize: 30, fontWeight: 'bold' }}>
									Buscar Clube
									</Text>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
									<View style={[stylesMarcar.containerInput, { flex: 1 }]}>
										<TouchableOpacity
											activeOpacity={1}
											onPress={() => this.inputBusca.focus()}
										>
										</TouchableOpacity>
										<View style={stylesMarcar.inputContainerStyle}>
											<TextInput
												ref={(input) => { this.inputBusca = input; }}
												onSubmitEditing={() => this.buscarClubes()}
												returnKeyType={'go'}
												keyboardAppearance='dark'
												autoCorrect={false}
												placeholder="Nome do Clube"
												placeholderTextColor={gray}
												style={stylesMarcar.inputMarcar}
												value={busca}
												onChangeText={texto => this.setState({ busca: texto })}
											/>
										</View>

									</View>

									<View>
										<TouchableOpacity
											style={{
												backgroundColor: primary,
												height: 45,
												borderRadius: 6,
												justifyContent: 'center',
												shadowOffset: { width: 5, height: 5, },
												shadowColor: 'rgba(0,0,0,0.3)',
												shadowOpacity: 1.0,
												marginLeft: 8
											}}
											onPress={() => this.buscarClubes()}
										>
											<Icon name="search" type="font-awesome" color={white} containerStyle={{ paddingHorizontal: 12 }} size={20} />
										</TouchableOpacity>
									</View>
								</View>

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
										onPress={() => this.setState({ mostrarBuscar: false, })}
									>
										<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
											Voltar
											</Text>
									</TouchableOpacity>



								</View>
							</View>
						}

						<ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }} >
							{
								!carregando &&
								clubesBuscados.length > 0 &&
								clubesBuscados.map(clube =>

									<View key={clube._id} style={{ marginTop: 5, borderWidth: 1, borderColor: gray, borderRadius: 6, padding: 5, flexDirection: 'row', flexWrap: "wrap" }}>
										<View style={{ flex: 1 }}>
											<View style={{ flexDirection: 'row' }}>
												<Icon name="shield" type="font-awesome" size={16} color={gray} containerStyle={{ marginRight: 5 }} />
												<Text style={{ color: white }} numberOfLines={1}>
													{clube.nome}
												</Text>
											</View>

											<View style={{ flexDirection: 'row' }}>
												<Icon name="user" type="font-awesome" size={16} color={gray} containerStyle={{ marginRight: 5 }} />
												<Text style={{ color: white }} numberOfLines={1}>
													DONO - {clube.no.nome}
												</Text>
											</View>
										</View>

										<View style={{ alignItems: 'flex-end', justifyContent: 'center', flex: 1 }}>
											<TouchableOpacity
												style={{ backgroundColor: primary, padding: 5, borderRadius: 6 }}
												hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
												onPress={() => this.selecionarClube(clube._id)} >
												<Text style={{ color: white, textAlign: 'center' }}>
													Participar
											</Text>
											</TouchableOpacity>
										</View>
									</View>
								)
							}
							{
								!carregando &&
								clubesBuscados.length === 0 &&
								<Text style={{ color: white, flex: 1, textAlign: 'center', }}>
									Nenhum Clube encontrado!
									</Text>
							}
						</ScrollView>

					</View>
				}
			</View>
		)
	}
}

const mapStateToProps = ({ usuario }) => {
	return { usuario }
}

export default connect(mapStateToProps, null)(ClubesScreen)
