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
	SITUACAO_QUALIFICAR,
	SITUACAO_CONVIDAR,
	SITUACAO_APRESENTAR,
	SITUACAO_ACOMPANHAR,
	SITUACAO_FECHAMENTO,
	SITUACAO_REMOVIDO,
} from '../helpers/constants'
import { alterarProspectoNoAsyncStorage, alterarAdministracao } from '../actions'
import { connect } from 'react-redux'
import styles from './ProspectoStyle';
import Swipeable from 'react-native-swipeable';

class Prospecto extends React.Component {

	removerProspecto() {
		const { prospecto, alterarProspectoNoAsyncStorage } = this.props
		prospecto.situacao_id = SITUACAO_REMOVIDO
		alterarProspectoNoAsyncStorage(prospecto)
		Alert.alert('Removido', 'Prospecto removido!')
	}

	fecharProspecto() {
		const { prospecto, alterarProspectoNoAsyncStorage } = this.props
		prospecto.situacao_id = SITUACAO_FECHAMENTO
		alterarProspectoNoAsyncStorage(prospecto)
		Alert.alert('Sucesso', 'Prospecto pagou!')
	}

	chamarOTelefoneDoCelular() {
		const { prospecto, alterarAdministracao, alterarProspectoNoAsyncStorage } = this.props
		let { administracao } = this.props
		administracao.ligueiParaAlguem = true
		administracao.prospectoSelecionado = prospecto
		alterarAdministracao(administracao)
		prospecto.ligueiParaAlguem = true
		alterarProspectoNoAsyncStorage(prospecto)
		call({ number: prospecto.telefone, prompt: false }).catch(console.error)
	}
	whatsapp() {
		const { prospecto } = this.props
		Linking.openURL(`https://api.whatsapp.com/send?phone=55${prospecto.ddd}${prospecto.telefone}`).catch((err) => console.error(err))
	}
	handleEmail = () => {
		const { prospecto } = this.props
		const to = prospecto.email // string or array of email addresses
		email(to, {
			// Optional additional arguments
			// cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
			// bcc: 'mee@mee.com', // string or array of email addresses
			subject: '',
			body: 'Lista de Ouro App'
		}).catch(console.error)
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
				onPress={() => { this.removerProspecto() }} >
				<Icon name="trash" size={22} color={white} type='font-awesome' />
			</TouchableOpacity>
		]

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
							prospecto.data && prospecto.situacao_id !== SITUACAO_FECHAMENTO &&
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
						<TouchableOpacity
							onPress={() => { navigation.navigate('QualificarProspecto', { prospecto_id: prospecto._id }) }}
						>

							<View style={styles.content}>
								<View style={{ alignItems: 'center', justifyContent: 'center' }}>
									<Icon
										name='star'
										size={34}
										color={blue}
										type='font-awesome'
										containerStyle={{ marginRight: 6 }}
									/>
									<Text style={{ position: "absolute", left: 11.4, top: 9, color: white, fontWeight: 'bold' }}>{prospecto.rating}</Text>
								</View>

								<Text style={[styles.text, style = { fontWeight: 'bold' }]}>{prospecto.nome}</Text>
							</View>
						</TouchableOpacity>

						{/* <View style={[styles.content, style = { marginTop: 5, justifyContent: 'space-between' }]}>
							<View style={{ flexDirection: 'row' }}>

								<View style={{ backgroundColor: dark, padding: 4, borderRadius: 4 }}>
									<TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { this.chamarOTelefoneDoCelular() }} >
										<Icon name="phone" size={18} containerStyle={{ marginRight: 6 }} color={white} />
										<Text style={{ color: white }}>Ligar</Text>
									</TouchableOpacity>
								</View>
								<View style={{ backgroundColor: dark, padding: 4, borderRadius: 4, marginLeft: 5 }}>
									<TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { this.whatsapp() }} >
										<Icon name="whatsapp" size={18} color="#5FCE5F" containerStyle={{ marginRight: 6 }} type='font-awesome' />
										<Text style={{ color: white }}>Whats</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View> */}

						{
							prospecto.situacao_id === SITUACAO_CONVIDAR &&
							<View style={{ backgroundColor: 'transparent', marginLeft: 3, flexDirection: 'row', alignItems: 'center' }}>
								<TouchableOpacity
									hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
									onPress={() => { navigation.navigate('MarcarDataEHora', { prospecto_id: prospecto._id, situacao_id: SITUACAO_APRESENTAR }) }}
								>
									<Icon name='list' type='font-awesome' color={gray} containerStyle={{ marginRight: 12 }} type='font-awesome' />
								</TouchableOpacity>

							</View>
						}
						{
							prospecto.situacao_id === SITUACAO_APRESENTAR &&
							<View style={{ flexDirection: 'row' }}>
								<Text style={{
									alignSelf: "center", marginRight: 5, color: white
								}}>Apresentação feita?</Text>
								<TouchableOpacity
									style={styles.button}
									onPress={() => { navigation.navigate('Perguntas', { prospecto_id: prospecto._id }) }}
								>
									<Text style={styles.textButton}>Sim</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.button, { marginLeft: 5 }]}
									onPress={() => {
										{
											Alert.alert(prospecto.nome, 'O que você deseja fazer com este prospecto?',
												[
													{ text: 'Excluir', onPress: () => { this.removerProspecto() } },
													{ text: 'Remarcar', onPress: () => { navigation.navigate('MarcarDataEHora', { prospecto_id: prospecto._id, situacao_id: SITUACAO_ACOMPANHAR }) } },
													{ text: 'Cancelar' },
												])
										}
									}
									}
								>
									<Text style={styles.textButton}>Não</Text>
								</TouchableOpacity>
							</View>
						}
						{prospecto.situacao_id === SITUACAO_ACOMPANHAR &&

							<View style={styles.footerAcompanhar}>
								<TouchableOpacity
									style={styles.button}
									onPress={() => { navigation.navigate('MarcarDataEHora', { prospecto_id: prospecto._id, situacao_id: SITUACAO_FECHAMENTO }) }}
								>
									<Text style={styles.textButton}>Remarcar</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.button}
									onPress={() => { Alert.alert('Fechar', 'Você deseja fechar este prospecto?', [{ text: 'Não' }, { text: 'Sim', onPress: () => { this.fecharProspecto() } }]) }}
								>
									<Text style={styles.textButton}>Fechamento</Text>
								</TouchableOpacity>
							</View>
						}
						{prospecto.situacao_id == SITUACAO_FECHAMENTO &&
							<View style={styles.footerFechamento}>
								<View
									style={{
										backgroundColor: gold, borderRadius: 9, borderWidth: 0,
										padding: 5
									}}
								>
									<Text style={styles.textButton}>Pago</Text>
								</View>
							</View>
						}
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
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Prospecto)
