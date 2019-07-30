import React, { Fragment } from 'react';
import {
	Alert,
	View,
	NetInfo,
	Platform,
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
import { styles } from '../components/Styles'
import Loading from '../components/Loading';
import { NOME, DDD, TELEFONE, LABEL_EMAIL, LABEL_SENHA, IDENTIFICACAO_REDE, SALVAR, ENTRANDO, REGISTRO } from '../helpers/constants';

class RegistroScreen extends React.Component {

	static navigationOptions = {
		headerTitle: REGISTRO,
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
			nome,
			ddd,
			telefone,
			email,
			senha,
			rede_id,
			carregando,
		} = this.state
		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>

				{
					carregando &&
					<Loading title={ENTRANDO} />
				}

				{
					!carregando &&
					<KeyboardAwareScrollView style={styles.container}
						enableOnAndroid enableAutomaticScroll={true} extraScrollHeight={80}
						keyboardShoulfPersistTaps='always'
					>

						<Input
							containerStyle={styles.containerInput}
							inputContainerStyle={styles.inputContainerStyle}
							keyboardAppearance='dark'
							onSubmitEditing={() => this.inputDDD.focus()}
							returnKeyType="next"
							placeholder=""
							placeholderTextColor={'#ddd'}
							autoCorrect={false}
							label={NOME}
							inputStyle={styles.input}
							labelStyle={styles.label}
							value={nome}
							onChangeText={texto => this.setState({ nome: texto })}
							returnKeyType={'next'}
							onSubmitEditing={() => this.inputDDD.focus()}
						/>
						<View style={{ flexDirection: 'row', flex: 1 }}>
							<View style={{ marginRight: 6 }}>
								<Input
									containerStyle={[styles.containerInput, { paddingHorizontal: 15 }]}
									inputContainerStyle={styles.inputContainerStyle}
									underlineColorAndroid="transparent"
									keyboardType={Platform.OS === "android" ? 'number-pad' : "numbers-and-punctuation"}
									keyboardAppearance='dark'
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label={DDD}
									maxLength={2}
									inputStyle={styles.input}
									labelStyle={styles.label}
									value={ddd}
									onChangeText={texto => this.setState({ ddd: texto })}
									ref={(input) => { this.inputDDD = input; }}
									returnKeyType={'next'}
									onSubmitEditing={() => this.inputTelefone.focus()}
								/>
							</View>

							<View style={{ flex: 1 }}>
								<Input
									containerStyle={styles.containerInput}
									inputContainerStyle={styles.inputContainerStyle}
									underlineColorAndroid="transparent"
									keyboardType={Platform.OS === "android" ? 'number-pad' : "numbers-and-punctuation"}
									keyboardAppearance='dark'
									placeholder=""
									placeholderTextColor={'#ddd'}
									autoCorrect={false}
									label={TELEFONE}
									inputStyle={styles.input}
									labelStyle={styles.label}
									value={telefone}
									onChangeText={texto => this.setState({ telefone: texto })}
									ref={(input) => { this.inputTelefone = input; }}
									returnKeyType={'next'}
									onSubmitEditing={() => this.inputEmail.focus()}
								/>
							</View>

						</View>
						<Input
							containerStyle={styles.containerInput}
							inputContainerStyle={styles.inputContainerStyle}
							keyboardType='email-address'
							keyboardAppearance='dark'
							placeholder=""
							placeholderTextColor={'#ddd'}
							autoCorrect={false}
							label={LABEL_EMAIL}
							inputStyle={styles.input}
							labelStyle={styles.label}
							value={email}
							onChangeText={texto => this.setState({ email: texto })}
							ref={(input) => { this.inputEmail = input; }}
							returnKeyType={'next'}
							onSubmitEditing={() => this.inputSenha.focus()}
						/>
						<Input
							containerStyle={styles.containerInput}
							inputContainerStyle={styles.inputContainerStyle}
							keyboardType='visible-password'
							keyboardAppearance='dark'
							placeholder=""
							placeholderTextColor={'#ddd'}
							autoCorrect={false}
							label={LABEL_SENHA}
							inputStyle={styles.input}
							labelStyle={styles.label}
							value={senha}
							onChangeText={texto => this.setState({ senha: texto })}
							ref={(input) => { this.inputSenha = input; }}
							returnKeyType={'next'}
							onSubmitEditing={() => this.inputRede.focus()}
						/>

						<Input
							containerStyle={styles.containerInput}
							inputContainerStyle={styles.inputContainerStyle}
							keyboardAppearance='dark'
							placeholder=""
							placeholderTextColor={'#ddd'}
							autoCorrect={false}
							label={IDENTIFICACAO_REDE}
							inputStyle={styles.input}
							labelStyle={styles.label}
							value={rede_id}
							onChangeText={texto => this.setState({ rede_id: texto })}
							ref={(input) => { this.inputRede = input; }}
							returnKeyType={'go'}
							onSubmitEditing={() => this.ajudadorDeSubmissao()}
						/>

						<CPButton
							title={SALVAR}
							OnPress={() => { this.ajudadorDeSubmissao() }}
						/>

					</KeyboardAwareScrollView>
				}
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
