import React from 'react';
import {
	View,
	TouchableOpacity,
	Text,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { createBottomTabNavigator } from 'react-navigation'
import { white, gold, dark, lightdark, black, primary } from '../helpers/colors'
import {
	CHURCH_PRO,
} from '../helpers/constants'
import { Header, Title, Left, Body, Right, } from 'native-base'
import InicioScreen from './InicioScreen'
import ProspectosScreen from './ProspectosScreen'
import { LinearGradient } from 'expo'

class PrincipalScreen extends React.Component {

	static navigationOptions = () => {
		return {
			header: null,
		}
	}

	render() {

		const Tabs = createBottomTabNavigator(
			{
				Inicio: {
					screen: InicioScreen,
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (<Icon name='envelope' type='font-awesome' color={tintColor} />),
					},
				},
				Pessoas: {
					screen: InicioScreen,
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (<Icon name='envelope' type='font-awesome' color={tintColor} />),
					},
				},
				Perfil: {
					screen: InicioScreen,
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (<Icon name='envelope' type='font-awesome' color={tintColor} />),
					},
				},
			},
			{
				tabBarOptions: {
					showIcon: true,
					showLabel: true,
					activeTintColor: primary,
					inactiveTintColor: '#eee',
					style: {
						backgroundColor: dark,
					},
					indicatorStyle: {
						backgroundColor: gold,
					},
				}
			}
		)

		return (
			<View>
				<Header style={{ backgroundColor: black, borderBottomWidth: 0, paddingTop: 0, paddingLeft: 10 }} iosBarStyle="light-content">
					<Left style={{ flex: 0 }}>
						<TouchableOpacity
							style={{ backgroundColor: 'transparent', margin: 0, borderWidth: 0, paddingHorizontal: 8 }}>
							<Icon type="font-awesome" name="bars" color={white} />
						</TouchableOpacity>
					</Left>
					<Body style={{ flex: 1 }}>
						<Title style={{ textAlign: 'center', alignSelf: 'center', justifyContent: "center", color: white, fontWeight: '200', fontSize: 16 }}>kakaskdasd</Title>
					</Body>
					<Right style={{ flex: 0 }}>
						<TouchableOpacity
							style={{ backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 8 }}
							onPress={() => this.props.navigation.navigate('ImportarProspectos')}>
							<Icon name='retweet' type='font-awesome' color={white} />
						</TouchableOpacity>
					</Right>
				</Header>
				<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
					<Tabs />
				</LinearGradient>
			</View>
		)
	}
}

export default PrincipalScreen
