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
import { black, dark, lightdark, white } from '../helpers/colors';

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
					<View style={{ marginTop: 25, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ fontSize: 22, color: white, textAlign: "center", fontWeight: "bold" }}>CHURCH PRO</Text>
						<Text style={{ fontSize: 18, color: white, textAlign: "center" }}>CONSOLIDAÇÃO</Text>
					</View>
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
