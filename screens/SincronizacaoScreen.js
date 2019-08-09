import React from 'react';
import {
	Alert,
	NetInfo,
} from 'react-native';
import { white, lightdark } from '../helpers/colors';
import {
	alterarUsuarioNoAsyncStorage,
	porProspectoDaSincronizacao,
} from '../actions'
import {
	sincronizarNaAPI,
	recuperarSituacoes,
	limparSituacoes,
} from '../helpers/api'
import { connect } from 'react-redux'
import Loading from '../components/Loading';
import { SINCRONIZANDO } from '../helpers/constants';

class SincronizacaoScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	componentDidMount() {
		this.sincronizar()
	}

	sincronizar = () => {
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if (isConnected) {
						const {
							usuario,
							navigation,
							alterarUsuarioNoAsyncStorage,
							tela,
							prospectos,
						} = this.props
						if (usuario.email) {
							recuperarSituacoes()
								.then(retornoAsync => {
									let dados = {
										email: usuario.email,
										senha: usuario.senha,
										prospectos,
										situacoes: retornoAsync.situacoes,
										usuario,
										subindo: true,
									}
									sincronizarNaAPI(dados)
										.then(retorno => {
											if (retorno.ok) {
												// nao apertei sair
												if (tela !== 'Login') {
													let usuario = retorno.resultado.usuario
													usuario.senha = dados.senha
													alterarUsuarioNoAsyncStorage(retorno.resultado.usuario)
														.then(() => {
															// pondo prospectos retornados da api com id da api
															this.props.porProspectoDaSincronizacao(retorno.resultado.prospectos)
																.then(() => {
																	limparSituacoes()
																		.then(() => {
																			Alert.alert('Sincronização', 'Sincronizado com sucesso!')
																			navigation.goBack()
																		})
																})
																.catch(err => {
																	console.log('err: ', err)
																})
														})
												}
												// apertei sair
												if (tela === 'Login') {
													alterarUsuarioNoAsyncStorage({})
														.then(() => {
															limparSituacoes()
																.then(() => {
																	navigation.navigate(tela)
																})
														})
												}

											}
										})
								})
								.catch(err => console.log('err: ', err))
						} else {
							navigation.navigate('Login')
						}
					} else {
						Alert.alert('Internet', 'Verifique sua internet!')
					}
				})
		} catch (err) {
			Alert.alert('Error', err)
		}
	}

	render() {
		return (
			<Loading title={SINCRONIZANDO} background={lightdark} />
		)
	}
}

function mapStateToProps({ usuario, prospectos }, props) {
	const tela = props.navigation.state.params.tela
	return {
		tela,
		usuario,
		prospectos,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		porProspectoDaSincronizacao: (prospectos) => dispatch(porProspectoDaSincronizacao(prospectos)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SincronizacaoScreen)
