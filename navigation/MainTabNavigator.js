import React from 'react';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import ProspectosScreen from '../screens/ProspectosScreen';
import ImportarProspectosScreen from '../screens/ImportarProspectosScreen';
import QualificarProspectoScreen from '../screens/QualificarProspectoScreen';
import MarcarDataEHoraScreen from '../screens/MarcarDataEHoraScreen';
import PerguntasScreen from '../screens/PerguntasScreen';
import { white, red, dark } from '../helpers/colors'

const ProspectosStack = createStackNavigator(
	{
		Prospectos: ProspectosScreen,
		ImportarProspectos: ImportarProspectosScreen,
		QualificarProspecto: QualificarProspectoScreen,
		MarcarDataEHora: MarcarDataEHoraScreen,
		Perguntas: PerguntasScreen,
	}, 
	{
		initialRouteName: 'Prospectos',
		navigationOptions: {
			headerStyle: {
				backgroundColor: dark,
				borderBottomColor: dark
			},
			headerBackTitle: null
		},
	}
)

export default ProspectosStack
