import React from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements';
import { primary, black, dark, gold, red, white, } from '../helpers/colors'
import {
	missoesValidas,
} from '../helpers/helper'

class TabBarIcon extends React.Component {
	
	state = {
		focus: ''
	}

	componentDidMount(){
		this.setState({focus: 'Pessoas'})
	}

	selecionarTab(rota){
		const {
			navigation,
		} = this.props
		this.setState({focus: rota})
		navigation.navigate(rota)
	}

	render() {
		const {
			navigation,
			usuario,
		} = this.props
		const {
			routes,
		} = navigation.state
		const {
			focus,
		} = this.state

		let temNotificacoesNaoLidas = false
		let temMissoesNaoLidas = false
		if(usuario.notificacoes && usuario.notificacoes.length > 0){
			usuario.notificacoes.forEach(item => {
				if(item.visto === false){
					temNotificacoesNaoLidas = true
				}
			})
		}
		if(usuario.missoes && usuario.missoes.length > 0){
			const missoes = missoesValidas(usuario)
			missoes.forEach(item => {
				if(item.visto === false){
					temMissoesNaoLidas = true
				}
			})
		}
		return (
			<View style={{
				backgroundColor: dark,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: 5,
			}}>
				{
					routes.map(rota => {
						let icone = ''
						const {
							routeName,
						} = rota
						if(routeName === 'Pessoas'){
							icone = 'users'
						}
						if(routeName === 'Perfil'){
							icone = 'user'
						}
						if(routeName === 'Clubes'){
							icone = 'shield'
						}
						if(routeName === 'Notificações'){
							icone = 'bell'
						}
						if(routeName === 'Missões'){
							icone = 'trophy'
						}
						return (
							<TouchableOpacity 
								key={routeName}
								onPress={() => this.selecionarTab(routeName)} 
								style={{
									borderTopWidth: focus === routeName ? 2 : 0,
									borderTopColor: focus === routeName ? primary : 'transparent',
									marginRight: 0, flex: 1, padding: 6
								}} >
								<Icon 
									name={icone}
									type='font-awesome' 
									color={focus === routeName ? primary : white}
									style={{
										marging: 8,
									}}
								/>
								{
									routeName === 'Notificações' && temNotificacoesNaoLidas &&
										<View style={{
											position: 'absolute',
											right: 1,
											backgroundColor: red,
											height: 15,
											width: 15,
											borderRadius: 15,
											zIndex: 5,
											justifyContent: 'center'
										}}>
										<Text>
										</Text>
									</View>
								}
								{
									routeName === 'Missões' && temMissoesNaoLidas &&
										<View style={{
											position: 'absolute',
											right: 1,
											backgroundColor: red,
											height: 15,
											width: 15,
											borderRadius: 15,
											zIndex: 5,
											justifyContent: 'center'
										}}>
									</View>
								}
								<Text style={{
									color: focus === routeName ? primary : white,
									fontSize: 8,
									textAlign: 'center',
									fontWeight: focus === routeName ? 'bold' : 'normal'
								}}>
								{rota.routeName}
							</Text>
						</TouchableOpacity>
						)
					})
				}
			</View>
		)
	}
}

const mapStateToProps = ({usuario}) => {
	return {
		usuario,
	}
}

export default connect(mapStateToProps, null)(TabBarIcon)
