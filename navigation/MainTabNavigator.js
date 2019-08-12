import React from 'react';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import SincronizacaoScreen from '../screens/SincronizacaoScreen';
import PrincipalScreen from '../screens/PrincipalScreen';
import PerguntasScreen from '../screens/PerguntasScreen';
import { white, dark, black } from '../helpers/colors'

const MainStack = createStackNavigator(
    {
        Login: LoginScreen,
        Registro: RegistroScreen,
        Principal: PrincipalScreen,
        Perguntas: PerguntasScreen,
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

export default MainStack
