import React from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Linking,
	Dimensions,
	Alert,
} from 'react-native';
import { Card, Icon, } from 'react-native-elements'
import { white, gray, primary, black, red } from '../helpers/colors'
import call from 'react-native-phone-call'
import {
	alterarProspectoNoAsyncStorage,
	alterarUsuarioNoAsyncStorage,
} from '../actions'
import {
	submeterSituacoes,
} from '../helpers/api'

import { connect } from 'react-redux'
import { styles, stylesProspecto } from './Styles';
import {
	SITUACAO_IMPORTAR,
	SITUACAO_CADASTRO,
	SITUACAO_MENSAGEM,
	SITUACAO_LIGAR,
	SITUACAO_REMOVIDO,
} from '../helpers/constants'
import {
	pegarDataEHoraAtual,
} from '../helpers/helper'
import { ProgressBar, Colors } from 'react-native-paper'

class Prospecto extends React.Component {

	state = {
		mostrarOpcoes: false
	}

	executarAcao = (tipo) => {
		const { 
			prospecto,
			navigation,
		} = this.props
		if(tipo === 'ligar'){
			const dados = {
				number: prospecto.telefone.toString(),
				prompt: false,
			}
			call(dados).catch(console.error)
		}
		if(tipo === 'whatsapp'){
			const url = `https://api.whatsapp.com/send?phone=55${prospecto.ddd}${prospecto.telefone}`
			Linking.openURL(url).catch((err) => console.error(err))
		}
		navigation.navigate('Perguntas', {prospecto_id: prospecto._id})
	}

