import React from 'react';
import {
	Alert,
	Platform,
	View,
	TouchableOpacity,
	Image
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Header, Title, Left, Body, Right } from 'native-base'
import { Input, Icon } from 'react-native-elements'
import { white, lightdark, dark, black } from '../helpers/colors'
import {
	alterarProspectoNoAsyncStorage,
} from '../actions'
import {
	SITUACAO_CADASTRO, SALVAR, NOME, DDD, TELEFONE, LABEL_EMAIL, NOVO_CONTATO,
} from '../helpers/constants'
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'
import CPButton from '../components/CPButton';
import {
	pegarDataEHoraAtual
} from '../helpers/helper'
import {
	submeterSituacoes
} from '../helpers/api'
import Loading from '../components/Loading'
import { styles, stylesImportar } from '../components/Styles';
import arrow from '../assets/images/arrow-back.png'

class ProspectoScreen extends React.Component {

	state = {
		carregando: false,
		nome: '',
		ddd: '',
		telefone: '',
		email: '',
	}

	componentDidMount = () => {
		const {
			prospectoSelecionado,
		} = this.props

		if (prospectoSelecionado) {
			this.setState({
				nome: prospectoSelecionado.nome,
				ddd: prospectoSelecionado.ddd,
				telefone: prospectoSelecionado.telefone,
				email: prospectoSelecionado.email ? prospectoSelecionado.email : '',
			})
		}
	}

	ajudadorDeSubmissao = async () => {
		const {
			nome,
			ddd,
			telefone,
			email,
			carregando,
		} = this.state
		let {
			prospectoSelecionado,
		} = this.props

		let camposComErro = ''
		mostrarMensagemDeErro = false
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

		if (mostrarMensagemDeErro) {
			Alert.alert('Erro', `Campos invalidos: ${camposComErro}`)
		} else {
			this.setState({ carregando: true })
			let prospecto = {}
			if (prospectoSelecionado) {
				prospecto = prospectoSelecionado
			} else {
				prospecto.novo = true
				prospecto._id = Date.now() + ''
				prospecto.rating = null
				prospecto.online = false
				prospecto.cadastroNaApi = false
				prospecto.situacao_id = SITUACAO_CADASTRO
				prospecto.celular_id = prospecto._id
			}
			prospecto.nome = nome
			prospecto.ddd = ddd
			prospecto.telefone = telefone
			prospecto.email = email
			prospecto.dataParaFinalizarAAcao = pegarDataEHoraAtual(1)[0]

			const situacao = {
				prospecto_id: prospecto.celular_id,
				situacao_id: SITUACAO_CADASTRO,
				data_criacao: pegarDataEHoraAtual()[0],
				hora_criacao: pegarDataEHoraAtual()[1],
			}
			await submeterSituacoes([situacao])
			await this.props.alterarProspectoNoAsyncStorage(prospecto)
			this.setState({ carregando: false })
			Alert.alert('Cadastro', 'Cadastro concluido com sucesso!')
			this.props.navigation.navigate('Prospectos')
		}
	}

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state
		return {
			header: null
		}
	}

	render() {
		const {
			nome,
			ddd,
			telefone,
			email,
			carregando,
		} = this.state
		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				<Header style={stylesImportar.header} iosBarStyle="light-content">
					<Left >
						<TouchableOpacity
							hitSlop={{ right: 10 }}
							style={stylesImportar.containerIcon}
							onPress={() => this.props.navigation.goBack()}>
							{
								Platform.OS === "ios" ?
									<Icon type="font-awesome" name={"angle-left"}
										color={white} size={36}
									/>
									:
									<Image source={arrow} style={{ height: 16, width: 16, marginHorizontal: 5 }} />
							}
						</TouchableOpacity>
					</Left>
					<Body >
						<Title
							style={stylesImportar.headerTitle}
						>{NOVO_CONTATO}</Title>
					</Body>
					<Right />

				</Header>
				{
					carregando &&
					<Loading />
				}

				{
					!carregando &&
					<KeyboardAwareScrollView style={styles.container}
						enableOnAndroid enableAutomaticScroll={true} extraScrollHeight={80}
						keyboardShoulfPersistTaps='always'
					>
						<TouchableOpacity
							activeOpacity={1}
							onPress={() => this.inputNome.focus()}
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
								ref={(input) => { this.inputNome = input }}
							/>
						</TouchableOpacity>

						<View style={{ flexDirection: 'row', flex: 1 }}>
							<View style={{ marginRight: 6 }}>
								<TouchableOpacity
									activeOpacity={1}
									onPress={() => this.inputDDD.focus()}
								>
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
								</TouchableOpacity>
							</View>

							<View style={{ flex: 1 }}>
								<TouchableOpacity
									activeOpacity={1}
									onPress={() => this.inputTelefone.focus()}
								>
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
								</TouchableOpacity>
							</View>

						</View>
						<TouchableOpacity
							activeOpacity={1}
							onPress={() => this.inputEmail.focus()}
						>
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
								returnKeyType={'go'}
								onSubmitEditing={() => this.ajudadorDeSubmissao()}
							/>
						</TouchableOpacity>


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

const mapStateToProps = ({ prospectos }, { navigation }) => {
	let prospectoSelecionado = null
	let prospecto_id = null
	if (navigation.state.params) {
		prospecto_id = navigation.state.params.prospecto_id
	}
	if (prospecto_id) {
		prospectoSelecionado = prospectos.find(prospecto => prospecto._id === prospecto_id)
	}
	return {
		prospectoSelecionado,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		alterarProspectoNoAsyncStorage: prospecto => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProspectoScreen)
