import React from 'react';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import PrincipalScreen from '../screens/PrincipalScreen';
import TutorialScreen from '../screens/TutorialScreen'
import { white, dark, black } from '../helpers/colors'

const MainStack = createStackNavigator(
    {
        Login: LoginScreen,
        Registro: RegistroScreen,
        Principal: PrincipalScreen,
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

export default MainStack
