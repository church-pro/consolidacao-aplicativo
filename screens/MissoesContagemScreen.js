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
} from 'react-native';
import { connect } from 'react-redux'
import { ProgressBar, Colors } from 'react-native-paper'
import {
	SITUACAO_LIGAR,
	SITUACAO_MENSAGEM,
	SITUACAO_VISITA,
} from '../helpers/constants'
import {
	alterarUsuarioNoAsyncStorage,
} from '../actions'
import { Icon, } from 'react-native-elements'

class MissoesContagemScreen extends React.Component {

	static navigationOptions = () => {
		return {
			headerTintColor: white,
			header: null,
		}
	}

	state = {
		missoes: [],
		carregando: true,
	}

	async componentDidMount() {
		const {
			situacao_id,
		} = this.props
		let {
			missoes,
			usuario,
			alterarUsuarioNoAsyncStorage,
		} = this.props

		missoes = missoes.map(item => {
			if(situacao_id === SITUACAO_MENSAGEM){
				item.mensagens++
			}
			if(situacao_id === SITUACAO_LIGAR){
				item.ligacoes++
			}
			if(situacao_id === SITUACAO_VISITA){
				item.visitas++
			}
			return item
		})

		usuario.missoes = usuario.missoes.map(item => {
			let retorno = item
			missoes.forEach(itemParaValidar => {
				if(itemParaValidar.missao._id === item.missao._id){
					retorno = itemParaValidar	
				}
			})
			return retorno
		})

		await alterarUsuarioNoAsyncStorage(usuario)
		await this.setState({
			missoes,
			carregando: false,
		})
	}

	ajudadorDeSubmissao(){
		this.setState({carregando: true})
		const {
			missoes,
		} = this.state
	
		let paraOndeNavegar = 'Anuncio'
		let missoesConcluidas = []
		let dados = {}
		missoes.forEach(item => {
			if(
				item.mensagens === item.missao.mensagens &&
				item.ligacoes === item.missao.ligacoes &&
				item.visitas === item.missao.visitas
			){
				missoesConcluidas.push(item)
			}
		})
		if(missoesConcluidas.length > 0){
			paraOndeNavegar = 'MissoesConcluidas'
			dados.missoes = missoesConcluidas
		}
		this.setState({carregando: false})
		this.props.navigation.navigate(paraOndeNavegar, dados)
	}

	render() {
		const {
			missoes,
			carregando,
		} = this.state
		const { 
			situacao_id,
		} = this.props

		return (
			<View style={{ flex: 1, backgroundColor: lightdark, alignItems: 'center', padding: 20 }}>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Text style={{ color: white, fontWeight: 'bold', textAlign: 'center', fontSize: 22, marginVertical: 16 }}>
						Progresso nas Missões
					</Text>

					{
						carregando &&
							<Loading title='Carregando...' />
					}

					{
						!carregando &&
							<View style={{
								alignItems: 'center',
								flexDirection: 'column',
								flex: 1,
							}}>
							{
								missoes.map(item => {
									let icone = ''
									let valor = 0
									let valorFinal = 0
									if(situacao_id === SITUACAO_MENSAGEM){
										icone = 'envelope'
										valor = item.mensagens
										valorFinal = item.missao.mensagens
									}
									if(situacao_id === SITUACAO_LIGAR){
										icone = 'phone'
										valor = item.ligacoes
										valorFinal = item.missao.ligacoes
									}
									if(situacao_id === SITUACAO_VISITA){
										icone = 'home'
										valor = item.visitas
										valorFinal = item.missao.visitas
									}

									const valorDaBarra =  valor / valorFinal

									const container = {
										padding: 10,
										borderWidth: 1,
										borderColor: gray,
										borderRadius: 6,
										marginTop: 10,
										height: 100,
										width: 300,
									}

									const retorno =	
										<View 
											key={item.missao._id}
											style={container}>
											<Text style={{ color: white, alignSelf: 'center' }}>{item.missao.nome}</Text>
											<Text style={{ color: white, alignSelf: 'center', fontSize: 8, }}>{item.missao.data_inicial} até {item.missao.data_final}</Text>
											<View style={{ flexDirection: 'row', }}>
												<Icon type="font-awesome" name={icone} size={30} color={white} />
												<View style={{ flex: 1, padding: 10, }}>
													<ProgressBar progress={valorDaBarra} color={primary} style={{ paddingVertical: 0 }} />
												</View>
											</View>
											<View>
												<Text
													style={{
														color: white,
														alignSelf: 'center',
													}}>
													{valor}/{valorFinal}
												</Text>
											</View>
										</View>

										return retorno
								})
							}
						</View>
					}

				</View>

				<TouchableOpacity
					onPress={() => this.ajudadorDeSubmissao()}
					style={{
						width: '100%',
						backgroundColor: primary,
						height: 45,
						borderRadius: 6,
						justifyContent: 'center',
						shadowOffset: { width: 5, height: 5, },
						shadowColor: 'rgba(0,0,0,0.3)',
						shadowOpacity: 1.5,
					}} >
					<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
						Continuar
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const mapStateToProps = (state, {navigation}) => {
	const {
		missoes,
		situacao_id,
	} = navigation.state.params
	return { 
		missoes,
		situacao_id,
		usuario: state.usuario,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MissoesContagemScreen)
