import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, dark } from '../helpers/colors';
import {
	View,
	Text,
	NetInfo,
	TouchableOpacity,
	TextInput,
	Alert,
} from 'react-native';
import {
	clubesNaAPI,
	buscarClubesNaAPI,
	participarDeClubeNaAPI,
	criarClubeNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'

class ClubesScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
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
					onPress: () => console.log('Cancel Pressed'),
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
										carregando: false,
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
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				{
					!carregando &&
					!mostrarBuscar &&
					!mostrarCriar &&
					<View>
						<Text style={{ color: white, fontSize: 30 }}>
							Meus Clubes
						</Text>
						{
							clubes &&
							clubes.map(clube =>
								<TouchableOpacity
									key={clube._id}
									onPress={() => this.props.navigation.navigate('Clube', { clube })}>
									<Text style={{ color: white }}>
										{clube.nome}
									</Text>
								</TouchableOpacity>
							)
						}

						<Text style={{ color: white }}>
							Clubes que participo
						</Text>
						{
							clubesQueParticipo &&
							clubesQueParticipo.map(clube =>
								<TouchableOpacity
									key={clube._id}
									onPress={() => this.props.navigation.navigate('Clube', { clube })}>
									<Text style={{ color: white }}>
										{clube.nome}
									</Text>
								</TouchableOpacity>
							)
						}

						<TouchableOpacity
							onPress={() => this.setState({ mostrarCriar: true })}>
							<Text style={{ color: white }}>
								Criar
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.setState({ mostrarBuscar: true })}>
							<Text style={{ color: white }}>
								Participar
							</Text>
						</TouchableOpacity>
					</View>
				}
				{
					mostrarCriar &&
					!mostrarBuscar &&
					<View>
						<Text style={{ color: white }}>
							Criar Clube
							</Text>
						<TextInput
							value={nome}
							onChangeText={texto => this.setState({ nome: texto })} />
						<TouchableOpacity onPress={() => this.criarClube()}>
							<Text style={{ color: white }}>
								Criar
								</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.setState({ mostrarCriar: false, })}>
							<Text style={{ color: white }}>
								Voltar
								</Text>
						</TouchableOpacity>
					</View>
				}
				{
					!mostrarCriar &&
					mostrarBuscar &&
					<View>
						{
							!carregando &&
							<View>
								<Text style={{ color: white }}>
									Buscar Clube
										</Text>
								<TextInput
									value={busca}
									onChangeText={texto => this.setState({ busca: texto })} />
								<TouchableOpacity
									onPress={() => this.buscarClubes()}>
									<Text>
										Buscar
											</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => this.setState({ mostrarBuscar: false, })}>
									<Text style={{ color: white }}>
										Voltar
											</Text>
								</TouchableOpacity>
							</View>
						}
						{
							carregando &&
							<Loading title={'Buscando clubes ...'} background={lightdark} />
						}
						{
							!carregando &&
							clubesBuscados.length > 0 &&
							clubesBuscados.map(clube =>
								<View key={clube._id} style={{ color: black }}>
									<Text style={{ color: white }}>
										{clube._id}
									</Text>
									<Text style={{ color: white }}>
										{clube.nome}
									</Text>
									<Text style={{ color: white }}>
										{clube.no.nome}
									</Text>
									<TouchableOpacity
										onPress={() => this.selecionarClube(clube._id)} >
										<Text style={{ color: white }}>
											Selecionar
												</Text>
									</TouchableOpacity>
								</View>
							)
						}
					</View>
				}

			</LinearGradient>
		)
	}
}

const mapStateToProps = ({ usuario }) => {
	return { usuario }
}

export default connect(mapStateToProps, null)(ClubesScreen)
