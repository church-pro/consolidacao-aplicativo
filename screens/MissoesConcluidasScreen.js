import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, dark, primary, gray, red } from '../helpers/colors';
import {
	View,
	Text,
	NetInfo,
	TouchableOpacity,
	TextInput,
	Alert,
	ScrollView,
} from 'react-native';
import { connect } from 'react-redux'
import { ProgressBar, Colors } from 'react-native-paper'

class MissoesConcluidasScreen extends React.Component {

	static navigationOptions = () => {
		return {
			headerTintColor: white,
			header: null,
		}
	}

	state = {
		missoes: [],
	}

	async componentDidMount() {
		let {
			missoes,
		} = this.props

		await this.setState({
			missoes,
		})
	}

	ajudadorDeSubmissao(){
		const {
			missoes,
		} = this.state

		let paraOndeNavegar = 'Prospectos'
		this.props.navigation.navigate(paraOndeNavegar)
	}

	render() {
		const {
			missoes,
		} = this.state
		return (
			<View style={{ flex: 1, backgroundColor: lightdark, alignItems: 'center', padding: 20 }}>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Text style={{ color: white, fontWeight: 'bold', textAlign: 'center', fontSize: 22, marginVertical: 16 }}>
						Parabéns
					</Text>
					<Text style={{ color: white, fontWeight: 'bold', textAlign: 'center', fontSize: 12, marginVertical: 16 }}>
						Missões Concluídas
					</Text>

					<View style={{
						alignItems: 'center',
						flexDirection: 'column',
						flex: 1,
					}}>
					{
						missoes.map(item => {
							const container = {
								padding: 10,
								borderWidth: 1,
								borderColor: gray,
								borderRadius: 6,
								marginTop: 10,
								height: 75,
								width: 300,
							}

							const retorno =	
								<View 
									key={item.missao._id}
									style={container}>
									<Text style={{ color: white, alignSelf: 'center' }}>{item.missao.nome}</Text>
									<Text style={{ color: white, alignSelf: 'center', fontSize: 8, }}>{item.missao.data_inicial} até {item.missao.data_final}</Text>
									<Text style={{ fontWeight: 'bold', color: primary, alignSelf: 'center', fontSize: 24}}>{item.missao.pontos} XP</Text>
								</View>

								return retorno
						})
					}
				</View>

			</View>

			<TouchableOpacity
				onPress={() => this.ajudadorDeSubmissao()}
				style={{
					width: '100%',
					backgroundColor: primary,
					height: 45,
					borderRadius: 6,
					justifyContent: 'center',
					shadowOffset: { width: 5, height: 5, },
					shadowColor: 'rgba(0,0,0,0.3)',
					shadowOpacity: 1.5,
				}} >
				<Text style={{ textAlign: "center", fontSize: 16, color: white }}>
					Continuar
				</Text>
			</TouchableOpacity>
		</View>
		)
	}
}

const mapStateToProps = (state, {navigation}) => {
	const {
		missoes,
	} = navigation.state.params
	return { 
		missoes,
	}
}

export default connect(mapStateToProps, null)(MissoesConcluidasScreen)
