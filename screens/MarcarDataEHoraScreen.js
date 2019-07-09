import React from 'react';
import {
	View,
	Text,
	Alert,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { Card, Icon, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { white, dark, gold, lightdark } from '../helpers/colors'
import { connect } from 'react-redux'
import DatePicker from 'react-native-datepicker'
import { alterarProspectoNoAsyncStorage } from '../actions'
import { SITUACAO_APRESENTAR, SITUACAO_ACOMPANHAR, SITUACAO_FECHAMENTO } from '../helpers/constants'

class MarcarDataEHoraScreen extends React.Component {

	alterarProspecto = () => {
		this.setState({carregando: true})
		const { prospecto, alterarProspectoNoAsyncStorage, navigation, situacao_id } = this.props
		if (this.state.dataParaOAgendamento === null ||
			this.state.horaParaOAgendamento === null) {
			Alert.alert('Erro', 'Selecione a data e hora')
		} else {
			prospecto.data = this.state.dataParaOAgendamento
			prospecto.hora = this.state.horaParaOAgendamento
			if (this.state.local) {
				prospecto.local = this.state.local
			}
			prospecto.situacao_id = situacao_id
			alterarProspectoNoAsyncStorage(prospecto)
				.then(() => {
					let textoMarcouUmaApresentacao = ''
					let tab = ''
					switch (situacao_id) {
						case SITUACAO_APRESENTAR:
							textoMarcouUmaApresentacao = 'Você marcou uma apresentação, agora seu prospecto está na etapa "Apresentar"'
							tab = 'Convidar'
							break;
						case SITUACAO_ACOMPANHAR:
							textoMarcouUmaApresentacao = 'Você remarcou, agora seu prospecto está na etapa "Acompanhar"'
							tab = 'Apresentar'
							break;
						case SITUACAO_FECHAMENTO:
							textoMarcouUmaApresentacao = 'Você remarcou, agora seu prospecto está na etapa "Fechamento"'
							tab = 'Acompanhar'
							break;
					}
					Alert.alert('Sucesso', textoMarcouUmaApresentacao)
					this.setState({carregando: false})
					navigation.navigate('Prospectos', {tab})
				})
		}
	}

	componentDidMount() {
		this.props.navigation.setParams({
			alterarProspecto: this.alterarProspecto
		})
	}

	state = {
		carregando: false,
		selecionarDataMostrando: false,
		selecionarHoraMostrando: false,
		dataParaOAgendamento: null,
		horaParaOAgendamento: null,
		local: '',
		date: new Date(),
	}

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state
		return {
			title: 'Marcar Data e Hora',
			headerTitleStyle: {
				flex: 1,
				textAlign: 'center',
				alignSelf: 'center',
				color: white,
			},
			headerTintColor: white,
			headerLeftContainerStyle: {
				padding: 10,
			},
		}
	}


	render() {
		const { prospecto } = this.props
		const { carregando } = this.state

		return (
			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				style={{ backgroundColor: lightdark }}
				keyboardShoulfPersistTaps='always'
				enableOnAndroid enableAutomaticScroll={true} extraScrollHeight={80} >

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

								<View style={{ paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#86939e' }}>
									<Text style={{ fontSize: 16, color: '#86939e', fontWeight: "bold", marginTop: 16 }}>DATA</Text>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<DatePicker
											iconComponent={
												<Icon
													name="calendar"
													type="font-awesome"
													color={gold}
													size={22}
													containerStyle={{ position: 'absolute', left: 10 }}
												/>
											}
											style={{ flex: 1, }}
											date={this.state.dataParaOAgendamento}
											mode="date"
											placeholder=" "
											format="DD/MM/YYYY"
											minDate={this.state.date}
											confirmBtnText="Confirmar"
											cancelBtnText="Cancelar"
											customStyles={{
												dateInput: {
													borderWidth: 0,
													alignItems: "flex-start"
												},
												dateText: {
													color: white,
													fontSize: 18,
													marginLeft: 35,
												}
											}}
											onDateChange={(date) => {
												this.setState({ dataParaOAgendamento: date })
											}}
										/>
									</View>
								</View>
								<View style={{ paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#86939e' }}>
									<Text style={{ fontSize: 16, color: '#86939e', fontWeight: "bold", marginTop: 16 }}>HORA</Text>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<DatePicker
											style={{ flex: 1 }}
											date={this.state.horaParaOAgendamento}
											mode="time"
											placeholder=" "
											is24Hour={true}
											confirmBtnText="Confirmar"
											cancelBtnText="Cancelar"
											iconComponent={
												<Icon
													name="clock-o"
													type="font-awesome"
													color={gold}
													size={22}
													containerStyle={{ position: 'absolute', left: 10 }}
											/>}
											customStyles={{
												dateInput: {
													borderWidth: 0,
													alignItems: 'flex-start',
												},
												dateText: {
													color: white,
													fontSize: 18,
													marginLeft: 35,
												}
											}}
											onDateChange={(date) => {
												this.setState({ horaParaOAgendamento: date })
											}}
										/>
									</View>
								</View>

								<View style={{ paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#86939e' }}>
									<Text style={{ fontSize: 16, color: '#86939e', fontWeight: "bold", marginTop: 16 }}>LOCAL</Text>
									<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
										<Icon
											name="map-marker"
											type="font-awesome"
											color={gold}
											size={22}
											containerStyle={{ marginLeft: 13 }}
										/>
										<TextInput
											keyboardAppearance='dark'
											placeholder=""
											style={{ color: white, fontSize: 18, marginLeft: 6, minHeight: 40, flex: 1 }}
											value={this.local}
											onChangeText={(text) => this.setState({ local: text })}
										/>
									</View>
								</View>
							</Card>

							<View style={styles.containerButton}>
								<TouchableOpacity
									style={styles.button}
									onPress={() => this.alterarProspecto()}
								>
									<Text style={{ textAlign: "center", fontSize: 16 }}>Marcar</Text>
								</TouchableOpacity>
							</View>
						</View>
				}
			</KeyboardAwareScrollView>
		)
	}

}

function mapStateToProps({ prospectos }, { navigation }) {
	const prospecto_id = navigation.state.params.prospecto_id
	return {
		prospecto: prospectos && prospectos.find(prospecto => prospecto.id === prospecto_id),
		situacao_id: navigation.state.params.situacao_id
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MarcarDataEHoraScreen)

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: lightdark,
		// justifyContent: "space-between", 
		paddingBottom: 15
	},
	containerButton: {
		paddingVertical: 15,
		marginHorizontal: 15,
	},
	button: {
		backgroundColor: gold,
		height: 45,
		borderRadius: 6,
		justifyContent: 'center',
	},
})
