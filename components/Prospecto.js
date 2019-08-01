import React from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Linking,
	Dimensions,
} from 'react-native';
import { Card, Icon, } from 'react-native-elements'
import { white, gray, primary, yellow, gold, lightdark } from '../helpers/colors'
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

class Prospecto extends React.Component {

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
			<Card containerStyle={stylesProspecto.containerCard} key={prospecto.id}>
				<View style={[stylesProspecto.containerBadge, { justifyContent: 'flex-start' }]}>
					{
						prospecto.data &&
						<View style={stylesProspecto.badge}>
							<Text style={stylesProspecto.textBadge}>
								{prospecto.data} - {prospecto.hora} {prospecto.local && `-`} {prospecto.local}
							</Text>
						</View>
					}
				</View>

				{
					prospecto.dataParaFinalizarAAcao &&
						(prospecto.situacao_id === SITUACAO_IMPORTAR ||
							prospecto.situacao_id === SITUACAO_CADASTRO ||
							prospecto.situacao_id === SITUACAO_MENSAGEM ||
							prospecto.situacao_id === SITUACAO_LIGAR) &&
						<View>
							<Text style={{color: '#FFFFFF'}}>
								{
									(prospecto.situacao_id === SITUACAO_IMPORTAR ||
										prospecto.situacao_id === SITUACAO_CADASTRO) &&
									'Voce precisa enviar uma mensagem ate '
								}
								{
									prospecto.situacao_id === SITUACAO_MENSAGEM &&
										'Voce precisa ligar ate '
								}
								{
									prospecto.situacao_id === SITUACAO_LIGAR &&
										'Voce tem que visitar ate '
								}
								{prospecto.dataParaFinalizarAAcao}
							</Text>
						</View>
				}
				
				<View style={stylesProspecto.containerProspecto}>
					<View style={stylesProspecto.containerName}>
						<View style={{ backgroundColor: lightdark, padding: 5, marginRight: 5 }}>
							<Icon name="user" type="font-awesome" color={white} />
						</View>
						<Text style={[stylesProspecto.text]}>{prospecto.nome}</Text>
					</View>
					<View style={stylesProspecto.containerActions}>
						<TouchableOpacity
							style={{ padding: 5 }} onPress={() => { this.chamarOTelefoneDoCelular() }}
							hitSlop={{ top: 15, right: 0, bottom: 15, left: 15 }}
						>
							<Icon name="phone" size={20} color={white} />
						</TouchableOpacity>
						<TouchableOpacity
							style={{ padding: 5 }} onPress={() => { this.whatsapp() }}
							hitSlop={{ top: 15, right: 5, bottom: 15, left: 0 }}
						>
							<Icon name="whatsapp" size={20} color={white} type='font-awesome' />
						</TouchableOpacity>
						<TouchableOpacity
							style={{ padding: 5 }} onPress={() => funcaoOnPressDoIconeList()}
							hitSlop={{ top: 15, right: 15, bottom: 15, left: 0 }}
						>
							<Icon name='list' type='font-awesome' color={white} type='font-awesome' />
						</TouchableOpacity>
					</View>
				</View>


				<View style={[stylesProspecto.containerBadge, { borderTopWidth: 1, borderColor: gray }]}>
					{
						listaDeMedalhas.map(medalha =>
							<View
								key={prospecto._id + medalha.icone}
								style={[stylesProspecto.containerBadgeIcons]}
							>
								<Icon
									name={medalha.icone}
									type='font-awesome'
									color={medalha.cor}
									size={medalha.icone === 'envelope' || medalha.icone === 'calendar' ? 26 : 28}

								/>
							</View>
						)
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
