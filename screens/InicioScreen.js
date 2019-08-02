import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark } from '../helpers/colors';
import {
	View,
	Text,
} from 'react-native';
import { Icon } from 'react-native-elements'

class InicioScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	render() {
		return (
			<View>
				<Text style={{color: '#000000'}}>
					InicioScreen
				</Text>
			</View>
		)
	}
}

export default InicioScreen
