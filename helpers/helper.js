import {
	Notifications,
	Permissions,
	Platform,
} from 'expo'
import {
	NetInfo,
} from 'react-native';
import {
	NotificationsIOS,
} from 'react-native-notifications'
import {
	SITUACAO_IMPORTAR,
	SITUACAO_MENSAGEM,
	SITUACAO_LIGAR,
	SITUACAO_VISITA,
	SITUACAO_EVENTO,
	SITUACAO_REMOVIDO,
	SITUACAO_MENSAGEM_NUMERO_INVALIDO,
	SITUACAO_LIGAR_NUMERO_INVALIDO,
	SITUACAO_LIGAR_APENAS_TOCOU,
	SITUACAO_LIGAR_MARCOU_VISITA_SEM_FALAR,
	SITUACAO_LIGAR_FALEI_MAS_NAO_MARQUEI,
	SITUACAO_VISITA_DESMARCOU,
	SITUACAO_VISITEI_MAS_NAO_CONVIDEI,
	SITUACAO_VISITA_NAO_FUI,
	SITUACAO_EVENTO_NAO_VEIO,
	SITUACAO_CADASTRO,
	PARABENS,
	PESSOA_ESTA_NA_ABA,
	REMOVER,
	PESSOA_REMOVIDA,
	ISSO_AI,
	PERSISTENCIA,
	CONCLUIU,
	ENVIOU_MENSAGEM,
	SIM,
	NUMERO_INVALIDO,
	O_QUE_DESEJA_FAZER,
	AVANCAR,
	CONSEGUIU_LIGAR,
	NUMERO_INEXISTENTE,
	APENAS_TOCOU,
	MARCOU_VISITA,
	NAO,
	AGENDAR_VISITA,
	TENTAR_NOVAMENTE,
	CONSEGUIU_VISITAR,
	CONVIDOU,
	ACEITOU_CONVITE,
	O_QUE_ACONTECEU,
	PESSOA_DESMARCOU,
	EU_NAO_FUI,
	AVANCAR_PARA_EVENTO,
	PESSOA_VEIO,
	RECOMECAR,
} from '../helpers/constants'
import {
	sincronizarNaAPI,
	recuperarSituacoes,
	limparSituacoes,
} from '../helpers/api'

export function criarNotificacaoLocal(notificacao) {
	return {
		title: notificacao.titulo,
		body: notificacao.corpo,
		ios: {
			sound: true,
		},
		android: {
			sound: true,
			priority: 'high',
			sticky: false,
			vibrate: true,
		}
	}
}

export function setarNotificacaoLocal(notificacao) {
	Permissions.askAsync(Permissions.NOTIFICATIONS)
		.then(({ status }) => {
			if (status === 'granted') {
				console.log(notificacao.data)
				let time = new Date(notificacao.data)
				console.log('time', time)
				let dataAjustada = time.getTime() + 10000
				console.log('dataAjustada', dataAjustada)
				Notifications.scheduleLocalNotificationAsync(
					criarNotificacaoLocal(notificacao),
					{
						time: dataAjustada
					}
				).then(resultado => console.log('notificacao', resultado))
			}
		})
}

export const sendNotificationImmediately = async () => {
	if (Platform !== 'ios') {
		let notificationId = await Notifications.presentLocalNotificationAsync({
			title: 'This is crazy',
			body: 'Your mind will blow after reading this',
		});
		console.log(notificationId); // can be saved in AsyncStorage or send to server
	}
	if (Platform === 'ios') {
		let localNotification = await NotificationsIOS.localNotification({
			alertBody: "Local notificiation!",
			alertTitle: "Local Notification Title",
			silent: false,
			category: "SOME_CATEGORY",
			userInfo: {}
		})
		console.log(localNotification)
	}
}

export const scheduleNotification = async () => {
	let notificationId = Notifications.scheduleLocalNotificationAsync(
		{
			title: "teste 5 segundos",
			body: 'testando huahduhsaudhsa uashda',
		},
		{
			time: new Date().getTime() + 5000,
		},
	).then(resultado => console.log('notificacao', resultado))
}

