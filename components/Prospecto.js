import React from 'react';
import {
	Text,
	View,
	Alert,
	TouchableOpacity,
	Linking
} from 'react-native';
import { Card, Icon, Badge } from 'react-native-elements'
import { white, gray, gold, dark, blue } from '../helpers/colors'
import call from 'react-native-phone-call'
import email from 'react-native-email'
import {
	SITUACAO_IMPORTAR,
	SITUACAO_MENSAGEM,
	SITUACAO_LIGAR,
	SITUACAO_VISITA,
	SITUACAO_EVENTO,
	SITUACAO_REMOVIDO,
	SITUACAO_MENSAGEM_NUMERO_INVALIDO,
	SITUACAO_LIGAR_NUMERO_INVALIDO,
	SITUACAO_LIGAR_APENAS_TOCOU,
	SITUACAO_LIGAR_MARCOU_VISITA_SEM_FALAR,
	SITUACAO_LIGAR_FALEI_MAS_NAO_MARQUEI,
	SITUACAO_VISITA_DESMARCOU,
	SITUACAO_VISITEI_MAS_NAO_CONVIDEI,
	SITUACAO_VISITA_NAO_FUI,
	SITUACAO_EVENTO_NAO_VEIO,
} from '../helpers/constants'
import { 
	alterarProspectoNoAsyncStorage, 
	alterarAdministracao,
	adicionarSituacoesAoAsyncStorage,
} from '../actions'
import { connect } from 'react-redux'
import styles from './ProspectoStyle';
import Swipeable from 'react-native-swipeable';
import {
	pegarDataEHoraAtual,
	montarObjetoParaPerguntas,
} from '../helpers/helper'

class Prospecto extends React.Component {

	perguntaSeDesejaRemover(){
		Alert.alert(
			'Remover',
			'Reamente deseja remover?',
			[
				{
					text: 'Não',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ 
					text: 'Sim', 
					onPress: () => this.removerProspecto() 
				},
			],
			{ 
				cancelable: false 
			},
		)

	}

	removerProspecto() {
		const { 
			prospecto, 
			alterarProspectoNoAsyncStorage,
			adicionarSituacoesAoAsyncStorage,
		} = this.props

		prospecto.situacao_id = SITUACAO_REMOVIDO
		alterarProspectoNoAsyncStorage(prospecto)
			.then(() => {
				const situacao = {
					prospecto_id: prospecto.celular_id,
					situacao_id: SITUACAO_REMOVIDO,
					data_criacao: pegarDataEHoraAtual()[0],
					hora_criacao: pegarDataEHoraAtual()[1],
				}
				this.props.adicionarSituacoesAoAsyncStorage([situacao])
					.then(() => Alert.alert('Removido', 'Prospecto removido!'))
			})
	}

	fecharProspecto() {
		const { prospecto, alterarProspectoNoAsyncStorage } = this.props
		prospecto.situacao_id = SITUACAO_FECHAMENTO
		alterarProspectoNoAsyncStorage(prospecto)
		Alert.alert('Sucesso', 'Prospecto pagou!')
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

		const rightButtons = [

			<TouchableOpacity
				onPress={() => { navigation.navigate('Prospecto', { prospecto_id: prospecto._id }) }}
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-start',
					backgroundColor: blue,
					paddingLeft: 30,
				}}
			>
				<Icon name="pencil" size={22} color={white} type='font-awesome' />
			</TouchableOpacity>,
			<TouchableOpacity
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-start',
					backgroundColor: blue,
					paddingLeft: 30,
				}}
				onPress={() => { this.perguntaSeDesejaRemover() }} >
				<Icon name="trash" size={22} color={white} type='font-awesome' />
			</TouchableOpacity>
		]

		let parametros = montarObjetoParaPerguntas(prospecto.situacao_id)
		parametros.prospecto_id = prospecto._id
		const funcaoOnPressDoIconeList = () => navigation.navigate('Perguntas', parametros)

		return (
			<Card containerStyle={styles.containerCard} key={prospecto.id}>
				<Swipeable
					rightButtons={rightButtons}
					onRef={ref => this.swipeable = ref}
					onSwipeStart={this.props.onSwipeStart}
					onSwipeRelease={this.props.onSwipeRelease}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
						{
							prospecto.data &&
							<View style={styles.date}>
								<View style={{
									borderRadius: 9, backgroundColor: blue, borderWidth: 0,
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

							<TouchableOpacity style={{ padding: 5 }} onPress={() => { this.chamarOTelefoneDoCelular() }}
								hitSlop={{ top: 15, right: 0, bottom: 15, left: 15 }}
							>
								<Icon name="phone" size={20} color={white} />
							</TouchableOpacity>
						<TouchableOpacity style={{ padding: 5 }} onPress={() => { this.whatsapp() }}
							hitSlop={{ top: 15, right: 15, bottom: 15, left: 0 }}
						>
							<Icon name="whatsapp" size={20} color="#5FCE5F" type='font-awesome' />
						</TouchableOpacity>

						<TouchableOpacity
							hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
							onPress={() => funcaoOnPressDoIconeList()}>
							<Icon name='list' type='font-awesome' color={gray} containerStyle={{ marginRight: 12 }} type='font-awesome' />
						</TouchableOpacity>
					</View>

				</View>
			</Swipeable>
		</Card>
		)
	}
}

function mapStateToProps({ administracao }) {
	return {
		administracao
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
		alterarAdministracao: (administracao) => dispatch(alterarAdministracao(administracao)),
		adicionarSituacoesAoAsyncStorage: (situacoes) => dispatch(adicionarSituacoesAoAsyncStorage(situacoes)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Prospecto)
