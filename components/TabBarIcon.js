import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements';
import { primary, black, dark, gold, red, white, } from '../helpers/colors'

class TabBarIcon extends React.Component {

	render() {
		const {
			navigation,
		} = this.props
		const {
			routes,
		} = navigation.state
		return (
			<View style={{
				backgroundColor: dark,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}>
				{
					routes.map((rota, indice) => {
						let nome = ''
						return <Icon 
							key={indice}
							name='shield' 
							type='font-awesome' 
							color='#FFFFFF' 
							style={{
								marging: 10,
							}}
						/>
					})
				}
			</View>
		)
	}
}

const mapStateToProps = ({usuario}) => {
	return {
		usuario,
	}
}

export default connect(mapStateToProps, null)(TabBarIcon)