export const cancelarTodasNotificacoes = () => {
	Notifications.cancelAllScheduledNotificationsAsync()
		.then(resultado => console.log('cancelarTodasNotificacoes: ', resultado))
}

export function pegarDataEHoraAtual(acrescimo = null) {
	let dados = []
	let dataAtual = new Date()
	if(acrescimo !== null){
		dataAtual.setDate(dataAtual.getDate() + acrescimo)
	}
	const diaParaDataDeCriacao = dataAtual.getDate().toString().padStart(2, '0')
	let mesParaDataDeCriacao = dataAtual.getMonth() + 1
	mesParaDataDeCriacao = mesParaDataDeCriacao.toString().padStart(2, '0')
	const anoParaDataDeCriacao = dataAtual.getFullYear()
	const dataDeCriacao = diaParaDataDeCriacao + '/' + mesParaDataDeCriacao + '/' + anoParaDataDeCriacao
	const horaDeCriacao = dataAtual.getHours().toString().padStart(2, '0')
		+ ':' + dataAtual.getMinutes().toString().padStart(2, '0')
		+ ':' + dataAtual.getSeconds().toString().padStart(2, '0')

	dados.push(dataDeCriacao)
	dados.push(horaDeCriacao)

	return dados
}

export const montarObjetoParaPerguntas = (situacao_id) => {
	let estados = {}
	let perguntas = {}
	const labelParabens = PARABENS
	const labelMensagem = PESSOA_ESTA_NA_ABA
	const labelRemover = REMOVER
	const labelMensgemRemovido = PESSOA_REMOVIDA
	const labelVolta = ISSO_AI
	const labelMensagemVoltar = PERSISTENCIA
	const labelMensagemEvento = CONCLUIU
	let parametros = {}
	if (
		situacao_id === SITUACAO_IMPORTAR ||
		situacao_id === SITUACAO_CADASTRO
	) {
		estados = {
			enviouMensagem: false,
			naoEnviouMensagem: false,
			mostrarBotaoConfirmar: false,
			remover: false,
			avancar: false,
			mostrarPerguntaUm: true,
			mostrarPerguntaDois: false,
			situacao_id_nova: SITUACAO_MENSAGEM,
			situacao_id_extra: null,
			qualAba: 'Mensagem',
			paraOndeNavegar: null,
			alertTitulo: labelParabens,
			alertMensagem: labelMensagem + 'ligar',
		}
		perguntas = [
			{
				mostrar: 'mostrarPerguntaUm',
				titulo: ENVIOU_MENSAGEM,
				opcoes: [
					{
						estado: 'enviouMensagem',
						titulo: SIM,
						onPress: {
							enviouMensagem: true,
							naoEnviouMensagem: false,
							mostrarBotaoConfirmar: true,
							mostrarPerguntaDois: false,
							situacao_id_extra: null,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'ligar',
						},
					},
					{
						estado: 'naoEnviouMensagem',
						titulo: NUMERO_INVALIDO,
						onPress: {
							enviouMensagem: false,
							naoEnviouMensagem: true,
							mostrarBotaoConfirmar: false,
							mostrarPerguntaDois: true,
							situacao_id_extra: SITUACAO_MENSAGEM_NUMERO_INVALIDO,
							remover: false,
							avancar: false,
						},
					},
				]
			},
			{
				mostrar: 'mostrarPerguntaDois',
				titulo: O_QUE_DESEJA_FAZER,
				opcoes: [
					{
						estado: 'avancar',
						titulo: AVANCAR,
						onPress: {
							remover: false,
							avancar: true,
							mostrarBotaoConfirmar: true,
							situacao_id_nova: SITUACAO_MENSAGEM,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'ligar',
						},
					},
					{
						estado: 'remover',
						titulo: REMOVER,
						onPress: {
							remover: true,
							avancar: false,
							mostrarBotaoConfirmar: true,
							situacao_id_nova: SITUACAO_REMOVIDO,
							alertTitulo: REMOVER,
							alertMensagem: PESSOA_REMOVIDA,
						},
					},
				]
			},
		]
		parametros = {
			estados,
			perguntas,
		}
	}
	if (situacao_id === SITUACAO_MENSAGEM) {
		estados = {
			liguei: false,
			naoTelefoneInvalido: false,
			naoApenasTocou: false,
			mostrarBotaoConfirmar: false,
			marcouVisita: false,
			naoMarcouVisita: false,
			remover: false,
			avancar: false,
			voltar: false,
			mostrarPerguntaUm: true,
			mostrarPerguntaDois: false,
			mostrarPerguntaTres: false,
			situacao_id_nova: SITUACAO_LIGAR,
			situacao_id_extra: null,
			qualAba: 'Ligar',
			paraOndeNavegar: 'MarcarDataEHora',
			alertTitulo: labelParabens,
			alertMensagem: labelMensagem + 'visita',
		}
		perguntas = [
			{
				mostrar: 'mostrarPerguntaUm',
				titulo: CONSEGUIU_LIGAR,
				opcoes: [
					{
						estado: 'liguei',
						titulo: SIM,
						onPress: {
							liguei: true,
							naoTelefoneInvalido: false,
							naoApenasTocou: false,
							marcouVisita: false,
							naoMarcouVisita: false,
							mostrarBotaoConfirmar: false,
							mostrarPerguntaDois: true,
							mostrarPerguntaTres: false,
							situacao_id_extra: null,
							situacao_id_nova: SITUACAO_LIGAR,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'visita',
						},
					},
					{
						estado: 'naoTelefoneInvalido',
						titulo: NUMERO_INEXISTENTE,
						onPress: {
							liguei: false,
							naoTelefoneInvalido: true,
							naoApenasTocou: false,
							mostrarBotaoConfirmar: false,
							mostrarPerguntaDois: false,
							mostrarPerguntaTres: true,
							situacao_id_extra: SITUACAO_LIGAR_NUMERO_INVALIDO,
							marcouVisita: false,
							naoMarcouVisita: false,
							remover: false,
							avancar: false,
							voltar: false,
						},
					},
					{
						estado: 'naoApenasTocou',
						titulo: APENAS_TOCOU,
						onPress: {
							liguei: false,
							naoTelefoneInvalido: false,
							naoApenasTocou: true,
							mostrarBotaoConfirmar: false,
							mostrarPerguntaDois: false,
							mostrarPerguntaTres: true,
							situacao_id_extra: SITUACAO_LIGAR_APENAS_TOCOU,
							marcouVisita: false,
							naoMarcouVisita: false,
							remover: false,
							avancar: false,
							voltar: false,
						},
					}
				]
			},
			{
				mostrar: 'mostrarPerguntaDois',
				titulo: MARCOU_VISITA,
				opcoes: [
					{
						estado: 'marcouVisita',
						titulo: SIM,
						onPress: {
							marcouVisita: true,
							naoMarcouVisita: false,
							mostrarBotaoConfirmar: true,
							mostrarPerguntaDois: true,
							mostrarPerguntaTres: false,
							situacao_id_nova: SITUACAO_LIGAR,
							situacao_id_extra: null,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'visita',
						},
					},
					{
						estado: 'naoMarcouVisita',
						titulo: NAO,
						onPress: {
							marcouVisita: false,
							naoMarcouVisita: true,
							mostrarBotaoConfirmar: false,
							mostrarPerguntaDois: true,
							mostrarPerguntaTres: true,
							situacao_id_extra: SITUACAO_LIGAR_FALEI_MAS_NAO_MARQUEI,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'visita',
						},
					},
				]
			},
			{
				mostrar: 'mostrarPerguntaTres',
				titulo: O_QUE_DESEJA_FAZER,
				opcoes: [
					{
						estado: 'avancar',
						titulo: AGENDAR_VISITA,
						onPress: {
							remover: false,
							avancar: true,
							voltar: false,
							mostrarBotaoConfirmar: true,
							situacao_id_nova: SITUACAO_LIGAR,
							situacao_id_extra: SITUACAO_LIGAR_MARCOU_VISITA_SEM_FALAR,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'visita'
						},
					},
					{
						estado: 'voltar',
						titulo: TENTAR_NOVAMENTE,
						onPress: {
							remover: false,
							avancar: false,
							voltar: true,
							mostrarBotaoConfirmar: true,
							situacao_id_nova: null,
							alertTitulo: labelVolta,
							alertMensagem: labelMensagemVoltar,
						},
					},
					{
						estado: 'remover',
						titulo: REMOVER,
						onPress: {
							remover: true,
							avancar: false,
							voltar: false,
							mostrarBotaoConfirmar: true,
							situacao_id_nova: SITUACAO_REMOVIDO,
							alertTitulo: labelRemover,
							alertMensagem: labelMensgemRemovido,
						},
					},
				]
			},
		]
		parametros = {
			estados,
			perguntas,
		}
	}
	if (situacao_id === SITUACAO_LIGAR) {
		estados = {
			visitei: false,
			naoVisitei: false,
			mostrarBotaoConfirmar: false,
			convidei: false,
			naoConvidei: false,
			desmarcou: false,
			naoFui: false,
			remover: false,
			recomecar: false,
			avancar: false,
			mostrarPerguntaUm: true,
			mostrarPerguntaDois: false,
			mostrarPerguntaTres: false,
			mostrarPerguntaQuatro: false,
			situacao_id_nova: SITUACAO_VISITA,
			situacao_id_extra: null,
			qualAba: 'Visita',
			paraOndeNavegar: null,
			alertTitulo: labelParabens,
			alertMensagem: labelMensagem + 'evento',
		}
		perguntas = [
			{
				mostrar: 'mostrarPerguntaUm',
				titulo: CONSEGUIU_VISITAR,
				opcoes: [
					{
						estado: 'visitei',
						titulo: SIM,
						onPress: {
							visitei: true,
							naoVisitei: false,
							mostrarBotaoConfirmar: false,
							convidei: false,
							naoConvidei: false,
							desmarcou: false,
							naoFui: false,
							remover: false,
							recomecar: false,
							avancar: false,
							mostrarPerguntaUm: true,
							mostrarPerguntaDois: true,
							mostrarPerguntaTres: false,
							mostrarPerguntaQuatro: false,
							situacao_id_nova: SITUACAO_VISITA,
							situacao_id_extra: null,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'visita',
						},
					},
					{
						estado: 'naoVisitei',
						titulo: NAO,
						onPress: {
							visitei: false,
							naoVisitei: true,
							mostrarBotaoConfirmar: false,
							convidei: false,
							naoConvidei: false,
							desmarcou: false,
							naoFui: false,
							remover: false,
							recomecar: false,
							avancar: false,
							mostrarPerguntaUm: true,
							mostrarPerguntaDois: false,
							mostrarPerguntaTres: true,
							mostrarPerguntaQuatro: false,
							situacao_id_nova: SITUACAO_VISITA,
							situacao_id_extra: null,
						},
					},
				]
			},
			{
				mostrar: 'mostrarPerguntaDois',
				titulo: CONVIDOU,
				opcoes: [
					{
						estado: 'convidei',
						titulo: ACEITOU_CONVITE,
						onPress: {
							mostrarBotaoConfirmar: true,
							convidei: true,
							naoConvidei: false,
							desmarcou: false,
							naoFui: false,
							remover: false,
							recomecar: false,
							avancar: false,
							mostrarPerguntaUm: true,
							mostrarPerguntaDois: true,
							mostrarPerguntaTres: false,
							mostrarPerguntaQuatro: false,
							situacao_id_nova: SITUACAO_VISITA,
							situacao_id_extra: null,
							alertTitulo: labelParabens,
							alertMensagem: 'Parabéns Processo concluído!',
						},
					},
					{
						estado: 'naoConvidei',
						titulo: NAO,
						onPress: {
							mostrarBotaoConfirmar: false,
							convidei: false,
							naoConvidei: true,
							desmarcou: false,
							naoFui: false,
							remover: false,
							recomecar: false,
							avancar: false,
							mostrarPerguntaUm: true,
							mostrarPerguntaDois: true,
							mostrarPerguntaTres: false,
							mostrarPerguntaQuatro: true,
							situacao_id_nova: SITUACAO_VISITA,
							situacao_id_extra: SITUACAO_VISITEI_MAS_NAO_CONVIDEI,
						},
					},
				]
			},
			{
				mostrar: 'mostrarPerguntaTres',
				titulo: O_QUE_ACONTECEU,
				opcoes: [
					{
						estado: 'desmarcou',
						titulo: PESSOA_DESMARCOU,
						onPress: {
							mostrarBotaoConfirmar: false,
							desmarcou: true,
							naoFui: false,
							remover: false,
							avancar: false,
							recomecar: false,
							mostrarPerguntaTres: true,
							mostrarPerguntaQuatro: true,
							situacao_id_nova: SITUACAO_VISITA,
							situacao_id_extra: SITUACAO_VISITA_DESMARCOU,
						},
					},
					{
						estado: 'naoFui',
						titulo: EU_NAO_FUI,
						onPress: {
							mostrarBotaoConfirmar: false,
							desmarcou: false,
							naoFui: true,
							remover: false,
							recomecar: false,
							avancar: false,
							mostrarPerguntaTres: true,
							mostrarPerguntaQuatro: true,
							situacao_id_nova: SITUACAO_VISITA,
							situacao_id_extra: SITUACAO_VISITA_NAO_FUI,
						},
					},
				]
			},
			{
				mostrar: 'mostrarPerguntaQuatro',
				titulo: O_QUE_DESEJA_FAZER,
				opcoes: [
					{
						estado: 'recomecar',
						titulo: RECOMECAR,
						onPress: {
							mostrarBotaoConfirmar: true,
							remover: false,
							recomecar: true,
							avancar: false,
							situacao_id_nova: SITUACAO_IMPORTAR,
							alertTitulo: labelVolta,
							alertMensagem: labelMensagemVoltar
						},
					},
					{
						estado: 'remover',
						titulo: REMOVER,
						onPress: {
							mostrarBotaoConfirmar: true,
							remover: true,
							recomecar: false,
							avancar: false,
							situacao_id_nova: SITUACAO_REMOVIDO,
							alertTitulo: labelRemover,
							alertMensagem: labelMensgemRemovido,
						},
					},
				]
			},
		]
		parametros = {
			estados,
			perguntas,
		}
	}
	return parametros
}

