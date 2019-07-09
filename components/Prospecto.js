import React from 'react';
import {
	Text,
	View,
	Alert,
	TouchableOpacity,
	Linking
} from 'react-native';
import { Card, Icon, Badge } from 'react-native-elements'
import { white, lightdark, gold, dark } from '../helpers/colors'
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
		return (

			<Card containerStyle={styles.containerCard} key={prospecto.id}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					{
						prospecto.data && prospecto.situacao_id !== SITUACAO_FECHAMENTO &&
						<View style={styles.date}>
							<View style={{
								borderRadius: 9, backgroundColor: gold, borderWidth: 0,
								paddingHorizontal: 4, paddingVertical: 2
							}}>
							<Text style={{ color: white, fontSize: 12 }}>
								{prospecto.data} - {prospecto.hora} {prospecto.local && `-`} {prospecto.local}
							</Text>
						</View>
					</View>
					}
					{
						prospecto.rating &&
							<View style={[styles.rating, style = { alignItems: 'center' }]}>
								<Icon name='star' type="font-awesome" size={14} color={gold} />
								<Text style={{ color: gold }}> {prospecto.rating} </Text>
							</View>
					}
				</View>
				<View style={styles.name_phone}>
					<View style={styles.content}>
						<Text style={[styles.text, style = { fontWeight: 'bold' }]}>{prospecto.nome}</Text>

						{prospecto.online &&
								<View style={{ marginLeft: 5, backgroundColor: gold, padding: 3, flexDirection: "row", borderRadius: 4, alignItems: "center" }}>
									<Icon name="globe" type='font-awesome' color={white} size={16} containerStyle={{ marginRight: 4 }} />
									<Text style={{ color: white }}>web</Text>
								</View>
						}
					</View>

					<View style={styles.content}>
						<Text style={[styles.text, style = { marginTop: 5 }]}>({prospecto.ddd}) {prospecto.telefone}</Text>
					</View>

					<View style={[styles.content, style = { marginTop: 5, justifyContent: 'space-between' }]}>
						<View style={{flexDirection: 'row'}}>

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
							<View style={{ backgroundColor: dark, padding: 4, borderRadius: 4, marginLeft: 5 }}>
								<TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { this.handleEmail() }} >
									<Icon name="envelope" size={18} color={white} containerStyle={{ marginRight: 6 }} type='font-awesome' />
									<Text style={{ color: white }}>Email</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.subFooter}>

					<Icon
						name='trash'
						type='font-awesome'
						color={lightdark}
						onPress={() => {
							Alert.alert('Remover', 'Você deseja remover este prospecto?',
								[{ text: 'Não' },
									{ text: 'Sim', onPress: () => { this.removerProspecto() } }])
						}
						}
					/>

				{
					prospecto.situacao_id === SITUACAO_QUALIFICAR &&
						<View style={styles.footerQualificar}>
							<Icon
								name='pencil'
								type='font-awesome'
								color={lightdark}
								onPress={() => { navigation.navigate('Prospecto', { prospecto_id: prospecto._id }) }}
							/>

						<TouchableOpacity
							style={styles.button}
							onPress={() => { navigation.navigate('QualificarProspecto', { prospecto_id: prospecto._id }) }}
						>
							<Text style={styles.textButton}>Qualificar</Text>
						</TouchableOpacity>
					</View>
				}
				{
					prospecto.situacao_id === SITUACAO_CONVIDAR &&
						<View style={styles.footerConvidar}>
							<TouchableOpacity
								style={styles.button}
								onPress={() => { navigation.navigate('MarcarDataEHora', { prospecto_id: prospecto._id, situacao_id: SITUACAO_APRESENTAR }) }}
							>
								<Text style={styles.textButton}>Marcar Apresentação</Text>
							</TouchableOpacity>

						</View>
				}
				{
					prospecto.situacao_id === SITUACAO_APRESENTAR &&
						<View style={styles.footerAPN}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ alignSelf: "center", marginRight: 5 }}>Apresentação feita?</Text>
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
