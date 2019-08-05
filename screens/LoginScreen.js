import React, { Fragment } from 'react';
import { Platform } from 'react-native';
import {
	Alert, Text, View, Image, TextInput,
	TouchableOpacity,
	NetInfo,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dark, white, lightdark, black } from '../helpers/colors';
import {
	alterarUsuarioNoAsyncStorage,
	pegarUsuarioNoAsyncStorage,
	adicionarProspectosAoAsyncStorage,
	pegarProspectosNoAsyncStorage,
	porProspectoDaSincronizacao,
} from '../actions'
import {
	sincronizarNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'
import CPButton from '../components/CPButton';
import { LinearGradient } from 'expo'
import logo from '../assets/images/churchpro_branco.png'
import { stylesLogin } from '../components/Styles'
import Loading from '../components/Loading';
import { BOTAO_CRIAR_CONTA, EMAIL, SENHA, ENTRAR, ENTRANDO } from '../helpers/constants';

class LoginScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	state = {
		email: '',
		senha: '',
		carregando: false,
		encaminhamento: 'Principal',
	}

	componentDidMount() {
		this.setState({ carregando: true })

		this.props.pegarUsuarioNoAsyncStorage()
			.then(usuario => {
				if (usuario.email && usuario.email !== '') {
					this.props.pegarProspectosNoAsyncStorage()
						.then(() => {
							this.setState({ carregando: false })
							this.props.navigation.navigate(this.state.encaminhamento)
						})
				} else {
					this.setState({ carregando: false })
				}

			})
	}

	ajudadorDeSubmissao = () => {
		const {
			email,
			senha,
		} = this.state

		mostrarMensagemDeErro = false
		if (email === '') {
			mostrarMensagemDeErro = true
		}

		if (senha === '') {
			mostrarMensagemDeErro = true
		}

		if (mostrarMensagemDeErro) {
			Alert.alert('Erro', 'Campos invalidos')
		} else {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if (isConnected) {
						this.setState({ carregando: true })
						const dados = {
							email,
							senha,
							baixando: true,
						}
						sincronizarNaAPI(dados)
							.then(retorno => {
								if (retorno.ok) {
									dados.no_id = retorno.resultado.no_id
									dados.data_atualizacao = retorno.resultado.data_atualizacao ? retorno.resultado.data_atualizacao : null
									dados.hora_atualizacao = retorno.resultado.hora_atualizacao ? retorno.resultado.hora_atualizacao : null
									this.props.alterarUsuarioNoAsyncStorage(dados)
										.then(() => {
											if (retorno.resultado.prospectos) {
												this.props.porProspectoDaSincronizacao(retorno.resultado.prospectos)
													.then(() => {
														this.setState({ carregando: false })
														this.props.navigation.navigate(this.state.encaminhamento)
													})
											}
											this.setState({ carregando: false })
											this.props.navigation.navigate(this.state.encaminhamento)
										})
								} else {
									this.setState({ carregando: false })
									Alert.alert('Aviso', 'Usuário/Senha não conferem!')
								}
							})
					} else {
						Alert.alert('Internet', 'Verifique sua internet!')
					}
				})
		}
	}

	render() {

		const {
			email,
			senha,
			carregando,
		} = this.state
		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#404040']}>
				{
					carregando &&
					<Loading title={ENTRANDO} />
				}

				{
					!carregando &&
					<KeyboardAwareScrollView
						contentContainerStyle={stylesLogin.container}
						enableOnAndroid enableAutomaticScroll={true}
						keyboardShoulfPersistTaps='always'
						extraScrollHeight={Platform.OS === 'ios' ? 30 : 80} >

						<Fragment>

							<View style={stylesLogin.containerLogo}>
								<Image source={logo} style={stylesLogin.logo} />
							</View>

							<View style={{ flex: 1 }}>
								<View style={[stylesLogin.containerInputEmail]}>
									<TextInput style={stylesLogin.inputText}
										keyboardAppearance='dark'
										autoCapitalize="none"
										placeholderTextColor="#d3d3d3"
										placeholder={EMAIL}
										selectionColor="#fff"
										keyboardType="email-address"
										value={email}
										onChangeText={texto => this.setState({ email: texto })}
										returnKeyType={'next'}
										onSubmitEditing={() => this.inputSenha.focus()}
									/>
								</View>
								<View style={[stylesLogin.containerInputSenha]}>
									<TextInput style={stylesLogin.inputText}
										ref={(input) => { this.inputSenha = input; }}
										keyboardAppearance='dark'
										placeholderTextColor="#d3d3d3"
										placeholder={SENHA}
										selectionColor="#fff"
										keyboardType='default'
										secureTextEntry={true}
										value={senha}
										onChangeText={texto => this.setState({ senha: texto })}
										returnKeyType={'go'}
										onSubmitEditing={() => this.ajudadorDeSubmissao()}
									/>
								</View>
								<View>
									<CPButton
										title={ENTRAR}
										OnPress={() => this.ajudadorDeSubmissao()}
									/>
								</View>
							</View>

						</Fragment>
					</KeyboardAwareScrollView>

				}


				{
					!carregando &&
					<TouchableOpacity
						style={[stylesLogin.button, style = { backgroundColor: 'transparent' }]}
						onPress={() => this.props.navigation.navigate('Registro')}>
						<Text style={[stylesLogin.textButton]}> {BOTAO_CRIAR_CONTA} </Text>
					</TouchableOpacity>
				}

			</LinearGradient>
		)
	}
}

const mapStateToProps = (state, props) => {
	let tipo = null
	if (props.navigation.state.params && props.navigation.state.params.tipo) {
		tipo = props.navigation.state.params.tipo
	}
	return {
		tipo,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		pegarUsuarioNoAsyncStorage: (usuario) => dispatch(pegarUsuarioNoAsyncStorage(usuario)),
		adicionarProspectosAoAsyncStorage: (prospectos) => dispatch(adicionarProspectosAoAsyncStorage(prospectos)),
		pegarProspectosNoAsyncStorage: (prospectos) => dispatch(pegarProspectosNoAsyncStorage(prospectos)),
		porProspectoDaSincronizacao: (prospectos) => dispatch(porProspectoDaSincronizacao(prospectos)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