export const sincronizar = (props, funcao) => {
	try {
		NetInfo.isConnected
			.fetch()
			.then(isConnected => {
				if (isConnected) {
					const {
						usuario,
						//navigation,
						alterarUsuarioNoAsyncStorage,
						porProspectoDaSincronizacao,
						prospectos,
					} = props
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
											//if (tela !== 'Login') {
												let usuario = retorno.resultado.usuario
												usuario.senha = dados.senha
												alterarUsuarioNoAsyncStorage(retorno.resultado.usuario)
													.then(() => {
														// pondo prospectos retornados da api com id da api
														porProspectoDaSincronizacao(retorno.resultado.prospectos)
															.then(() => {
																limparSituacoes()
																	.then(() => {
																		//Alert.alert('Sincronização', 'Sincronizado com sucesso!')
																		//navigation.goBack()
																		funcao()
																	})
															})
															.catch(err => {
																console.log('err: ', err)
															})
													})
											//}
											// apertei sair
											 /*
											if (tela === 'Login') {
												alterarUsuarioNoAsyncStorage({})
													.then(() => {
														limparSituacoes()
															.then(() => {
																//navigation.navigate(tela)
															})
													})
											}
											*/

										}
									})
							})
							.catch(err => console.log('err: ', err))
					} else {
						//navigation.navigate('Login')
					}
				} else {
					console.log('Internet', 'Verifique sua internet!')
				}
			})
	} catch (err) {
		Alert.alert('Error', err)
	}
}
