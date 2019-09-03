import React from 'react';
import { black, lightdark, gray, dark, primary, white } from '../helpers/colors';
import {
	View,
	Text,
} from 'react-native';
import { LinearGradient } from 'expo'

class AtualizacoesScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
		gesturesEnabled: false,
	}

	render() {

		return (
			<LinearGradient style={{ flex: 1, padding: 20, }} colors={[black, dark, lightdark, '#343434']}>
				<Text 
					style={{
						color: white,
					}}>
					AtualizacoesScreen
				</Text>
			</LinearGradient>
		)
	}
}

export default AtualizacoesScreen
