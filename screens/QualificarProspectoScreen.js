import React from 'react';
import {
	View,
	Text,
	Alert,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings'
import { white, lightdark, dark, gray, gold, black } from '../helpers/colors'
import { connect } from 'react-redux'
import { alterarProspectoNoAsyncStorage } from '../actions'
import { SITUACAO_CONVIDAR } from '../helpers/constants'
import { LinearGradient } from 'expo'
import CPButton from '../components/CPButton';

class QualificarProspectoScreen extends React.Component {

	alterarProspecto = () => {
		this.setState({ carregando: true })
		if (this.state.rating > 0) {
			const { prospecto, alterarProspectoNoAsyncStorage, navigation } = this.props
			prospecto.rating = this.state.rating
			prospecto.situacao_id = SITUACAO_CONVIDAR
			alterarProspectoNoAsyncStorage(prospecto)
				.then(() => {
					Alert.alert('Qualificado', 'Agora seu prospecto está na etapa "Convidar"')
					this.setState({ carregando: false })
					navigation.goBack()
				})
		} else {
			Alert.alert('Aviso', 'Selecione uma qualificação')
		}
	}

	componentDidMount() {
		this.props.navigation.setParams({
			alterarProspecto: this.alterarProspecto
		})
	}

	state = {
		carregando: false,
		rating: 0,
	}

	static navigationOptions = ({ navigation, }) => {
		const { params = {} } = navigation.state
		return {
			// title: 'Qualificar',
			headerStyle: {
				backgroundColor: black,
				borderBottomWidth: 0,
			},
			headerTitleStyle: {
				flex: 1,
				textAlign: 'center',
				alignSelf: 'center',
			},
			headerLeftContainerStyle: {
				padding: 10,
			},
			headerTintColor: white,
		}
	}


	render() {
		const { prospecto } = this.props
		const { carregando } = this.state

		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>

				{
					carregando &&
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<ActivityIndicator
							size="large"
							color={gold}
						/>
					</View>
				}

				{
					!carregando &&
					<View style={styles.container}>

						<Text style={{ textAlign: "center", color: gray, fontSize: 18 }}>
							Qualifique o prospecto de acordo com o nível de interesse
							</Text>

						<View>
							<Text style={styles.name}>
								{prospecto && prospecto.nome}
							</Text>

							<AirbnbRating
								showRating={false}
								defaultRating={this.state.rating}
								onFinishRating={(valor) => this.setState({ rating: valor })}
							/>
						</View>

						<View>
							<CPButton
								title="Qualificar"
								OnPress={() => this.alterarProspecto()}
							/>
						</View>
					</View>
				}

			</LinearGradient>
		)
	}
}

function mapStateToProps({ prospectos }, { navigation }) {
	const prospecto_id = navigation.state.params.prospecto_id + ''
	return {
		prospecto: prospectos && prospectos.find(prospecto => prospecto._id === prospecto_id)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(QualificarProspectoScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		justifyContent: "space-between",
		paddingBottom: 15,
	},
	name: {
		textAlign: "center",
		fontSize: 27,
		color: white,
		paddingVertical: 6,
	},
	button: {
		backgroundColor: gold,
		height: 45,
		borderRadius: 6,
		justifyContent: 'center',
		marginHorizontal: 12,
	},
})
