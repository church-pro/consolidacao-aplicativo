import React, { Fragment } from 'react';
import { StyleSheet, Platform } from 'react-native';
import {
	Alert, Text, View, Image, TextInput,
	TouchableOpacity,
	ActivityIndicator,
	NetInfo,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dark, white, gray, gold, lightdark, black } from '../helpers/colors';
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

class LoginScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	state = {
		email: 'falecomleonardopereira@gmail.com',
		senha: '123',
		carregando: false,
	}

	componentDidMount() {
		this.setState({ carregando: true })

		this.props.pegarUsuarioNoAsyncStorage()
			.then(usuario => {
				if (usuario.email && usuario.email !== '') {
					this.props.pegarProspectosNoAsyncStorage()
						.then(() => {
							this.setState({ carregando: false })
							this.props.navigation.navigate('Prospectos')
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
							prospectos: null,
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
														this.props.navigation.navigate('Prospectos')
													})
											}
											this.setState({ carregando: false })
											this.props.navigation.navigate('Prospectos')
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
				<KeyboardAwareScrollView
					contentContainerStyle={styles.container}
					enableOnAndroid enableAutomaticScroll={true}
					keyboardShoulfPersistTaps='always'
					extraScrollHeight={Platform.OS === 'ios' ? 30 : 80} >

					{
						carregando &&
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<Text style={{ color: white, textAlign: 'center', fontSize: 22, marginBottom: 6 }}>Entrando no Church Pro</Text>
							<ActivityIndicator
								size="large"
								color={gold}
							/>
						</View>
					}

					{
						!carregando &&
						<Fragment>

							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 26 }}>
									Church Pro
								</Text>
								<Text style={{ color: '#FFFFFF', fontSize: 20 }}>
									Consolidação
								</Text>
							</View>

							<View style={{ flex: 1 }}>
								<View style={[styles.containerInput, { borderBottomWidth: 1, borderBottomColor: gray, borderTopLeftRadius: 6, borderTopRightRadius: 6 }]}>
									<TextInput style={styles.inputText}
										keyboardAppearance='dark'
										autoCapitalize="none"
										placeholderTextColor="#d3d3d3"
										placeholder="Seu Email"
										selectionColor="#fff"
										keyboardType="email-address"
										value={email}
										onChangeText={texto => this.setState({ email: texto })}
										returnKeyType={'next'}
										onSubmitEditing={() => this.inputSenha.focus()}
									/>
								</View>
								<View style={[styles.containerInput, { borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }]}>
									<TextInput style={styles.inputText}
										ref={(input) => { this.inputSenha = input; }}
										keyboardAppearance='dark'
										placeholderTextColor="#d3d3d3"
										placeholder="Senha"
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
										title="Entrar"
										OnPress={() => this.ajudadorDeSubmissao()}
									/>
								</View>
							</View>


							<View style={styles.containerButton}>

								<TouchableOpacity
									style={[styles.button, style = { backgroundColor: 'transparent' }]}
									onPress={() => this.props.navigation.navigate('Registro')}>
									<Text style={[styles.textButton, style = { color: white, fontWeight: '200' }]}>Ainda não tem uma conta? Crie aqui!</Text>
								</TouchableOpacity>
							</View>

						</Fragment>
					}
				</KeyboardAwareScrollView>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'stretch',
		padding: 20,
	},
	logo: {
		alignSelf: 'center',
		width: Platform.OS === "ios" ? 200 : 180,
		height: Platform.OS === "ios" ? 115 : 105,
	},
	containerInput: {
		backgroundColor: black,
		height: 45,
	},
	inputText: {
		fontSize: 16,
		color: white,
		fontWeight: '400',
		height: 45,
		paddingHorizontal: 4
	},
	containerButton: {
		marginBottom: 6,
	},
	button: {
		backgroundColor: gold,
		height: 45,
		borderRadius: 10,
		justifyContent: 'center',
		marginHorizontal: 12,
	},
	textButton: {
		fontSize: 16,
		color: dark,
		textAlign: 'center',
	},
})

