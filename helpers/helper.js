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

export function pegarDataEHoraAtual() {
	let dados = []
	const dataAtual = new Date()
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
	const labelParabens = 'Parabéns'
	const labelMensagem = 'Pessoa está agora na aba para '
	const labelRemover = 'Remover'
	const labelMensgemRemovido = 'Pessoa Removida'
	const labelVolta = labelParabens
	const labelMensagemVoltar = 'Seu progresso foi salvo!'
	const labelMensagemEvento = 'Você concluiu o processo'
	let parametros = {}
	if (situacao_id === SITUACAO_IMPORTAR) {
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
			paraOndeVoltar: 'Prospectos',
			qualAba: 'Mensagem',
			paraOndeNavegar: null,
			alertTitulo: labelParabens,
			alertMensagem: labelMensagem + 'ligar',
		}
		perguntas = [
			{
				mostrar: 'mostrarPerguntaUm',
				titulo: 'Conseguiu Enviar a Mensagem?',
				opcoes: [
					{
						estado: 'enviouMensagem',
						titulo: 'Sim',
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
						titulo: 'Não - Número Inválido/ Sem Whatsapp',
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
				titulo: 'O que deseja fazer?',
				opcoes: [
					{
						estado: 'avancar',
						titulo: 'Avançar',
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
						titulo: 'Remover',
						onPress: {
							remover: true,
							avancar: false,
							mostrarBotaoConfirmar: true,
							situacao_id_nova: SITUACAO_REMOVIDO,
							alertTitulo: 'Remover',
							alertMensagem: 'Pessoa removida!',
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
				titulo: 'Conseguiu Ligar?',
				opcoes: [
					{
						estado: 'liguei',
						titulo: 'Sim',
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
						titulo: 'Não - Número Inválido/Inexistente',
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
						titulo: 'Não - Apenas Tocou',
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
				titulo: 'Marcou Visita?',
				opcoes: [
					{
						estado: 'marcouVisita',
						titulo: 'Sim',
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
						titulo: 'Não',
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
				titulo: 'O que deseja fazer?',
				opcoes: [
					{
						estado: 'avancar',
						titulo: 'Agendar visita mesmo assim',
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
						titulo: 'Tentar Novamente',
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
						titulo: 'Remover',
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
				titulo: 'Conseguiu Visitar?',
				opcoes: [
					{
						estado: 'visitei',
						titulo: 'Sim',
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
						titulo: 'Não',
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
				titulo: 'Convidou?',
				opcoes: [
					{
						estado: 'convidei',
						titulo: 'Sim - Aceitou Convite',
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
						titulo: 'Não',
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
				titulo: 'O que aconteceu?',
				opcoes: [
					{
						estado: 'desmarcou',
						titulo: 'Pessoa Desmarcou',
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
						titulo: 'Eu não fui',
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
				titulo: 'O que deseja fazer?',
				opcoes: [
					{
						estado: 'recomecar',
						titulo: 'Recomeçar o processo com a pessoa',
						onPress: {
							mostrarBotaoConfirmar: true,
							remover: false,
							recomecar: true,
							avancar: false,
							situacao_id_nova: SITUACAO_IMPORTAR,
							alertTitulo: labelParabens,
							alertMensagem: labelMensagem + 'mensagem'
						},
					},
					{
						estado: 'avancar',
						titulo: 'Avançar para etapa evento',
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
						titulo: 'Remover',
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
				titulo: 'A pessoa veio?',
				opcoes: [
					{
						estado: 'veio',
						titulo: 'Sim',
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
						titulo: 'Não',
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
				titulo: 'O que deseja fazer?',
				opcoes: [
					{
						estado: 'recomecar',
						titulo: 'Recomeçar o processo com a pessoa',
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
						titulo: 'Remover',
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
