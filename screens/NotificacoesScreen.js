import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { primary, lightdark, white, dark, gray } from '../helpers/colors';
import { connect } from 'react-redux'
import {
	alterarUsuarioNoAsyncStorage,
} from '../actions'

class NotificacoesScreen extends React.Component {

	static navigationOptions = {
		header: null,
		gesturesEnabled: false,
	}

	navegarEAtualizar = async (id) => {
		const {
			navigation,
			usuario,
			alterarUsuarioNoAsyncStorage,
		} = this.props

		let itemParaUsar = null
		usuario.notificacoes = usuario.notificacoes
			.map(item => {
				if(item._id === id){
					item.visto = true
					itemParaUsar = item
				}
				return item
			})
		await alterarUsuarioNoAsyncStorage(usuario)
		navigation.navigate(itemParaUsar.notificacao.paraOndeNavegar)
	}

    render() {
		const {
			usuario,
		} = this.props
        return (
            <View style={{ flex: 1, backgroundColor: dark, padding: 20 }} >
				<Text style={{ color: white, fontSize: 30, fontWeight: 'bold' }}>
					Notificações
				</Text>

                <View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>

					{
						usuario &&
						usuario.notificacoes &&
						usuario.notificacoes.map((item, indice) => 
							<TouchableOpacity
								key={indice}
								onPress={() => this.navegarEAtualizar(item._id)}
								style={{
									borderTopWidth: 1,
									borderTopColor: dark,
									padding: 5,
									backgroundColor: item.visto ? lightdark : primary,
								}}>
								<Text style={{ 
									color: white,
									fontSize: 24,
								}}>
								{item.notificacao.titulo}
							</Text>
							<Text style={{ color: white }}>
								{item.notificacao.corpo}
							</Text>
						</TouchableOpacity>
						)
					}

                </View>

            </View>
        )
    }
}

const mapStateToProps = ({usuario}) => {
	return {
		usuario,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificacoesScreen)
