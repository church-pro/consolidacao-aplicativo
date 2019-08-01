import React from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Linking
} from 'react-native';
import { Card, Icon, } from 'react-native-elements'
import { white, gray, primary } from '../helpers/colors'
import call from 'react-native-phone-call'
import {
	alterarProspectoNoAsyncStorage,
	adicionarSituacoesAoAsyncStorage,
} from '../actions'
import { connect } from 'react-redux'
import { styles, stylesProspecto } from './Styles';
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
		for(let x = 1;x <= 4;x++){
			let icone = ''
			switch(x){
				case 1: icone = 'envelope'; break;
				case 2: icone = 'phone'; break;
				case 3: icone = 'calendar'; break;
				case 4: icone = 'home'; break;
			}
			const medalha = {
				icone,
				cor: prospecto.situacao_id >= x ? '#FFFFFF' : '#AAAAAA',
			}
			listaDeMedalhas.push(medalha)
		}
		return (
			<Card containerStyle={stylesProspecto.containerCard} key={prospecto.id}>
				<View style={stylesProspecto.containerBadge}>
					{
						prospecto.data &&
						<View style={stylesProspecto.badge}>
							<Text style={stylesProspecto.textBadge}>
								{prospecto.data} - {prospecto.hora} {prospecto.local && `-`} {prospecto.local}
							</Text>
						</View>
					}
				</View>

				<View style={stylesProspecto.containerProspecto}>
					<View style={stylesProspecto.containerName}>
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


				<View style={stylesProspecto.containerBadge}>
					<TouchableOpacity
						style={{ padding: 5 }} 
						hitSlop={{ top: 15, right: 15, bottom: 15, left: 0 }}
					>
						{
							listaDeMedalhas.map(medalha => <Icon name={medalha.icone} type='font-awesome' color={medalha.cor} type='font-awesome' />)
						}
					</TouchableOpacity>
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
