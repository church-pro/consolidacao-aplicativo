import React from 'react';
import { StyleSheet } from 'react-native';
import {
	Alert,
	View,
	NetInfo,
	Platform,
	ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { primary, dark, white, gray, gold, lightdark, black } from '../helpers/colors';
import { Input } from 'react-native-elements'
import { Icon } from 'native-base';
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
					contentContainerStyle={styles.container}
					keyboardShoulfPersistTaps='always'
					enableOnAndroid enableAutomaticScroll={true} extraScrollHeight={80} >

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
						<View>
							<View style={styles.containerLogin}>
								<Input
									containerStyle={{ borderWidth: 1, borderColor: gray, borderRadius: 6 }}
									inputContainerStyle={{ borderWidth: 0, borderColor: 'transparent' }}
									underlineColorAndroid="transparent"
									keyboardAppearance='dark'
									onSubmitEditing={() => this.inputDDD.focus()}
									returnKeyType="next"
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label="NOME"
									inputStyle={{ color: white, marginLeft: 5 }}
									labelStyle={{ marginTop: 5, color: white }}
									value={nome}
									onChangeText={texto => this.setState({ nome: texto })}
									returnKeyType={'next'}
									onSubmitEditing={() => this.inputDDD.focus()}

								/>

								<View style={{ marginTop: 8, flexDirection: "row" }}>

									<View style={{ marginRight: 6 }}>
										<Input
											containerStyle={{ borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 10, paddingHorizontal: 15 }}
											inputContainerStyle={{ borderWidth: 0, borderColor: 'transparent' }}
											underlineColorAndroid="transparent"
											keyboardType={Platform.OS === "android" ? 'number-pad' : "numbers-and-punctuation"}
											keyboardAppearance='dark'
											placeholder=""
											placeholderTextColor={'#ddd'}
											autoCorrect={false}
											label="DDD"
											maxLength={2}
											inputStyle={{ color: white, marginLeft: 5 }}
											labelStyle={{ marginTop: 5, color: white }}
											value={ddd}
											onChangeText={texto => this.setState({ ddd: texto })}
											ref={(input) => { this.inputDDD = input; }}
											returnKeyType={'next'}
											onSubmitEditing={() => this.inputTelefone.focus()}
										/>
									</View>

									<View style={{ flex: 1 }}>
										<Input
											containerStyle={{ borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 10 }}
											inputContainerStyle={{ borderWidth: 0, borderColor: 'transparent' }}
											underlineColorAndroid="transparent"
											keyboardType={Platform.OS === "android" ? 'number-pad' : "numbers-and-punctuation"}
											keyboardAppearance='dark'
											placeholder=""
											placeholderTextColor={'#ddd'}
											autoCorrect={false}
											label="TELEFONE"
											inputStyle={{ color: white, marginLeft: 5 }}
											labelStyle={{ marginTop: 5, color: white }}
											value={telefone}
											onChangeText={texto => this.setState({ telefone: texto })}
											ref={(input) => { this.inputTelefone = input; }}
											returnKeyType={'next'}
											onSubmitEditing={() => this.inputEmail.focus()}
										/>
									</View>
								</View>

								<View style={{ marginTop: 8 }}>
									<Input
										containerStyle={{ borderWidth: 1, borderColor: gray, borderRadius: 6, marginVertical: 10 }}
										inputContainerStyle={{ borderWidth: 0, borderColor: 'transparent' }}
										underlineColorAndroid="transparent"
										keyboardType='email-address'
										keyboardAppearance='dark'
										autoCapitalize="none"
										placeholder=""
										placeholderTextColor={'#ddd'}
										autoCorrect={false}
										label="EMAIL"
										inputStyle={{ color: white, marginLeft: 5 }}
										labelStyle={{ marginTop: 5, color: white }}
										value={email}
										onChangeText={texto => this.setState({ email: texto })}
										ref={(input) => { this.inputEmail = input; }}
										returnKeyType={'next'}
										onSubmitEditing={() => this.inputSenha.focus()}
									/>
								</View>

								<Input
									containerStyle={{ borderWidth: 1, borderColor: gray, borderRadius: 6, marginVertical: 10 }}
									inputContainerStyle={{ borderWidth: 0, borderColor: 'transparent' }}
									underlineColorAndroid="transparent"
									keyboardType='visible-password'
									secureTextEntry={true}
									keyboardAppearance='dark'
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label="SENHA"
									inputStyle={{ color: white, marginLeft: 5 }}
									labelStyle={{ marginTop: 5, color: white }}
									value={senha}
									onChangeText={texto => this.setState({ senha: texto })}
									ref={(input) => { this.inputSenha = input; }}
									returnKeyType={'go'}
									onSubmitEditing={() => this.ajudadorDeSubmissao()}
								/>

								<Input
									containerStyle={{ borderWidth: 1, borderColor: gray, borderRadius: 6, marginVertical: 10 }}
									inputContainerStyle={{ borderWidth: 0, borderColor: 'transparent' }}
									underlineColorAndroid="transparent"
									keyboardAppearance='dark'
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label="IDENTIFICAÇÃO DA REDE"
									inputStyle={{ color: white, marginLeft: 5 }}
									labelStyle={{ marginTop: 5, color: white }}
									value={rede_id}
									onChangeText={texto => this.setState({ rede_id: texto })}
									ref={(input) => { this.inputSenha = input; }}
									returnKeyType={'go'}
									onSubmitEditing={() => this.ajudadorDeSubmissao()}
								/>

							</View>

							<CPButton
								title='Registrar'
								OnPress={() => this.ajudadorDeSubmissao()}
							/>

						</View>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
})

