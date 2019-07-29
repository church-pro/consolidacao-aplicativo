import React from 'react'
import { Button } from 'native-base'
import { Alert, View, Text, Image } from 'react-native'
import { stylesSideMenu, styles } from './Styles'
import { LinearGradient } from 'expo'
import { black, dark, lightdark } from '../helpers/colors';
import logo from '../assets/images/churchpro_branco.png'

class SideBar extends React.Component {

	sair = () => {
		Alert.alert(
			'Sair',
			'Reamente deseja sair?',
			[
				{
					text: 'Não',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'Sim', onPress: () => this.props.navigation.navigate('Sincronizacao', { tela: 'Login' }) },
			],
			{ cancelable: false },
		)

	}

	render() {
		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#404040']}>
				<View style={styles.container}>
					<View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
						<Image source={logo} style={stylesSideMenu.imgLogo} />
					</View>
					<Button
						style={{ backgroundColor: 'transparent', height: 80 }}
						onPress={() => this.sair()}>
						<Text style={stylesSideMenu.textMenu}>
							Sair
					</Text>
					</Button>
				</View>
			</LinearGradient>
		)
	}
}

export default (SideBar)
