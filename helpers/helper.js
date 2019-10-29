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
	recuperarNotificacoes,
	submeterNotificacoes,
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
			icon: './assets/images/icon_notificacao.png',
			color: '#000000',
		}
	}
}

export const setarNotificacaoLocal = async (notificacao) => {
	return await Notifications.scheduleLocalNotificationAsync(
		criarNotificacaoLocal(notificacao),
		{
			time: notificacao.tempo,
		}
	)
}

export const cancelarUmaNotificacao = async (notificacao_id) => {
	return await Notifications.dismissNotificationAsync(notificacao_id)
}

export const gerarNotificacaoPorSituacao = async (situacao_id, prospectosAntes, prospectosDepois, remover = false) => {
	let criarNotificacaoMensagem = false
	let criarNotificacaoLigar = false
	let criarNotificacaoVisita = false
	let limparNotificacaoMensagem = false
	let limparNotificacaoLigar = false
	let limparNotificacaoVisitar = false

	let notificacoes = await recuperarNotificacoes()
	if(
		situacao_id === SITUACAO_IMPORTAR ||
		situacao_id === SITUACAO_CADASTRO
	){
		/* removendo */
		if(prospectosDepois && prospectosDepois.filter(item => item.situacao_id === SITUACAO_IMPORTAR || item.situacao_id === SITUACAO_CADASTRO).length === 0 && notificacoes.mensagem){
			limparNotificacaoMensagem = true
		}
		/* estou adicionando e nao tem pessoas nessa lista entao gero */
		if(
			prospectosAntes &&
			(
				prospectosAntes.filter(item => item.situacao_id === SITUACAO_IMPORTAR || item.situacao_id === SITUACAO_CADASTRO).length === 0 || 
				(prospectosAntes.filter(item => item.situacao_id === SITUACAO_IMPORTAR || item.situacao_id === SITUACAO_CADASTRO).length !== 0 && !notificacoes.mensagem && !remover)
			)
		){
			criarNotificacaoMensagem = true
		}
	}

	if(situacao_id === SITUACAO_MENSAGEM){
		/* mandei a mensagem  */	
		/* acabou as pessoa na lista de mensagem */
		/* entao limpar notificacao mensagem */
		if(prospectosDepois.filter(item => item.situacao_id === SITUACAO_IMPORTAR || item.situacao_id === SITUACAO_CADASTRO).length === 0 && notificacoes.ligar){
			limparNotificacaoMensagem = true
		}
		/* sem nao tem pessoas na lista para ligar entao gerar*/
		if(
			prospectosDepois.filter(item => item.situacao_id === SITUACAO_MENSAGEM).length === 0 ||
			(prospectosDepois.filter(item => item.situacao_id === SITUACAO_MENSAGEM).length !== 0 && !notificacoes.ligar && !remover)
		){
			criarNotificacaoLigar = true
		}
	}

	if(situacao_id === SITUACAO_LIGAR){
		/* liguei */	
		/* acabou as pessoa na lista de ligar */
		/* entao limpar notificacao ligar */
		if(prospectosDepois.filter(item => item.situacao_id === SITUACAO_MENSAGEM).length === 0){
			limparNotificacaoLigar = true
		}
		/* sem nao tem pessoas na lista para visita entao gerar*/
		if(
			prospectosDepois.filter(item => item.situacao_id === SITUACAO_LIGAR).length === 0 ||
			(prospectosDepois.filter(item => item.situacao_id === SITUACAO_LIGAR).length !== 0 && !notificacoes.visita && !remover)
		){
			criarNotificacaoVisita = true
		}
	}

	if(situacao_id === SITUACAO_VISITA){
		/* liguei visitei	
		/* acabou as pessoa na lista de visitar */
		/* entao limpar notificacao visitar */
		if(prospectosDepois.filter(item => item.situacao_id === SITUACAO_VISITA).length === 0){
			limparNotificacaoVisitar = true
		}
	}

	const titulo = 'Lembrete'	
	let corpo = ''
	let tempo =  (new Date()).getTime() + 5000
	const dataParaNotificar = pegarDataEHoraAtual(1)[0]
	const splitData = dataParaNotificar.split('/')
	let dados = {}
	if(criarNotificacaoMensagem){
		corpo = 'Alguém está aguardando sua mensagem!'	
		tempo = new Date(splitData[2], splitData[1], splitData[0], 8, 0, 0)
		dados = {
			titulo,
			corpo,
			tempo,
		}
		const notificacao_id = await setarNotificacaoLocal(dados)
		notificacoes.mensagem = notificacao_id
	}
	if(criarNotificacaoLigar){
		corpo = 'Alguém está aguardando sua ligação!'	
		tempo = new Date(splitData[2], splitData[1], splitData[0], 19, 0, 0)
		dados = {
			titulo,
			corpo,
			tempo,
		}
		const notificacao_id = await setarNotificacaoLocal(dados)
		notificacoes.ligar = notificacao_id
	}
	if(criarNotificacaoVisita){
		corpo = 'Alguém está aguardando sua visita!'	
		tempo = new Date(splitData[2], splitData[1], splitData[0], 12, 0, 0)
		dados = {
			titulo,
			corpo,
			tempo,
		}
		const notificacao_id = await setarNotificacaoLocal(dados)
		notificacoes.visitar = notificacao_id
	}
	if(notificacoes.mensagem && limparNotificacaoMensagem){
		cancelarUmaNotificacao(notificacoes.mensagem)
		delete notificacoes.mensagem
	}
	if(notificacoes.ligar && limparNotificacaoLigar){
		cancelarUmaNotificacao(notificacoes.ligar)
		delete notificacoes.ligar
	}
	if(notificacoes.visitar && limparNotificacaoVisitar){
		cancelarUmaNotificacao(notificacoes.visitar)
		delete notificacoes.visitar
	}
	await submeterNotificacoes(notificacoes)
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
			situacao_id_nova: SITUACAO_VISITA,
			situacao_id_extra: null,
			qualAba: 'Visita',
			paraOndeNavegar: null,
			alertTitulo: '',
			alertMensagem: '',
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
							mostrarBotaoConfirmar: true,
							desmarcou: false,
							naoFui: false,
							remover: false,
							recomecar: false,
							avancar: false,
							mostrarPerguntaUm: true,
							mostrarPerguntaDois: false,
							mostrarPerguntaTres: false,
							situacao_id_nova: SITUACAO_VISITA,
							situacao_id_extra: null,
							alertTitulo: labelParabens,
							alertMensagem: 'Parabéns processo concluído',
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
							mostrarPerguntaDois: true,
							mostrarPerguntaTres: false,
							situacao_id_nova: SITUACAO_VISITA,
							situacao_id_extra: null,
						},
					},
				]
			},
			{
				mostrar: 'mostrarPerguntaDois',
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
							situacao_id_nova: SITUACAO_VISITA,
							situacao_id_extra: SITUACAO_VISITA_NAO_FUI,
						},
					},
				]
			},
			{
				mostrar: 'mostrarPerguntaTres',
				titulo: O_QUE_DESEJA_FAZER,
				opcoes: [
					{
						estado: 'recomecar',
						titulo: RECOMECAR,
						onPress: {
							mostrarBotaoConfirmar: true,
							remover: false,
							recomecar: true,
							situacao_id_nova: SITUACAO_IMPORTAR,
							alertTitulo: labelVolta,
							alertMensagem: labelMensagemVoltar
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

export const sincronizar = (props, funcao, sair = null) => {
	try {
		NetInfo.isConnected
			.fetch()
			.then(isConnected => {
				if (isConnected) {
					const {
						usuario,
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
											if(sair === null){
												let usuario = retorno.resultado.usuario
												usuario.senha = dados.senha
												alterarUsuarioNoAsyncStorage(retorno.resultado.usuario)
													.then(() => {
														porProspectoDaSincronizacao(retorno.resultado.prospectos)
															.then(() => {
																limparSituacoes()
																	.then(() => {
																		funcao()
																	})
															})
															.catch(err => {
																funcao()
																console.log('err: ', err)
															})
													})
											}
											if(sair){
												alterarUsuarioNoAsyncStorage({})
													.then(() => {
														porProspectoDaSincronizacao([])
															.then(() => {
																limparSituacoes()
																	.then(() => {
																		funcao()
																	})
															})
															.catch(err => {
																funcao()
																console.log('err: ', err)
															})
													})
											}
										}
										if(!retorno.ok){
											alterarUsuarioNoAsyncStorage({})
												.then(() => {
													porProspectoDaSincronizacao([])
														.then(() => {
															limparSituacoes()
																.then(() => {
																	funcao()
																})
														})
														.catch(err => {
															funcao()
															console.log('err: ', err)
														})
												})
										}
									})
							})
							.catch(err => {
								funcao()
								console.log('err: ', err)
							})
					}
				} else {
					funcao()
					console.log('Internet', 'Verifique sua internet!')
				}
			})
	} catch (err) {
		Alert.alert('Error', err)
	}
}

