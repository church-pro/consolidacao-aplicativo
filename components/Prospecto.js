import React from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Linking,
	Dimensions,
} from 'react-native';
import { Card, Icon, } from 'react-native-elements'
import { white, gray, primary, yellow, gold, lightdark, black, red } from '../helpers/colors'
import call from 'react-native-phone-call'
import {
	alterarProspectoNoAsyncStorage,
	adicionarSituacoesAoAsyncStorage,
} from '../actions'
import { connect } from 'react-redux'
import { styles, stylesProspecto } from './Styles';
import {
	SITUACAO_IMPORTAR,
	SITUACAO_CADASTRO,
	SITUACAO_MENSAGEM,
	SITUACAO_LIGAR,
	SITUACAO_VISITA,
} from '../helpers/constants'
import {
	pegarDataEHoraAtual,
	montarObjetoParaPerguntas,
} from '../helpers/helper'
import { ProgressBar, Colors } from 'react-native-paper'

class Prospecto extends React.Component {

	state = {
		mostrarOpcoes: false
	}

	chamarOTelefoneDoCelular() {
		const { prospecto } = this.props
		call({ number: prospecto.telefone, prompt: false }).catch(console.error)
	}
	whatsapp() {
		const { prospecto } = this.props
		Linking.openURL(`https://api.whatsapp.com/send?phone=55${prospecto.ddd}${prospecto.telefone}`).catch((err) => console.error(err))
	}

	render() {
		const { prospecto, navigation } = this.props
		const { mostrarOpcoes } = this.state

		let parametros = montarObjetoParaPerguntas(prospecto.situacao_id)
		parametros.prospecto_id = prospecto._id
		const funcaoOnPressDoIconeList = () => navigation.navigate('Perguntas', parametros)

		let listaDeMedalhas = []
		for (let x = 1; x <= 4; x++) {
			let icone = ''
			switch (x) {
				case 1: icone = 'envelope'; break;
				case 2: icone = 'phone'; break;
				case 3: icone = 'calendar'; break;
				case 4: icone = 'home'; break;
			}
			const medalha = {
				icone,
				cor: prospecto.situacao_id >= x ? gold : '#AAAAAA',
			}
			listaDeMedalhas.push(medalha)
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
								<ProgressBar progress={0.5} color={primary} style={{ paddingVertical: 0 }} />
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
								<View style={[stylesProspecto.containerBadge, { justifyContent: 'flex-start', paddingLeft: 23 }]}>
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
									onPress={() => { }}
									hitSlop={{ top: 10, right: 5, bottom: 10, left: 10 }}
								>
									<Icon name="trash" size={24} color={red} type='font-awesome' />
								</TouchableOpacity>
								<Text style={{ color: white }}>Excluir</Text>
							</View>

							<View>
								<TouchableOpacity
									style={{ padding: 6, }}
									onPress={() => { this.chamarOTelefoneDoCelular() }}
									hitSlop={{ top: 10, right: 5, bottom: 10, left: 5 }}
								>
									<Icon name="phone" size={24} color={white} />
								</TouchableOpacity>
								<Text style={{ color: white }}>Ligar</Text>
							</View>

							<View>
								<TouchableOpacity
									style={{ padding: 6, }}
									onPress={() => { this.whatsapp() }}
									hitSlop={{ top: 10, right: 5, bottom: 10, left: 5 }}
								>
									<Icon name="whatsapp" size={24} color={white} type='font-awesome' />
								</TouchableOpacity>
								<Text style={{ color: white }}>Mensagem</Text>
							</View>

							<View>
								<TouchableOpacity
									style={{ padding: 6, }}
									onPress={() => funcaoOnPressDoIconeList()}
									hitSlop={{ top: 10, right: 10, bottom: 10, left: 5 }}
								>
									<Icon name="play" size={24} color={white} type='font-awesome' />
								</TouchableOpacity>
								<Text style={{ color: white }}>Prosseguir</Text>
							</View>
						</View>
					}

				</View>
			</Card>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
		adicionarSituacoesAoAsyncStorage: (situacoes) => dispatch(adicionarSituacoesAoAsyncStorage(situacoes)),
	}
}

export default connect(null, mapDispatchToProps)(Prospecto)
