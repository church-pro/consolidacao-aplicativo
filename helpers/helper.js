import {
	Notifications,
	Permissions,
	Platform,
} from 'expo'
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
			removerDireto: false,
			mostrarBotaoConfirmar: false,
			remover: false,
			avancar: false,
			mostrarPerguntaUm: true,
			mostrarPerguntaDois: false,
			situacao_id_nova: SITUACAO_MENSAGEM,
			situacao_id_extra: null,
			paraOndeVoltar: 'Prospectos',
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
							removerDireto: false,
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
							removerDireto: false,
							mostrarBotaoConfirmar: false,
							mostrarPerguntaDois: true,
							situacao_id_extra: SITUACAO_MENSAGEM_NUMERO_INVALIDO,
							remover: false,
							avancar: false,
						},
					},
					{
						estado: 'removerDireto',
						titulo: REMOVER,
						onPress: {
							enviouMensagem: false,
							naoEnviouMensagem: false,
							removerDireto: true,
							mostrarBotaoConfirmar: true,
							mostrarPerguntaDois: false,
							situacao_id_nova: SITUACAO_REMOVIDO,
							situacao_id_extra: null,
							alertTitulo: REMOVER,
							alertMensagem: PESSOA_REMOVIDA,
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
			paraOndeVoltar: 'Prospectos',
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
			paraOndeVoltar: 'Prospectos',
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
							alertMensagem: labelMensagem + 'evento',
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
						estado: 'avancar',
						titulo: AVANCAR_PARA_EVENTO,
						onPress: {
							mostrarBotaoConfirmar: true,
							remover: false,
							recomecar: false,
							avancar: true,
							situacao_id_nova: SITUACAO_VISITA,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'evento'
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
	if (situacao_id === SITUACAO_VISITA) {
		estados = {
			veio: false,
			naoVeio: false,
			mostrarBotaoConfirmar: false,
			remover: false,
			recomecar: false,
			mostrarPerguntaUm: true,
			mostrarPerguntaDois: false,
			situacao_id_nova: SITUACAO_EVENTO,
			situacao_id_extra: null,
			paraOndeVoltar: 'Prospectos',
			qualAba: 'Evento',
			paraOndeNavegar: null,
			alertTitulo: labelParabens,
			alertMensagem: labelMensagemEvento,
		}
		perguntas = [
			{
				mostrar: 'mostrarPerguntaUm',
				titulo: PESSOA_VEIO,
				opcoes: [
					{
						estado: 'veio',
						titulo: SIM,
						onPress: {
							veio: true,
							naoVeio: false,
							mostrarBotaoConfirmar: true,
							remover: false,
							recomecar: false,
							mostrarPerguntaUm: true,
							mostrarPerguntaDois: false,
							situacao_id_nova: SITUACAO_EVENTO,
							situacao_id_extra: null,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagemEvento,
						},
					},
					{
						estado: 'naoVeio',
						titulo: NAO,
						onPress: {
							veio: false,
							naoVeio: true,
							mostrarBotaoConfirmar: false,
							remover: false,
							recomecar: false,
							mostrarPerguntaUm: true,
							mostrarPerguntaDois: true,
							situacao_id_extra: SITUACAO_EVENTO_NAO_VEIO,
						},
					},
				]
			},
			{
				mostrar: 'mostrarPerguntaDois',
				titulo: O_QUE_DESEJA_FAZER,
				opcoes: [
					{
						estado: 'recomecar',
						titulo: RECOMECAR,
						onPress: {
							remover: false,
							recomecar: true,
							mostrarBotaoConfirmar: true,
							situacao_id_nova: SITUACAO_IMPORTAR,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'mensagem',
						},
					},
					{
						estado: 'remover',
						titulo: REMOVER,
						onPress: {
							remover: true,
							recomecar: false,
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
	return parametros
}
