import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, dark, gray } from '../helpers/colors';
import {
	View,
	Text,
	TouchableOpacity,
	Image
} from 'react-native';
import { connect } from 'react-redux'
import empty from '../assets/images/empty.png'

class ClubeScreen extends React.Component {

	static navigationOptions = ({ navigation, }) => {
		const { params = { clube } } = navigation.state
		return {
			title: params.clube.nome,
			headerStyle: {
				backgroundColor: dark,
				borderBottomWidth: 0,
			},

			headerTintColor: white,

		}
	}

	render() {
		const {
			clube
		} = this.props

		console.log(clube)

		return (

			<View style={{ flex: 1, backgroundColor: dark, padding: 20 }}>

				<Text style={{ color: white, fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>
					Participantes
				</Text>
				<View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>

					{
						clube.nos && clube.nos.length > 0 &&
						clube.nos.map(no => {
							return (
								<TouchableOpacity
									style={{
										borderTopWidth: 1,
										borderTopColor: dark,
										padding: 12,
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
									key={no._id}
									onPress={() => this.props.navigation.navigate('PerfilClube', { no })}>
									<Text style={{ color: white }}>
										{no.nome}
									</Text>
									<Text style={{ color: white }}>
										127 pontos
									</Text>

								</TouchableOpacity>
							)
						})
					}
				</View>

				{
					clube.nos && clube.nos.length === 0 &&
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<Image source={empty} style={{ height: 100, width: 100 }} />
						<Text style={{ color: gray, fontSize: 16, marginVertical: 15 }}>
							Clube sem participantes
					</Text>
					</View>
				}
			</View>
		)
	}
}

const mapStateToProps = (state, { navigation }) => {
	const {
		clube
	} = navigation.state.params
	return {
		clube,
	}
}

export default connect(mapStateToProps, null)(ClubeScreen)