export const sincronizacaoRapida = (usuario, sincronizacaoRapidaNaAPI) => {
	try {
		NetInfo.isConnected
			.fetch()
			.then(isConnected => {
				if (isConnected) {
					if (usuario.email) {
						sincronizacaoRapidaNaAPI({usuario,})
							.then(retorno => {
								return retorno 
							})
							.catch(err => {
								console.log('err: ', err)
								return false
							})
					}
				} else {
					console.log('Internet', 'Verifique sua internet!')
				}
			})
	} catch (err) {
		console.log('err: ', err)
	}
}

export const verificarSeTemProgressoNaMissao = (usuario, dados, qualTela, situacao_id) => {
	if(usuario.missoes){
		let missoesComAcao = []
		const dataAtual = new Date()
		usuario.missoes.forEach(item => {
			let validacaoDeAcao = false
			const {
				data_inicial,
				data_final,
			} = item.missao
			const splitDataInicial = data_inicial.split('/')
			const splitDataFinal = data_final.split('/')
			let dataInicialJS = new Date()
			dataInicialJS.setDate(splitDataInicial[0])
			dataInicialJS.setMonth(splitDataInicial[1] - 1)
			dataInicialJS.setFullYear(splitDataInicial[2])
			let dataFinalJS = new Date()
			dataFinalJS.setDate(splitDataFinal[0])
			dataFinalJS.setMonth(splitDataFinal[1] - 1)
			dataFinalJS.setFullYear(splitDataFinal[2])

			/* data atual no periodo da missao */
			if(dataAtual.getTime() >= dataInicialJS.getTime() &&
				dataAtual.getTime() <= dataFinalJS.getTime()){
				if (situacao_id === SITUACAO_MENSAGEM) {
					if(item.missao.mensagens > 0 &&
						item.mensagens < item.missao.mensagens){
						validacaoDeAcao = true
					}
				}
				if (situacao_id === SITUACAO_LIGAR) {
					if(item.missao.ligacoes > 0 &&
						item.ligacoes < item.missao.ligacoes){
						validacaoDeAcao = true
					}
				}
				if (situacao_id === SITUACAO_VISITA) {
					if(item.missao.visitas > 0 &&
						item.visitas < item.missao.visitas){
						validacaoDeAcao = true
					}
				}
			}
			if(validacaoDeAcao){
				missoesComAcao.push(item)
			}
		})
		if(missoesComAcao.length > 0){
			dados.missoes = missoesComAcao
			dados.situacao_id = situacao_id	
			qualTela = 'MissoesContagem'
		}
	}
	return dados, qualTela
}

export const missoesValidas = (usuario) => {
	let missoes = []
	if(usuario.missoes){
		const dataAtual = new Date()
		usuario.missoes.forEach(item => {
			const {
				data_inicial,
				data_final,
			} = item.missao
			const splitDataInicial = data_inicial.split('/')
			const splitDataFinal = data_final.split('/')
			let dataInicialJS = new Date()
			dataInicialJS.setDate(splitDataInicial[0])
			dataInicialJS.setMonth(splitDataInicial[1] - 1)
			dataInicialJS.setFullYear(splitDataInicial[2])
			let dataFinalJS = new Date()
			dataFinalJS.setDate(splitDataFinal[0])
			dataFinalJS.setMonth(splitDataFinal[1] - 1)
			dataFinalJS.setFullYear(splitDataFinal[2])

			/* data atual no periodo da missao */
			if(dataAtual.getTime() >= dataInicialJS.getTime() &&
				dataAtual.getTime() <= dataFinalJS.getTime()){
				missoes.push(item)
			}
		})
	}
	return missoes
}
