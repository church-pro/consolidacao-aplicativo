import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark } from '../helpers/colors';
import {
	View,
	Text,
} from 'react-native';
import { connect } from 'react-redux'

class ClubeScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	render() {
		const {
			clube
		} = this.props
		return (
			<View style={{color: '#000000'}}>
				<Text>
					{clube.nome}
				</Text>
				{
					clube.nos &&
						clube.nos.map(mo => {
							return (
								<Text>
									{no.nome}
								</Text>
							)
						})
				}
			</View>
		)
	}
}

const mapStateToProps = (state, {navigation}) => {
	const {
		clube
	} = navigation.state.params
	return {
		clube,
	}
}

export default connect(mapStateToProps, null)(ClubeScreen)
