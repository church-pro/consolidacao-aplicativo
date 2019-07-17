import React from 'react'
import { Button } from 'native-base'
import { Alert, View, Text, Image } from 'react-native'
import styles from './ProspectoStyle'
import { connect } from 'react-redux'
import {
	sendNotificationImmediately,
	scheduleNotification,
	cancelarTodasNotificacoes,
} from '../helpers/helper'
import { LinearGradient } from 'expo'
import { black, dark, lightdark } from '../helpers/colors';

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
				<View style={styles.sideMenu}>
					<Image style={styles.imgLogo} source={require('../assets/images/logo.png')} />
					<Button
						style={{ backgroundColor: 'transparent', height: 80 }}
						onPress={() => this.sair()}>
						<Text style={styles.textMenu}>
							Sair
					</Text>
					</Button>
				</View>
			</LinearGradient>
		)
	}
}

export default (SideBar)
