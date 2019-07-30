import React from 'react'
import { Button } from 'native-base'
import { Alert, View, Text, Image } from 'react-native'
import { stylesSideMenu, styles } from './Styles'
import { LinearGradient } from 'expo'
import { black, dark, lightdark } from '../helpers/colors';
import logo from '../assets/images/churchpro_branco.png'
import { SAIR, DESEJA_SAIR, NAO, SIM } from '../helpers/constants';

class SideBar extends React.Component {

	sair = () => {
		Alert.alert(
			SAIR,
			DESEJA_SAIR,
			[
				{
					text: NAO,
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: SIM, onPress: () => this.props.navigation.navigate('Sincronizacao', { tela: 'Login' }) },
			],
			{ cancelable: false },
		)

	}

	render() {
		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#404040']}>
				<View style={styles.container}>
					<View style={stylesSideMenu.containerImg}>
						<Image source={logo} style={stylesSideMenu.imgLogo} />
					</View>
					<Button
						style={stylesSideMenu.button}
						onPress={() => this.sair()}>
						<Text style={stylesSideMenu.textMenu}> {SAIR} </Text>
					</Button>
				</View>
			</LinearGradient>
		)
	}
}

export default (SideBar)
