import React, {Fragment} from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Alert, Text, View, Image, TextInput, 
	KeyboardAvoidingView, 
	TouchableOpacity,
	ActivityIndicator,
	NetInfo,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { dark, white, gray, gold, lightdark } from '../helpers/colors';
import logo from '../assets/images/logo-word.png'
import { Icon } from 'native-base';
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

	componentDidMount(){
		this.setState({carregando:true})

		this.props.pegarUsuarioNoAsyncStorage()
			.then(usuario => {
				if(usuario.email && usuario.email !== ''){
					this.props.pegarProspectosNoAsyncStorage()
						.then(() => {
							this.setState({carregando:false})
							this.props.navigation.navigate('Prospectos')
						})
				}else{
					this.setState({carregando:false})
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
					if(isConnected){

						this.setState({carregando:true})
						const dados = {
							email,
							senha,
							prospectos: null,
						}
						sincronizarNaAPI(dados)
							.then(retorno => {
								if(retorno.ok){
									dados.no_id = retorno.resultado.no_id
									dados.data_atualizacao = retorno.resultado.data_atualizacao ? retorno.resultado.data_atualizacao : null
									dados.hora_atualizacao = retorno.resultado.hora_atualizacao ? retorno.resultado.hora_atualizacao : null
									this.props.alterarUsuarioNoAsyncStorage(dados)
										.then(() => {
											if(retorno.resultado.prospectos){
												this.props.porProspectoDaSincronizacao(retorno.resultado.prospectos)
													.then(() => {
														this.setState({carregando:false})
														this.props.navigation.navigate('Prospectos')
													})
											}
											this.setState({carregando:false})
											this.props.navigation.navigate('Prospectos')
										})
								}else{
									this.setState({carregando:false})
									Alert.alert('Aviso', 'Usuário/Senha não conferem!')
								}
							})
					}else{
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
			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				style={{ backgroundColor: dark }}
				enableOnAndroid enableAutomaticScroll={true}
				keyboardShoulfPersistTaps='always'
				extraScrollHeight={Platform.OS === 'ios' ? 30 : 80} >

				{
					carregando && 
					<View style={{flex: 1, justifyContent: 'center'}}>
						<ActivityIndicator 
							size="large"
							color={gold}
						/>
					</View>
				}

				{
					!carregando &&
						<Fragment>

							<View>
								<Text
									style={{color: '#FFFFFF'}}>
									Church Pro Consolidação	
								</Text>
							</View>

							<View style={styles.containerLogin}>
								<View>
									<View style={{ flexDirection: 'row' }}>
										<Icon name='envelope' type='FontAwesome'
											style={{ fontSize: 16, marginRight: 5, color: gold, marginLeft: 2 }}
										/>
										<Text style={{ color: gold }}>Email</Text>
									</View>
									<TextInput style={styles.inputText}
										keyboardAppearance='dark'
										autoCapitalize="none"
										placeholderTextColor="#d3d3d3"
										selectionColor="#fff"
										keyboardType="email-address"
										value={email}
										onChangeText={texto => this.setState({ email: texto })}
										returnKeyType={'next'}
										onSubmitEditing={() => this.inputSenha.focus()}
									/>
								</View>
								<View style={{ marginTop: 18 }}>
									<View style={{ flexDirection: 'row' }}>
										<Icon name='lock' type='FontAwesome'
											style={{ fontSize: 16, marginRight: 5, color: gold, marginLeft: 2 }}
										/>
										<Text style={{ color: gold }}>Senha</Text>
									</View>
									<TextInput style={styles.inputText}
										ref={(input) => { this.inputSenha = input; }}
										keyboardAppearance='dark'
										placeholderTextColor="#d3d3d3"
										selectionColor="#fff"
										keyboardType='default'
										secureTextEntry={true}
										value={senha}
										onChangeText={texto => this.setState({ senha: texto })}
										returnKeyType={'go'}
										onSubmitEditing={() => this.ajudadorDeSubmissao()}
									/>
								</View>
							</View>

							<View>
								<TouchableOpacity
									style={styles.button}
									onPress={() => this.ajudadorDeSubmissao()}>
									<Text style={styles.textButton}>Logar</Text>
								</TouchableOpacity>
							</View>

							<View style={styles.containerButton}>

								<TouchableOpacity
									style={[styles.button, style = { backgroundColor: 'transparent' }]}
									onPress={() => this.props.navigation.navigate('Registro')}>
									<Text style={[styles.textButton, style = { color: white, fontWeight: '200' }]}>Crie sua conta</Text>
								</TouchableOpacity>
							</View>

						 </Fragment>
				}
			</KeyboardAwareScrollView>
		)
	}
}

const mapStateToProps = (state, props) => {
	let tipo = null
	if(props.navigation.state.params && props.navigation.state.params.tipo){
		tipo =  props.navigation.state.params.tipo
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
		backgroundColor: dark,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'stretch',
	},
	logo: {
		alignSelf: 'center',
		width: Platform.OS === "ios" ? 200 : 180,
		height: Platform.OS === "ios" ? 115 : 105,
	},
	containerLogin: {
		height: 210,
		margin: 12,
		backgroundColor: lightdark,
		borderRadius: 10,
		justifyContent: 'center',
		padding: 14,
	},
	inputText: {
		paddingVertical: 5,
		fontSize: 16,
		color: white,
		borderRadius: 6,
		fontWeight: '400',
		borderBottomWidth: 1,
		borderBottomColor: white,

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

