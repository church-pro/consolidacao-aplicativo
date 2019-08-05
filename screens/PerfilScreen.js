import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark } from '../helpers/colors';
import {
	View,
	Text,
} from 'react-native';
import { connect } from 'react-redux'

class PerfilScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	render() {
		const {
			usuario
		} = this.props
		let keys = Object.keys(usuario);
		return (
			<View style={{color: '#000000'}}>
				<Text>
					PerfilScreen
				</Text>
				<Text>
					Progresso
				</Text>
				{
					keys.map(item => (
						<View>
							<Text>
								{item}
							</Text>
							<Text>
								{usuario[item]}
							</Text>
						</View>
					))
				}
			</View>
		)
	}
}

const mapStateToProps = ({usuario}) => {return {usuario}}

export default connect(mapStateToProps, null)(PerfilScreen)
