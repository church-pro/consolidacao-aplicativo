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
import { Icon } from 'react-native-elements';
import { ProgressBar, Colors } from 'react-native-paper'
import {
	SITUACAO_LIGAR,
	SITUACAO_MENSAGEM,
	SITUACAO_VISITA,
} from '../helpers/constants'
import {
	alterarUsuarioNoAsyncStorage,
} from '../actions'

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

	render() {
		const {
			missoes,
			carregando,
		} = this.state
		const { 
			situacao_id,
		} = this.props

		return (
			<View style={{ flex: 1, backgroundColor: dark }}>

				{
					carregando &&
					<Loading title={'Carregando ...'} />
				}
				{
					!carregando &&
						<View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}>
								<Text style={{ alignSelf: 'center', color: white, fontSize: 30, fontWeight: 'bold' }}>
									Missões
								</Text>
							</View>
							<ScrollView>
								<View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>
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

											const retorno =	
												<View 
													key={item.missao._id}
													style={{
														borderTopWidth: 1,
														borderTopColor: dark,
														padding: 12,
														alignItems: 'center',
														justifyContent: 'space-between',
														backgroundColor: dark,
														borderColor: gray,
														borderRadius: 6,

													}}>
													<Text style={{ color: white }}>{item.missao.nome}</Text>
													<Text style={{ color: white, fontSize: 8, }}>{item.missao.data_inicial} até {item.missao.data_final}</Text>
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
																alignItems: 'center',
															}}>
															{valor}/{valorFinal}
														</Text>
													</View>

												</View>

												return retorno
										})
									}
								</View>

							</ScrollView>
						</View>
				}
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
