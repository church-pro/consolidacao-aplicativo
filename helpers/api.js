import { AsyncStorage } from 'react-native'

const versaoBanco = '0090'
// banco de teste na versao 70
const CHAVE_ADMINISTRACAO = 'churchProConsolidacao:administracao' + versaoBanco
const CHAVE_PROSPECTOS = 'churchProConsolidacao:prospectos' + versaoBanco
const CHAVE_USUARIO = 'churchProConsolidacao:usuario' + versaoBanco
const CHAVE_SITUACOES = 'churchProConsolidacao:situacoes' + versaoBanco
const CHAVE_NOTIFICACOES = 'churchProConsolidacao:notificacoes' + versaoBanco
const CHAVE_ATUALIZACOES = 'churchProConsolidacao:atualizacoes' + versaoBanco

//const apiMaster = 'https://api.churchpro.com.br'
const apiMaster = 'https://homologacao.churchpro.com.br'
const headers = {
	'Content-Type': 'application/json'
}

export const teste = () =>
	fetch(`${apiMaster}/`)
		.then(resultado => resultado.json())
		.then(json => json)

export const registrarNaAPI = (dados) =>
	fetch(
		`${apiMaster}/no/registrar`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const logarNaApi = (dados) =>
	fetch(
		`${apiMaster}/no/logar`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const sincronizarNaAPI = (dados) =>
	fetch(
		`${apiMaster}/no/sincronizar`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const clubesNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/listaDeClubes`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const buscarClubesNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/buscar`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const participarDeClubeNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/participar`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const criarClubeNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/criar`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const atualizarClubeNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/atualizarClube`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const sincronizacaoRapidaNaAPI = (dados) =>
	fetch(
		`${apiMaster}/no/sincronizacaoRapida`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const removerParticipanteDoClubeNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/removerParticipante`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const removerParticipanteEBloquearDoClubeNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/removerParticipanteEBloquear`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const removerPessoaDaListaNegraNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/removerPessoaDaListaNegra`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)


export const alterarNomeNaAPI = (dados) =>
	fetch(
		`${apiMaster}/no/alterarNome`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const alterarNomeDoClubeNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/alterarNome`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const removerClubeNaAPI = (dados) =>
	fetch(
		`${apiMaster}/clube/remover`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const alterarEmailNaAPI = (dados) =>
	fetch(
		`${apiMaster}/no/alterarEmail`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export const alterarSenhaNaAPI = (dados) =>
	fetch(
		`${apiMaster}/no/alterarSenha`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export function recuperarProspectos() {
	return AsyncStorage.getItem(CHAVE_PROSPECTOS)
		.then(JSON.parse)
		.then((dados) => {
			if (dados === null) {
				dados = { prospectos: [] }
				AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
			}
			return dados
		})
}

export function submeterProspectos(prospectos) {
	return recuperarProspectos()
		.then(dados => {
			dados.prospectos = [...dados.prospectos, ...prospectos]
			AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
			return prospectos
		})
}

export async function limparESubmeterProspectos(prospectos) {
	const dados = {}
	dados.prospectos = [...prospectos]
	await AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
	return prospectos
}

export function modificarProspecto(prospecto) {
	return recuperarProspectos()
		.then(dados => {
			const prospectosAlterados =
				dados.prospectos.map(prospectoNoAsyncStorage => {
					if (prospectoNoAsyncStorage._id === prospecto._id) {
						return prospecto
					} else {
						return prospectoNoAsyncStorage
					}
				})
			dados.prospectos = prospectosAlterados
			AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
			return prospecto
		})
}

export function limparProspectos() {
	const dados = { prospectos: [] }
	AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
	return true
}

export function recuperarUsuario() {
	return AsyncStorage.getItem(CHAVE_USUARIO)
		.then(JSON.parse)
		.then((dados) => {
			if (dados === null) {
				dados = { usuario: {} }
				AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados))
			}
			return dados
		})
}

export function submeterUsuario(usuario) {
	return recuperarUsuario()
		.then(dados => {
			dados.usuario = usuario
			AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados))
			return usuario
		})
}

export function recuperarSituacoes() {
	return AsyncStorage.getItem(CHAVE_SITUACOES)
		.then(JSON.parse)
		.then((dados) => {
			if (dados === null) {
				dados = { situacoes: [] }
				AsyncStorage.setItem(CHAVE_SITUACOES, JSON.stringify(dados))
			}
			return dados
		})
}

export function submeterSituacoes(situacoes) {
	return recuperarSituacoes()
		.then(dados => {
			dados.situacoes = [...dados.situacoes, ...situacoes]
			AsyncStorage.setItem(CHAVE_SITUACOES, JSON.stringify(dados))
			return situacoes
		})
}

export const limparSituacoes = async () => {
	try {
		const dados = { situacoes: [] }
		await AsyncStorage.setItem(CHAVE_SITUACOES, JSON.stringify(dados))
		return true
	} catch (error) {
		// Error saving data
	}
}

export function recuperarNotificacoes() {
	return AsyncStorage.getItem(CHAVE_NOTIFICACOES)
		.then(JSON.parse)
		.then((dados) => {
			if (dados === null) {
				dados = { notificacoes: [] }
				AsyncStorage.setItem(CHAVE_NOTIFICACOES, JSON.stringify(dados))
			}
			return dados
		})
}

export function submeterNotificacoes(notificacoes) {
	return recuperarNotificacoes()
		.then(dados => {
			dados.notificacoes = notificacoes
			AsyncStorage.setItem(CHAVE_NOTIFICACOES, JSON.stringify(dados))
			return notificacoes
		})
}

export function recuperarAtualizacoes() {
	return AsyncStorage.getItem(CHAVE_ATUALIZACOES)
		.then(JSON.parse)
		.then((dados) => {
			if (dados === null) {
				dados = { atualizacoes: {} }
				AsyncStorage.setItem(CHAVE_ATUALIZACOES, JSON.stringify(dados))
			}
			return dados
		})
}

export function submeterAtualizacoes(atualizacoes) {
	return recuperarAtualizacoes()
		.then(dados => {
			dados.atualizacoes = atualizacoes
			AsyncStorage.setItem(CHAVE_ATUALIZACOES, JSON.stringify(dados))
			return atualizacoes
		})
}
