import React from 'react';
import Loading from '../components/Loading';
import { green, black, white, lightdark, dark, gray, red } from '../helpers/colors';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView,
	NetInfo,
	Alert
} from 'react-native';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import empty from '../assets/images/empty.png'
import { Header, Title, Left, Body, Right } from 'native-base'
import arrow from '../assets/images/arrow-back.png'
import { stylesImportar } from '../components/Styles'
import {
	VALOR_VISITA,
	VALOR_LIGAR,
	VALOR_MENSAGEM,
} from '../helpers/constants'
import {
	atualizarClubeNaAPI,
	removerParticipanteDoClubeNaAPI,
	removerParticipanteEBloquearDoClubeNaAPI,
	removerPessoaDaListaNegraNaAPI,
} from '../helpers/api'

class ClubeScreen extends React.Component {

	static navigationOptions = ({ navigation, }) => {
		const { params = { clube } } = navigation.state
		return {
			header: null
		}
	}

	state = {
		clube: null,
		carregando: true,
		semInternet: false,
	}

	componentDidMount() {
		const {
			clube,
		} = this.props
		this.setState({
			clube,
			carregando: false,
		})
	}

	atualizarClube() {
		const {
			clube,
		} = this.state
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if (isConnected) {
						this.setState({ carregando: true })
						atualizarClubeNaAPI({ clube_id: clube._id })
							.then(retorno => {
								if (retorno.ok) {
									this.setState({
										clube: retorno.resultado.clube,
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

	perguntarSeQuerRemover(no_id) {
		Alert.alert(
			'Remover',
			'Realmente deseja REMOVER essa pessoa?',
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{ text: 'Sim', onPress: () => this.removerParticipante(no_id) },
			],
			{ cancelable: false },
		)
	}

	perguntarSeQuerBloquear(no_id) {
		Alert.alert(
			'Remover',
			'Realmente deseja REMOVER e BLOQUEAR essa pessoa?',
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{ text: 'Sim', onPress: () => this.removerEBloquearParticipante(no_id) },
			],
			{ cancelable: false },
		)
	}

	perguntarSeQuerAtivar(no_id) {
		Alert.alert(
			'Remover',
			'Realmente deseja tirar essa pessoa dessa lista negra?',
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{ text: 'Sim', onPress: () => this.removerPessoaDaListaNegra(no_id) },
			],
			{ cancelable: false },
		)
	}

	removerParticipante = async (no_id) => {
		const {
			clube,
		} = this.state
		const dados = {
			no_id,
			clube_id: clube._id,
		}
		this.setState({ carregando: true })
		const retorno = await removerParticipanteDoClubeNaAPI(dados)
		this.atualizarClube()
	}

	removerEBloquearParticipante = async (no_id) => {
		const {
			clube,
		} = this.state
		const dados = {
			no_id,
			clube_id: clube._id,
		}
		this.setState({ carregando: true })
		const retorno = await removerParticipanteEBloquearDoClubeNaAPI(dados)
		this.atualizarClube()
	}

	removerPessoaDaListaNegra = async (no_id) => {
		const {
			clube,
		} = this.state
		const dados = {
			no_id,
			clube_id: clube._id,
		}
		this.setState({ carregando: true })
		const retorno = await removerPessoaDaListaNegraNaAPI(dados)
		this.atualizarClube()
	}

	render() {
		const {
			clube,
			carregando,
			semInternet,
		} = this.state
		const { usuario } = this.props

		return (
			<View style={{ flex: 1, backgroundColor: dark }}>
				<Header style={[stylesImportar.header, { backgroundColor: dark }]} iosBarStyle="light-content">
					<Left>
						<TouchableOpacity
							hitSlop={{ right: 15, bottom: 10, top: 10, left: 10 }}
							style={stylesImportar.containerIcon}
							onPress={() => this.props.navigation.goBack()}>
							{
								Platform.OS === "ios" ?
									<Icon type="font-awesome" name={"angle-left"}
										color={white} size={36}
									/>
									:
									<Image source={arrow} style={{ height: 16, width: 16, marginHorizontal: 5 }} />
							}
						</TouchableOpacity>
					</Left>
					<Body>
						<Title style={stylesImportar.headerTitle}>
							{clube ? clube.nome : 'carregando ...'}
						</Title>
					</Body>
					<Right>
						<TouchableOpacity
							onPress={() => this.atualizarClube()}>
							<Icon
								name='retweet'
								type='font-awesome'
								color={white}
								size={22}
							/>
							<Text style={{ color: white }}>Atualizar Clube</Text>
						</TouchableOpacity>
					</Right>
				</Header>
				{
					carregando &&
					<Loading title='Atualizando Clube' />
				}
				{
					!carregando &&
					clube &&
					<ScrollView style={{ flex: 1, backgroundColor: dark, paddingHorizontal: 20 }}>
						<Text style={{ color: white, fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>
							Participantes
							</Text>
						<View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>
							{
								clube.nos &&
								clube.nos.length > 0 &&
								clube.nos
									.map(no => {
										let pontos = 0
										if (no.mensagens) {
											pontos += no.mensagens * VALOR_MENSAGEM
										}
										if (no.ligacoes) {
											pontos += no.ligacoes * VALOR_LIGAR
										}
										if (no.visitas) {
											pontos += no.visitas * VALOR_VISITA
										}
										no.pontos = pontos
										return no
									})
									.sort((a, b) => (a.pontos < b.pontos) ? 1 : -1)
									.map(no => {
										return (
											<View style={{
												flexDirection: 'row', borderTopWidth: 1,
												borderTopColor: dark,
												padding: 12,
											}} key={no._id}>
												{
													clube.no_id === usuario._id &&
													<TouchableOpacity
														onPress={() => { this.perguntarSeQuerRemover(no._id) }}
														style={{ justifyContent: 'center', marginRight: 12 }}
														hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} >
														<Icon name="trash" type="font-awesome" color={red} size={20} />
													</TouchableOpacity>
												}
												{
													clube.no_id === usuario._id &&
													<TouchableOpacity
														onPress={() => { this.perguntarSeQuerBloquear(no._id) }}
														style={{ justifyContent: 'center', marginRight: 12 }}
														hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} >
														<Icon name="ban" type="font-awesome" color={red} size={20} />
													</TouchableOpacity>
												}
												<TouchableOpacity
													style={{
														flex: 1,
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'space-between',
													}}
													onPress={() => this.props.navigation.navigate('PerfilClube', { no })}
												>
													<Icon name='user-circle' type='font-awesome' color={white} containerStyle={{ marginRight: 2 }} size={20} />
													<Text numberOfLines={1} style={{ color: white, flex: 1, }}> {no.nome} </Text>
													<Text style={{ color: white }}> {no.pontos} XP </Text>
												</TouchableOpacity>
											</View >
										)
									})
							}
						</View>
						{
							clube.nos_id &&
							clube.nos_id.length === 0 &&
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<Image source={empty} style={{ height: 100, width: 100 }} />
								<Text style={{ color: gray, fontSize: 16, marginVertical: 15 }}>
									Clube sem participantes
								</Text>
							</View>
						}
					</ScrollView>
				}
				{
					!carregando &&
					clube &&
					clube.bloqueados &&
					clube.bloqueados.length > 0 && clube.no_id && clube.no_id === usuario._id &&
					<ScrollView style={{ flex: 1, backgroundColor: dark, paddingHorizontal: 20 }}>
						<Text style={{ color: white, fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>
							Lista Negra
					</Text>
						<View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>
							{
								clube.bloqueados
									.sort((a, b) => (a.pontos < b.pontos) ? 1 : -1)
									.map(no => {
										return (
											<View style={{
												flexDirection: 'row', borderTopWidth: 1,
												borderTopColor: dark,
												padding: 12,
											}} key={no._id}>
												{
													clube.no_id === usuario._id &&
													<TouchableOpacity
														onPress={() => { this.perguntarSeQuerAtivar(no._id) }}
														style={{ justifyContent: 'center', marginRight: 12 }}
														hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} >
														<Icon name="minus" type="font-awesome" color={green} size={20} />
													</TouchableOpacity>
												}

												<View style={{
													flex: 1,
													flexDirection: 'row',
													alignItems: 'center',
													justifyContent: 'space-between',
												}} >
													<Icon name='user-circle' type='font-awesome' color={white} containerStyle={{ marginRight: 5 }} size={20} />
													<Text numberOfLines={1} style={{ color: white, flex: 1, }}> {no.nome} </Text>
												</View>
											</View >)
									})
							}
						</View>
					</ScrollView>
				}
			</View>
		)
	}
}

const mapStateToProps = (state, { navigation }) => {
	let usuario = state.usuario
	const {
		clube,
	} = navigation.state.params
	return {
		clube,
		usuario
	}
}

export default connect(mapStateToProps, null)(ClubeScreen)
