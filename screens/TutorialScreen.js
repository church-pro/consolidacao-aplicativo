import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, gray, dark } from '../helpers/colors';
import {
	View,
	Text,
	TouchableOpacity,
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
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				{
					carregando &&
					<Loading title={ENTRANDO} />
				}

				{
					!carregando &&
						<View>
							<Text style={{color: white}}>
								Tutorial	
							</Text>
							{
								passoUm &&
									<View>
										<Text style={{color: white}}>
											Importe contatos e cadastre pessoas para fazer o acompanhamento
										</Text>
									<TouchableOpacity onPress={() => this.setState(mostrarPassoDois)}>
										<Text style={{color: white}}>
											Próximo Passo	
										</Text>
									</TouchableOpacity>
								</View>
							}
							{
								passoDois &&
									<View>
										<Text style={{color: white}}>
											Acompanhe seu progresso no perfil
										</Text>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-around',
											}} >
											<TouchableOpacity onPress={() => this.setState(mostrarPassoUm)}>
												<Text style={{color: white}}>
													Voltar	
												</Text>
											</TouchableOpacity>
										<TouchableOpacity onPress={() => this.setState(mostrarPassoTres)}>
											<Text style={{color: white}}>
												Próximo Passo	
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							}
							{
								passoTres &&
									<View>
										<Text style={{color: white}}>
											Crie ou participe de clubes, compita com seus amigos	
										</Text>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-around',
											}} >
											<TouchableOpacity onPress={() => this.setState(mostrarPassoDois)}>
												<Text style={{color: white}}>
													Voltar	
												</Text>
											</TouchableOpacity>
										<TouchableOpacity onPress={() => this.comecar()}>
											<Text style={{color: white}}>
												Começar	
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

const mapStateToProps = (state, {navigation}) => {
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
