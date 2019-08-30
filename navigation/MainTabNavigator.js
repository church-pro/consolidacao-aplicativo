import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import TutorialScreen from '../screens/TutorialScreen'
import ProspectosScreen from '../screens/ProspectosScreen';
import ImportarProspectosScreen from '../screens/ImportarProspectosScreen';
import MarcarDataEHoraScreen from '../screens/MarcarDataEHoraScreen';
import PerguntasScreen from '../screens/PerguntasScreen';
import ProspectoScreen from '../screens/ProspectoScreen';
import ClubesScreen from '../screens/ClubesScreen';
import ClubeScreen from '../screens/ClubeScreen';
import PontuacaoScreen from '../screens/PontuacaoScreen';
import ConquistasScreen from '../screens/ConquistasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { primary, black, dark, gold } from '../helpers/colors'
import { Icon } from 'react-native-elements'
import AtualizacoesScreen from '../screens/AtualizacoesScreen';

export const AutenticacaoStack = createStackNavigator(
	{
		Login: LoginScreen,
		Registro: RegistroScreen,
		Tutorial: TutorialScreen,
	},
	{
		initialRouteName: 'Login',
		navigationOptions: {
			headerStyle: {
				backgroundColor: black,
				borderBottomColor: black
			},
			headerBackTitle: null
		},
	}
)

const ProspectosStack = createStackNavigator(
	{
		Prospectos: ProspectosScreen,
		ImportarProspectos: ImportarProspectosScreen,
		MarcarDataEHora: MarcarDataEHoraScreen,
		Perguntas: PerguntasScreen,
		Pontuacao: PontuacaoScreen,
		Conquistas: ConquistasScreen,
		Prospecto: ProspectoScreen,
		Atualizacoes: AtualizacoesScreen,
	},
	{
		initialRouteName: 'Prospectos',
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
		},
	}
)

export const PrincipalStack = createStackNavigator(
	{
		Principal: Tabs,
	},
	{
		initialRouteName: 'Principal',
		navigationOptions: {
			header: null,
		},
		gesturesEnabled: false,
	}
)
