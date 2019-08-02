import React from 'react';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import ProspectosScreen from '../screens/ProspectosScreen';
import ImportarProspectosScreen from '../screens/ImportarProspectosScreen';
import QualificarProspectoScreen from '../screens/QualificarProspectoScreen';
import MarcarDataEHoraScreen from '../screens/MarcarDataEHoraScreen';
import PerguntasScreen from '../screens/PerguntasScreen';
import ProspectoScreen from '../screens/ProspectoScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import SincronizacaoScreen from '../screens/SincronizacaoScreen';
import PrincipalScreen from '../screens/PrincipalScreen';
import InicioScreen from '../screens/InicioScreen';
import { white, dark, black } from '../helpers/colors'

const ProspectosStack = createStackNavigator(
    {
        Prospectos: ProspectosScreen,
        ImportarProspectos: ImportarProspectosScreen,
        QualificarProspecto: QualificarProspectoScreen,
        MarcarDataEHora: MarcarDataEHoraScreen,
        Perguntas: PerguntasScreen,
        Prospecto: ProspectoScreen,
        Login: LoginScreen,
        Registro: RegistroScreen,
        Sincronizacao: SincronizacaoScreen,
		Principal: PrincipalScreen,
		Inicio: InicioScreen,
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

export default ProspectosStack
