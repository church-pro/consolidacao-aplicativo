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
import { styles } from './Styles';
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

		return (
			<Card containerStyle={styles.containerCard} key={prospecto.id}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					{
						prospecto.data &&
						<View style={styles.date}>
							<View style={{
								borderRadius: 9, backgroundColor: primary, borderWidth: 0,
								paddingHorizontal: 4, paddingVertical: 2
							}}>
								<Text style={{ color: white, fontSize: 12 }}>
									{prospecto.data} - {prospecto.hora} {prospecto.local && `-`} {prospecto.local}
								</Text>
							</View>
						</View>
					}

				</View>
				<View style={styles.name_phone}>
					<View style={styles.content}>
						<Text style={[styles.text, style = { fontWeight: 'bold' }]}>{prospecto.nome}</Text>
					</View>
					<View style={{ backgroundColor: 'transparent', marginLeft: 3, flexDirection: 'row', alignItems: 'center' }}>
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
