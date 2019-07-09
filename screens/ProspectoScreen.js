import React from 'react';
import {
	KeyboardAvoidingView,
	Alert,
	ScrollView,
	View,
	ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, Card, Icon, Input } from 'react-native-elements'
import { white, lightdark, dark, gold } from '../helpers/colors'
import {
	alterarProspectoNoAsyncStorage,
} from '../actions'
import { connect } from 'react-redux'

class ProspectoScreen extends React.Component {

	state = {
		carregando : false,
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

	ajudadorDeSubmissao = () => {
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
			this.setState({carregando: true})
			let prospecto = {}
			if (prospectoSelecionado) {
				prospecto = prospectoSelecionado
			} else {
				prospecto.novo = true
				prospecto._id = Date.now() + ''
				prospecto.rating = null
				prospecto.online = false
				prospecto.cadastroNaApi = false
				prospecto.situacao_id = 1
			}
			prospecto.nome = nome
			prospecto.ddd = ddd
			prospecto.telefone = telefone
			prospecto.email = email
			this.props.alterarProspectoNoAsyncStorage(prospecto)
				.then(() => {
					this.setState({carregando:false})
					Alert.alert('Cadastro', 'Cadastro concluido com sucesso!')
					this.props.navigation.navigate('Prospectos')
				})
		}
	}

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state
		return {
			title: 'Novo Prospecto',
			headerTitleStyle: {
				flex: 1,
				textAlign: 'center',
				alignSelf: 'center',
				color: white,
			},
			headerTintColor: white,
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
			<KeyboardAwareScrollView style={{ flex: 1, backgroundColor: lightdark }}
				style={{ backgroundColor: lightdark }}
				enableOnAndroid enableAutomaticScroll={true} extraScrollHeight={80} 
				keyboardShoulfPersistTaps='always'
			>

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
				<View>

					<Card containerStyle={{ backgroundColor: dark, borderColor: gold, borderRadius: 6 }}>
						<Input
							keyboardAppearance='dark'
							onSubmitEditing={() => this.inputDDD.focus()}
							returnKeyType="next"
							placeholder=""
							placeholderTextColor={'#ddd'}
							autoCorrect={false}
							label="NOME"
							inputStyle={{ color: white, marginLeft: 5 }}
							labelStyle={{ marginTop: 5 }}
							leftIcon={
								<Icon
									name="user"
									type="font-awesome"
									color={gold}
									size={20}
								/>
							}
							value={nome}
							onChangeText={texto => this.setState({ nome: texto })}
							returnKeyType={'next'}
							onSubmitEditing={() => this.inputDDD.focus()}
						/>
						<Input
							keyboardType='phone-pad'
							keyboardAppearance='dark'
							placeholder=""
							placeholderTextColor={'#ddd'}
							autoCorrect={false}
							label="DDD"
							maxLength={2}
							inputStyle={{ color: white, marginLeft: 5 }}
							labelStyle={{ marginTop: 16 }}
							leftIcon={
								<Icon
									name="phone"
									type="font-awesome"
									color={gold}
									size={20}
								/>
							}
							value={ddd}
							onChangeText={texto => this.setState({ ddd: texto })}
							ref={(input) => { this.inputDDD = input; }}
							returnKeyType={'next'}
							onSubmitEditing={() => this.inputTelefone.focus()}
						/>
						<Input
							keyboardType='phone-pad'
							keyboardAppearance='dark'
							placeholder=""
							placeholderTextColor={'#ddd'}
							autoCorrect={false}
							label="TELEFONE"
							inputStyle={{ color: white, marginLeft: 5 }}
							labelStyle={{ marginTop: 16 }}
							leftIcon={
								<Icon
									name="phone"
									type="font-awesome"
									color={gold}
									size={20}
								/>
							}
							value={telefone}
							onChangeText={texto => this.setState({ telefone: texto })}
							ref={(input) => { this.inputTelefone = input; }}
							returnKeyType={'next'}
							onSubmitEditing={() => this.inputEmail.focus()}
						/>
						<Input
							keyboardType='email-address'
							keyboardAppearance='dark'
							placeholder=""
							placeholderTextColor={'#ddd'}
							autoCorrect={false}
							label="EMAIL"
							inputStyle={{ color: white, marginLeft: 5 }}
							labelStyle={{ marginTop: 16 }}
							leftIcon={
								<Icon
									name="envelope"
									type="font-awesome"
									color={gold}
									size={20}
								/>
							}
							value={email}
							onChangeText={texto => this.setState({ email: texto })}
							ref={(input) => { this.inputEmail = input; }}
							returnKeyType={'go'}
							onSubmitEditing={() => this.ajudadorDeSubmissao()}
						/>

				</Card>

				<Button
					title='Salvar'
					buttonStyle={{ backgroundColor: gold, height: 50, margin: 15 }}
					textStyle={{ color: white, }}
					onPress={() => { this.ajudadorDeSubmissao() }}
				/>

		</View>
			}

		</KeyboardAwareScrollView>
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
