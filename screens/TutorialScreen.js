import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, gray, dark, primary } from '../helpers/colors';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	Dimensions,
	Alert,
} from 'react-native';
import { LinearGradient } from 'expo'
import {
	sincronizarNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'
import {
	alterarUsuarioNoAsyncStorage,
	porProspectoDaSincronizacao,
} from '../actions'
import { ENTRANDO, } from '../helpers/constants';
import logo from '../assets/images/churchpro_branco.png'
import tabs from '../assets/images/onboard_import.png'
import perfil from '../assets/images/onboard_perfil.png'
import clubes from '../assets/images/onboard_clubes.png'

class TutorialScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	state = {
		carregando: false,
		passoUm: true,
		passoDois: false,
		passoTres: false,
	}

	comecar = async () => {
		this.setState({ carregando: true })
		const {
			email,
			senha,
			alterarUsuarioNoAsyncStorage,
			porProspectoDaSincronizacao,
		} = this.props
		const dados = {
			email,
			senha,
			baixando: true,
		}
		const retorno = await sincronizarNaAPI(dados)
		if (retorno.ok) {
			let usuario = retorno.resultado.usuario
			delete usuario.prospectos
			usuario.senha = senha
			await alterarUsuarioNoAsyncStorage(usuario)
			await porProspectoDaSincronizacao([])
			this.setState({ carregando: false })
			this.props.navigation.navigate('Principal')
		} else {
			this.setState({ carregando: false })
			Alert.alert('Aviso', 'Usuário/Senha não conferem!')
		}
	}

	render() {
		const {
			carregando,
			passoUm,
			passoDois,
			passoTres,
		} = this.state
		const mostrarPassoUm = {
			passoUm: true,
			passoDois: false,
			passoTres: false,
		}
		const mostrarPassoDois = {
			passoUm: false,
			passoDois: true,
			passoTres: false,
		}
		const mostrarPassoTres = {
			passoUm: false,
			passoDois: false,
			passoTres: true,
		}
		return (
			<LinearGradient style={{ flex: 1, padding: 20, }} colors={[black, dark, lightdark, '#343434']}>
				{
					carregando &&
					<Loading title={ENTRANDO} />
				}

				{
					!carregando &&
					<View style={{ flex: 1, alignItems: 'center' }}>
						<Image source={logo} style={{
							height: 80,
							width: 200,
							resizeMode: 'contain',
						}} />

						{
							passoUm &&
							<View style={{ flex: 1, justifyContent: 'space-between', }}>
								<View style={{ alignItems: 'center', }}>
									<Image source={tabs} style={{ width: Dimensions.get('screen').width - 70, height: Dimensions.get('screen').height - 280, resizeMode: 'contain' }} />
									<Text style={{ color: white, fontSize: 18, textAlign: 'center' }}>
										Importe contatos e cadastre pessoas para fazer o acompanhamento
									</Text>
								</View>
								<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
									<TouchableOpacity onPress={() => this.setState(mostrarPassoDois)}
										style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6 }}
										hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
									>
										<Text style={{ color: white }}>
											Próximo Passo
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						}
						{
							passoDois &&
							<View style={{ flex: 1, justifyContent: 'space-between' }}>
								<View style={{ alignItems: 'center', }}>
									<Image source={perfil} style={{ width: Dimensions.get('screen').width - 70, height: Dimensions.get('screen').height - 300, resizeMode: 'contain' }} />
									<Text style={{ color: white, fontSize: 18, textAlign: 'center', marginTop: 10 }}>
										Acompanhe seu progresso no perfil
									</Text>
								</View>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
								>
									<TouchableOpacity onPress={() => this.setState(mostrarPassoUm)}
										style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6 }}
										hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
									>
										<Text style={{ color: white }}>
											Voltar
										</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.setState(mostrarPassoTres)}
										style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6 }}
										hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
									>
										<Text style={{ color: white }}>
											Próximo Passo
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						}
						{
							passoTres &&
							<View style={{ flex: 1, justifyContent: 'space-between' }}>
								<View style={{ alignItems: 'center', }}>
									<Image source={clubes} style={{ width: Dimensions.get('screen').width - 70, height: Dimensions.get('screen').height - 300, resizeMode: 'contain' }} />
									<Text style={{ color: white, fontSize: 18, textAlign: 'center', marginTop: 10 }}>
										Crie ou participe de clubes, compita com seus amigos
									</Text>
								</View>

								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<TouchableOpacity onPress={() => this.setState(mostrarPassoDois)}
										style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6 }}
										hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
									>
										<Text style={{ color: white }}>
											Voltar
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={{ backgroundColor: primary, borderRadius: 6, padding: 5 }}
										hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
										onPress={() => this.comecar()}
									>
										<Text style={{ color: white }}>
											Começar
										</Text>
									</TouchableOpacity>
								</View>


							</View>
						}
						<View style={{ flexDirection: 'row', height: 50 }}>
							<Text
								style={{
									fontSize: 40,
									color: passoUm ? primary : white,
									paddingHorizontal: 5,
									fontWeight: passoUm ? 'bold' : 'normal'
								}}
							>.</Text>
							<Text style={{ fontSize: 40, color: passoDois ? primary : white, paddingHorizontal: 5, fontWeight: passoDois ? 'bold' : 'normal' }}>.</Text>
							<Text style={{ fontSize: 40, color: passoTres ? primary : white, paddingHorizontal: 5, fontWeight: passoTres ? 'bold' : 'normal' }}>.</Text>
						</View>
					</View>
				}
			</LinearGradient>
		)
	}
}

const mapStateToProps = (state, { navigation }) => {
	const {
		email,
		senha,
	} = navigation.state.params
	return {
		email,
		senha
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		porProspectoDaSincronizacao: (prospectos) => dispatch(porProspectoDaSincronizacao(prospectos)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorialScreen)
