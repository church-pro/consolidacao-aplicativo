import React, {Fragment} from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Alert, Text, View, Image, TextInput, 
	ActivityIndicator,
	NetInfo,
} from 'react-native';
import { white, gold, dark } from '../helpers/colors';
import {
	alterarUsuarioNoAsyncStorage,
	porProspectoDaSincronizacao,
} from '../actions'
import {
	sincronizarNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'

class SincronizacaoScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	componentDidMount(){
		this.sincronizar()
	}

	sincronizar = () => {
		try{
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if(isConnected){
						const {
							usuario,
							navigation,
							alterarUsuarioNoAsyncStorage,
							tela,
							prospectos,
						} = this.props
						if(usuario.email){
							let dados = {
								email: usuario.email,
								senha: usuario.senha,
								prospectos: prospectos,
							}
							sincronizarNaAPI(dados)
								.then(retorno => {
									if(retorno.ok){
										// nao apertei sair
										if(tela !== 'Login'){
											dados.no_id = retorno.resultado.no_id
											dados.data_atualizacao = retorno.resultado.data_atualizacao
											dados.hora_atualizacao = retorno.resultado.hora_atualizacao
											delete dados.prospectos
											alterarUsuarioNoAsyncStorage(dados)
												.then(() =>  {
													// pondo prospectos retornados da api com id correto
													let prospectosFiltrados = retorno.resultado.prospectos
														.filter(prospecto => prospecto)
													this.props.porProspectoDaSincronizacao(prospectosFiltrados)
														.then(() => {
															Alert.alert('Sincronização', 'Sincronizado com sucesso!')
															navigation.navigate(tela)
														})
														.catch(err => {
															console.log('err: ', err)
														})
												})
										}
										// apertei sair
										if(tela === 'Login'){
											alterarUsuarioNoAsyncStorage({})
												.then(() => {

													navigation.navigate(tela)
												})
										}

									}
								})
								.catch(err => console.log('err: ', err))
						}else{
							navigation.navigate('Login')
						}
					}else{
						Alert.alert('Internet', 'Verifique sua internet!')
					}
				})
		} catch(err) {
			Alert.alert('Error', err)
		}
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: 'center', backgroundColor: dark}}>
				<ActivityIndicator 
					size="large"
					color={gold}
				/>
			</View>
		)
	}
}

function mapStateToProps({usuario, prospectos}, props){
	const tela = props.navigation.state.params.tela
	return {
		tela,
		usuario,
		prospectos,
	}
}

function mapDispatchToProps(dispatch){
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		porProspectoDaSincronizacao: (prospectos) => dispatch(porProspectoDaSincronizacao(prospectos)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SincronizacaoScreen)
