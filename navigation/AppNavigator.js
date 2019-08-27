import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import { AutenticacaoStack, PrincipalStack, } from './MainTabNavigator';

export default createSwitchNavigator({
	Autenticacao: AutenticacaoStack,
	Principal: PrincipalStack,
});
