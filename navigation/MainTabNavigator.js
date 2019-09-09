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
import NotificacoesScreen from '../screens/NotificacoesScreen';
import AtualizacoesScreen from '../screens/AtualizacoesScreen';
import MissoesScreen from '../screens/MissoesScreen';
import MissaoScreen from '../screens/MissaoScreen';
import TabBarIcon from '../components/TabBarIcon';
import { primary, black, dark, gold, red, white, } from '../helpers/colors'
import { Icon } from 'react-native-elements'
import { View, Text, } from 'react-native'

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

const NotificacoesStack = createStackNavigator(
	{
		Notificações: NotificacoesScreen,
		Atualizacoes: AtualizacoesScreen,
	},
	{
		initialRouteName: 'Notificações',
		headerStyle: {
			backgroundColor: black,
			borderBottomColor: black
		},
		headerBackTitle: null
	}
)

const MissoesStack = createStackNavigator(
	{
		Missoes: MissoesScreen,
		Missao: MissaoScreen,
	},
	{
		initialRouteName: 'Missoes',
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
		},
		Perfil: {
			screen: PerfilScreen,
		},
		Clubes: {
			screen: ClubeStack,
		},
		Notificações: {
			screen: NotificacoesStack,
		},
		Missões: {
			screen: MissoesStack,
		},
	},
	{
		initialRouteName: 'Pessoas',
		tabBarComponent: TabBarIcon,
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
