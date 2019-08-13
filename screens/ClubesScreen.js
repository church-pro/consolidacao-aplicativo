import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, dark, primary, gray } from '../helpers/colors';
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
} from '../helpers/api'
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'
import { Icon } from 'react-native-elements';
import { stylesMarcar } from '../components/Styles';
import empty from '../assets/images/empty.png'

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
						Alert.alert('Internet', 'Verifique sua internet!')
						this.props.navigation.goBack()
					}
				})
		} catch (err) {
			Alert.alert('Internet', 'Verifique sua internet!')
			this.props.navigation.goBack()
		}
	}

	render() {
		const {
			clubes,
			clubesQueParticipo,
			mostrarCriar,
			mostrarBuscar,
			nome,
			busca,
			carregando,
			clubesBuscados,
		} = this.state

		return (
			<View style={{ flex: 1, backgroundColor: dark }}>
				{
					carregando &&
					<Loading title={'Buscando clubes ...'} />
				}
				{
					!carregando &&
					!mostrarBuscar &&
					!mostrarCriar &&
					<View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
						<Text style={{ color: white, fontSize: 30, fontWeight: 'bold' }}>
							Clubes
							</Text>

						{
							clubes.length === 0 && clubesQueParticipo.length === 0 ?
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
												<TouchableOpacity
													key={clube._id}
													style={{
														borderTopWidth: 1,
														borderTopColor: dark,
														padding: 12,
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'space-between',
													}}

													onPress={() => this.props.navigation.navigate('Clube', { clube })}
												>
													<Text style={{ color: white }}> {clube.nome} </Text>
													<Icon type="font-awesome" name="angle-right" size={22} color={white} />
												</TouchableOpacity>

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
												<TouchableOpacity
													style={{
														borderTopWidth: 1,
														borderTopColor: dark,
														padding: 12,
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'space-between',
													}}
													key={clube._id}
													onPress={() => this.props.navigation.navigate('Clube', { clube })}
												>
													<Text style={{ color: white }}>
														{clube.nome}
													</Text>
													<Icon type="font-awesome" name="angle-right" size={22} color={white} />
												</TouchableOpacity>
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
					!mostrarBuscar &&
					<View style={{ paddingTop: 20, paddingHorizontal: 20, }}>
						<Text style={{ color: white, fontSize: 30, fontWeight: 'bold' }}>
							Criar Clube
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
								onPress={() => this.setState({ mostrarCriar: false, })}
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
								onPress={() => this.criarClube()}
							>
								<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
									Confirmar
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

									<View key={clube._id} style={{ marginTop: 5, borderWidth: 1, borderColor: gray, borderRadius: 6, padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
										<View>
											<View style={{ flexDirection: 'row' }}>
												<Icon name="shield" type="font-awesome" size={16} color={gray} containerStyle={{ marginRight: 5 }} />
												<Text style={{ color: white }}>
													{clube.nome}
												</Text>
											</View>

											<View style={{ flexDirection: 'row' }}>
												<Icon name="user" type="font-awesome" size={16} color={gray} containerStyle={{ marginRight: 5 }} />
												<Text style={{ color: white }}>
													DONO - {clube.no.nome}
												</Text>
											</View>
										</View>

										<View style={{ justifyContent: 'center' }}>
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
