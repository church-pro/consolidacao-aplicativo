import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark } from '../helpers/colors';
import {
	View,
	Text,
	NetInfo,
	TouchableOpacity,
} from 'react-native';
import {
	clubesNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'

class ClubesScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	state = {
		clubes: [],
	}

	componentDidMount(){
		const {
			usuario
		} = this.props
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if(isConnected){
						clubesNaAPI({no_id: usuario._id})
							.then(retorno => {
								this.setState({clubes: retorno.resultado.clubes})
							})
					} else {
						Alert.alert('Internet', 'Verifique sua internet!')
						this.props.navigation.goBack()
					}
				})
		} catch (err) {

		}
	}

	render() {
		const {
			clubes
		} = this.state
		return (
			<View style={{color: '#000000'}}>
				<Text>
					Meus Clubes
				</Text>
				{
					clubes &&
						clubes.map(clube => 
							<TouchableOpacity
								key={clube._id}
								onPress={() => this.props.navigation.navigate('Clube', {clube})}>
								<Text>
									{clube.nome}
								</Text>
							</TouchableOpacity>
						)
				}
			</View>
		)
	}
}

const mapStateToProps = ({usuario}) => {
	return {usuario}
}

export default connect(mapStateToProps, null)(ClubesScreen)