	perguntarSeQuerRemover() {
		Alert.alert(
			'Remover',
			'Realmente deseja remover essa pessoa?',
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{ text: 'Sim', onPress: () => this.removerPessoa() },
			],
			{ cancelable: false },
		)
	}

	removerPessoa = async () => {
		const {
			prospecto,
			usuario,
			navigation,
			alterarUsuarioNoAsyncStorage,
			alterarProspectoNoAsyncStorage,
		} = this.props
		prospecto.situacao_id = SITUACAO_REMOVIDO
		const situacao = {
			prospecto_id: prospecto.celular_id,
			situacao_id: SITUACAO_REMOVIDO,
			data_criacao: pegarDataEHoraAtual()[0],
			hora_criacao: pegarDataEHoraAtual()[1],
		}
		if (usuario.removidos) {
			usuario.removidos += 1
		} else {
			usuario.removidos = 1
		}
		await alterarUsuarioNoAsyncStorage(usuario)
		await submeterSituacoes([situacao])
		await alterarProspectoNoAsyncStorage(prospecto)
		Alert.alert('Removido', 'Pessoa removida com sucesso')
	}

	render() {
		const { prospecto, navigation } = this.props
		const { mostrarOpcoes } = this.state
		let parametros = {
			prospecto_id: prospecto._id
		}
		const funcaoOnPressDoIconeList = () => navigation.navigate('Perguntas', parametros)
		let valorDaBarra = 0
		if (
			prospecto.situacao_id === SITUACAO_IMPORTAR ||
			prospecto.situacao_id === SITUACAO_CADASTRO
		) {
			valorDaBarra = 0.25
		}

		if (prospecto.situacao_id === SITUACAO_MENSAGEM) {
			valorDaBarra = 0.50
		}
		if (prospecto.situacao_id === SITUACAO_LIGAR) {
			valorDaBarra = 0.75
		}

		return (
			<Card containerStyle={stylesProspecto.containerCard} key={prospecto.id} >
				<View>
					{
						prospecto.dataParaFinalizarAAcao &&
						(prospecto.situacao_id === SITUACAO_IMPORTAR ||
							prospecto.situacao_id === SITUACAO_CADASTRO ||
							prospecto.situacao_id === SITUACAO_MENSAGEM ||
							prospecto.situacao_id === SITUACAO_LIGAR) &&
						<View>
							<View style={{
								backgroundColor: black, borderTopStartRadius: 6, borderTopEndRadius: 6,
								flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
								paddingVertical: 6, flexWrap: 'wrap'
							}}>
								<Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
									{
										(prospecto.situacao_id === SITUACAO_IMPORTAR ||
											prospecto.situacao_id === SITUACAO_CADASTRO) &&
										'Mensagem até '
									}
									{
										prospecto.situacao_id === SITUACAO_MENSAGEM &&
										'Ligar até '
									}
									{
										prospecto.situacao_id === SITUACAO_LIGAR &&
										'Visitar até '
									}
									{prospecto.dataParaFinalizarAAcao}
								</Text>

							</View>

							<View style={{ flex: 1 }}>
								<ProgressBar progress={valorDaBarra} color={primary} style={{ paddingVertical: 0 }} />
							</View>
						</View>
					}

					<TouchableOpacity
						style={stylesProspecto.containerProspecto}
						onPress={() => { this.setState({ mostrarOpcoes: !mostrarOpcoes }) }} >
						<View style={stylesProspecto.containerName}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text numberOfLines={1} style={[stylesProspecto.text]}>{prospecto.nome}</Text>
							</View>
							{
								prospecto.data &&
								<View style={[stylesProspecto.containerBadge, { justifyContent: 'flex-start', }]}>
									<View style={stylesProspecto.badge}>
										<Text style={stylesProspecto.textBadge}>
											{prospecto.data} - {prospecto.hora} {prospecto.local && `-`} {prospecto.local}
										</Text>
									</View>
								</View>
							}
						</View>
						<View style={stylesProspecto.containerActions}>
							<TouchableOpacity
								style={{
									height: 40,
									width: 40,
									borderRadius: 40 / 2
								}}
								onPress={() => { this.setState({ mostrarOpcoes: !mostrarOpcoes }) }}
								hitSlop={{ top: 15, right: 15, bottom: 15, left: 0 }} >
								<Icon name={!mostrarOpcoes ? 'angle-down' : 'angle-up'} type='font-awesome' color={white} type='font-awesome' size={26}
									containerStyle={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} />
							</TouchableOpacity>
						</View>
					</TouchableOpacity>

					{
						mostrarOpcoes &&
						<View style={[stylesProspecto.containerBadge, { borderTopWidth: 1, borderColor: gray, padding: 10 }]}>
							<View>
								<TouchableOpacity
									style={{ padding: 6, }}
									onPress={() => this.perguntarSeQuerRemover()}
									hitSlop={{ top: 10, right: 5, bottom: 10, left: 10 }} >
									<Icon name="trash" size={24} color={red} type='font-awesome' />
									<Text style={{ color: white, marginTop: 5 }}>Excluir</Text>
								</TouchableOpacity>
							</View>

							<View>
								<TouchableOpacity
									style={{ padding: 6, }}
									onPress={() => { this.executarAcao('ligar') }}
									hitSlop={{ top: 10, right: 5, bottom: 10, left: 5 }} >
									<Icon name="phone" size={24} color={white} />
									<Text style={{ color: white, marginTop: 5 }}>Ligar</Text>
								</TouchableOpacity>
							</View>

							<View>
								<TouchableOpacity
									style={{ padding: 6, }}
									onPress={() => { this.executarAcao('whatsapp') }}
									hitSlop={{ top: 10, right: 5, bottom: 10, left: 5 }} >
									<Icon name="whatsapp" size={24} color={white} type='font-awesome' />
									<Text style={{ color: white, marginTop: 5 }}>Mensagem</Text>
								</TouchableOpacity>
							</View>

							<View>
								<TouchableOpacity
									style={{ padding: 6, }}
									onPress={() => funcaoOnPressDoIconeList()}
									hitSlop={{ top: 10, right: 10, bottom: 10, left: 5 }} >
									<Icon name="play" size={24} color={white} type='font-awesome' />
									<Text style={{ color: white, marginTop: 5 }}>Prosseguir</Text>
								</TouchableOpacity>
							</View>
						</View>
					}

				</View>
			</Card>
		)
	}
}

function mapStateToProps({ usuario }) {
	return {
		usuario,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Prospecto)
