import React from 'react';
import {
	View,
	TouchableOpacity,
	Text,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { white, gold, dark, lightdark, black, primary } from '../helpers/colors'
import { Header, Title, Left, Body, Right, } from 'native-base'
import PerfilScreen from './PerfilScreen'
import { LinearGradient } from 'expo'
import ProspectosScreen from '../screens/ProspectosScreen';
import ImportarProspectosScreen from '../screens/ImportarProspectosScreen';
import MarcarDataEHoraScreen from '../screens/MarcarDataEHoraScreen';
import PerguntasScreen from '../screens/PerguntasScreen';
import ProspectoScreen from '../screens/ProspectoScreen';
import ClubesScreen from '../screens/ClubesScreen';
import ClubeScreen from '../screens/ClubeScreen';
import PontuacaoScreen from '../screens/PontuacaoScreen';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import ConquistasScreen from './ConquistasScreen';

class PrincipalScreen extends React.Component {

	static navigationOptions = () => {
		return {
			header: null,
			gesturesEnabled: false,
		}
	}

	render() {
		const ProspectosStack = createStackNavigator(
			{
				Prospectos: ProspectosScreen,
				ImportarProspectos: ImportarProspectosScreen,
				MarcarDataEHora: MarcarDataEHoraScreen,
				Perguntas: PerguntasScreen,
				Pontuacao: PontuacaoScreen,
				Conquistas: ConquistasScreen,
				Prospecto: ProspectoScreen,
			},
			{
				initialRouteName: 'Conquistas',
				headerStyle: {
					backgroundColor: black,
					borderBottomColor: black
				},
				headerBackTitle: null
			}
		)
		const ClubeStack = createStackNavigator(
			{
				Clubes: ClubesScreen,
				Clube: ClubeScreen,
				PerfilClube: PerfilScreen,
			},
			{
				initialRouteName: 'Clubes',
				headerStyle: {
					backgroundColor: black,
					borderBottomColor: black
				},
				headerBackTitle: null
			}
		)

		const Tabs = createBottomTabNavigator(
			{
				Pessoas: {
					screen: ProspectosStack,
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (<Icon name='users' type='font-awesome' color={tintColor} />),
					},
				},
				Perfil: {
					screen: PerfilScreen,
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (<Icon name='user' type='font-awesome' color={tintColor} />),
					},
				},
				Clubes: {
					screen: ClubeStack,
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (<Icon name='shield' type='font-awesome' color={tintColor} />),
					},
				},
			},
			{
				initialRouteName: 'Pessoas',
				tabBarOptions: {
					showIcon: true,
					showLabel: true,
					activeTintColor: primary,
					inactiveTintColor: '#eee',
					style: {
						backgroundColor: dark,
						pading: 10,
					},
					indicatorStyle: {
						backgroundColor: gold,
					},
				}
			}
		)

		return (<Tabs />)
	}
}

export default PrincipalScreen
