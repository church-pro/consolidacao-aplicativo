import React, { Fragment } from 'react';
import {
	Alert,
	View,
	NetInfo,
	Platform,
	ActivityIndicator,
	Text,
	TextInput
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { primary, dark, white, gray, lightdark, black } from '../helpers/colors';
import { Input } from 'react-native-elements'
import {
	registrarNaAPI,
} from '../helpers/api'
import {
	alterarUsuarioNoAsyncStorage,
	porProspectoDaSincronizacao,
} from '../actions'
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'
import CPButton from '../components/CPButton';
import { stylesRegistro, stylesLogin } from '../components/Styles'

class RegistroScreen extends React.Component {

	static navigationOptions = {
		headerTitle: 'Registro',
		headerTintColor: white,
	}

	state = {
		carregando: false,
		nome: '',
		ddd: '',
		telefone: '',
		email: '',
		senha: '',
		rede_id: '',
	}

	ajudadorDeSubmissao = () => {
		const {
			nome,
			ddd,
			telefone,
			email,
			senha,
			rede_id,
		} = this.state
		let camposComErro = ''
		let mostrarMensagemDeErro = false

		if (nome === '') {
			mostrarMensagemDeErro = true
			if (camposComErro === '') {
				camposComErro = 'Nome'
			}
		}

		if (ddd === '' || ddd.length !== 2) {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'DDD'
		}

		if (telefone === '' || telefone.length !== 9) {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'Telefone'
		}

		if (email === '') {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'Email'
		}

		if (senha === '') {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'Senha'
		}

		if (rede_id === '') {
			mostrarMensagemDeErro = true
			if (camposComErro !== '') {
				camposComErro += ', '
			}
			camposComErro += 'Identificação da Rede'
		}

		if (mostrarMensagemDeErro) {
			Alert.alert('Erro', `Campos invalidos: ${camposComErro}`)
		} else {
			try {
				NetInfo.isConnected
					.fetch()
					.then(isConnected => {
						if (isConnected) {
							this.setState({ carregando: true })
							const dados = {
								nome,
								ddd,
								telefone,
								email,
								senha,
								rede_id,
							}
							registrarNaAPI(dados)
								.then(resposta => {
									this.setState({ carregando: false })
									if (resposta.ok) {
										const usuario = {
											email,
											senha,
										}
										this.props.alterarUsuarioNoAsyncStorage(usuario)
											.then(() => {
												this.props.porProspectoDaSincronizacao([])
													.then(() => {
														Alert.alert('Registro', 'Registrado com sucesso!')
														this.props.navigation.navigate('Prospectos')
													})
											})
									} else {
										Alert.alert('Aviso', resposta.mensagem)
									}
								})
								.catch(error => console.log('error: ', error))
						} else {
							Alert.alert('Internet', 'Verifique sua internet!')
						}
					})
			} catch (err) {
				Alert.alert('Error', err)
			}
		}
	}

	render() {

		const {
			carregando,
			nome,
			ddd,
			telefone,
			email,
			senha,
			rede_id,
		} = this.state

		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				<KeyboardAwareScrollView
					contentContainerStyle={stylesRegistro.container}
					enableOnAndroid enableAutomaticScroll={true}
					keyboardShoulfPersistTaps='always'
					extraScrollHeight={Platform.OS === 'ios' ? 30 : 80} >

					{
						carregando &&
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<ActivityIndicator
								size="large"
								color={primary}
							/>
						</View>
					}

					{
						!carregando &&
						<Fragment>

							<View style={stylesRegistro.containerInputRegistro}>
								<Text style={stylesRegistro.labelRegistro}>NOME</Text>
								<View style={stylesRegistro.inputContainerStyle}>
									<TextInput
										keyboardAppearance='dark'
										returnKeyType="next"
										underlineColorAndroid="transparent"
										placeholder=""
										style={stylesRegistro.inputRegistro}
										autoCorrect={false}
										value={nome}
										onChangeText={texto => this.setState({ nome: texto })}
										returnKeyType={'next'}
										onSubmitEditing={() => this.inputDDD.focus()}
									/>
								</View>
							</View>

							<View style={{ flexDirection: "row" }}>

								<View style={[stylesRegistro.containerInputRegistro, { marginRight: 6 }]}>
									<Text style={stylesRegistro.labelRegistro}>DDD</Text>
									<View style={[stylesRegistro.inputContainerStyle]}>
										<TextInput
											keyboardType="numbers-and-punctuation"
											keyboardAppearance='dark'
											returnKeyType="next"
											underlineColorAndroid="transparent"
											placeholder=""
											style={stylesRegistro.inputRegistro}
											autoCorrect={false}
											maxLength={2}
											value={ddd}
											onChangeText={texto => this.setState({ ddd: texto })}
											returnKeyType={'next'}
											onSubmitEditing={() => this.inputTelefone.focus()}
											ref={(input) => { this.inputDDD = input; }}
										/>
									</View>
								</View>

								<View style={{ flex: 1 }}>
									<View style={[stylesRegistro.containerInputRegistro]}>
										<Text style={stylesRegistro.labelRegistro}>TELEFONE</Text>
										<View style={[stylesRegistro.inputContainerStyle]}>
											<TextInput
												keyboardAppearance='dark'
												returnKeyType="next"
												keyboardType="numbers-and-punctuation"
												underlineColorAndroid="transparent"
												placeholder=""
												style={stylesRegistro.inputRegistro}
												autoCorrect={false}
												value={telefone}
												onChangeText={texto => this.setState({ telefone: texto })}
												ref={(input) => { this.inputTelefone = input; }}
												returnKeyType={'next'}
												onSubmitEditing={() => this.inputEmail.focus()}
											/>
										</View>
									</View>

								</View>
							</View>

							<View style={[stylesRegistro.containerInputRegistro]}>
								<Text style={stylesRegistro.labelRegistro}>EMAIL</Text>
								<View style={[stylesRegistro.inputContainerStyle]}>
									<TextInput
										keyboardAppearance='dark'
										returnKeyType="next"
										underlineColorAndroid="transparent"
										placeholder=""
										style={stylesRegistro.inputRegistro}
										autoCorrect={false}
										value={email}
										onChangeText={texto => this.setState({ email: texto })}
										ref={(input) => { this.inputEmail = input; }}
										returnKeyType={'next'}
										onSubmitEditing={() => this.inputSenha.focus()}
									/>
								</View>
							</View>

							<View style={[stylesRegistro.containerInputRegistro]}>
								<Text style={stylesRegistro.labelRegistro}>SENHA</Text>
								<View style={[stylesRegistro.inputContainerStyle]}>
									<TextInput
										keyboardAppearance='dark'
										returnKeyType="next"
										underlineColorAndroid="transparent"
										placeholder=""
										style={stylesRegistro.inputRegistro}
										autoCorrect={false}
										value={senha}
										onChangeText={texto => this.setState({ senha: texto })}
										ref={(input) => { this.inputSenha = input; }}
										onSubmitEditing={() => this.inputIdentificacao.focus()}
									/>
								</View>
							</View>

							<View style={[stylesRegistro.containerInputRegistro]}>
								<Text style={stylesRegistro.labelRegistro}>IDENTIFICAÇÃO DA REDE</Text>
								<View style={[stylesRegistro.inputContainerStyle]}>
									<TextInput
										keyboardAppearance='dark'
										returnKeyType="next"
										underlineColorAndroid="transparent"
										placeholder=""
										style={stylesRegistro.inputRegistro}
										autoCorrect={false}
										value={rede_id}
										onChangeText={texto => this.setState({ rede_id: texto })}
										ref={(input) => { this.inputIdentificacao = input; }}
										returnKeyType={'go'}
										onSubmitEditing={() => this.ajudadorDeSubmissao()}
									/>
								</View>
							</View>

							<CPButton
								title='Registrar'
								OnPress={() => this.ajudadorDeSubmissao()}
							/>

						</Fragment>
					}

				</KeyboardAwareScrollView>
			</LinearGradient>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		porProspectoDaSincronizacao: (prospectos) => dispatch(porProspectoDaSincronizacao(prospectos)),
	}
}

export default connect(null, mapDispatchToProps)(RegistroScreen)