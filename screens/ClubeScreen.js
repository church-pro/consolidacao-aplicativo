import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark } from '../helpers/colors';
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux'

class ClubeScreen extends React.Component {

	render() {
		const {
			clube
		} = this.props
		return (
			<View style={{color: '#000000'}}>
				<Text>
					Clube:
					{clube.nome}
				</Text>
				<Text>
					Participantes
				</Text>
				{
					clube.nos && clube.nos.length > 0 &&
						clube.nos.map(no => {
							return (
								<TouchableOpacity
									key={no._id}
									onPress={() => this.props.navigation.navigate('PerfilClube', {no})}>
									<Text>
										{no.nome}
									</Text>	
								</TouchableOpacity>
							)
						})
				}
				{
					clube.nos && clube.nos.length === 0 && 
					<Text>
						Clube sem participantes	
					</Text>
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
