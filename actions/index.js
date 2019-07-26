import {
	recuperarProspectos,
	submeterProspectos,
	modificarProspecto,
	recuperarUsuario,
	submeterUsuario,
	limparProspectos,
	limparESubmeterProspectos,
	recuperarSituacoes,
	submeterSituacoes,
} from '../helpers/api'
import{
	pegarDataEHoraAtual,
} from '../helpers/helper'

export const LIMPAR_PROSPECTOS = 'LIMPAR_PROSPECTOS'
export const PEGAR_PROSPECTOS = 'PEGAR_PROSPECTOS'
export const ADICIONAR_PROSPECTOS = 'ADICIONAR_PROSPECTOS'
export const ALTERAR_PROSPECTO = 'ALTERAR_PROSPECTO'
export const PEGAR_ADMINISTRACAO = 'PEGAR_ADMINISTRACAO'
export const ALTERAR_ADMINISTRACAO = 'ALTERAR_ADMINISTRACAO'
export const PEGAR_USUARIO = 'PEGAR_USUARIO'
export const ALTERAR_USUARIO = 'ALTERAR_USUARIO'
export const PEGAR_SITUACOES = 'PEGAR_SITUACOES'
export const ADICIONAR_SITUACOES = 'ADICIONAR_SITUACOES'

export function limparProspectosNoState(){ 
	return {
		type: LIMPAR_PROSPECTOS,
	}
}

export function pegarProspectos(prospectos){ 
	return {
		type: PEGAR_PROSPECTOS,
		prospectos,
	}
}

export function adicionarProspectos(prospectos){ 
	return {
		type: ADICIONAR_PROSPECTOS,
		prospectos,
	}
}

export function alterarProspecto(prospecto){ 
	return {
		type: ALTERAR_PROSPECTO,
		prospecto,
	}
}

export function pegarAdministracao(administracao){ 
	return {
		type: PEGAR_ADMINISTRACAO,
		administracao,
	}
}

export function alterarAdministracao(administracao){ 
	return {
		type: ALTERAR_ADMINISTRACAO,
		administracao,
	}
}

export function pegarUsuario(usuario){ 
	return {
		type: PEGAR_USUARIO,
		usuario,
	}
}

export function alterarUsuario(usuario){ 
	return {
		type: ALTERAR_USUARIO,
		usuario,
	}
}

export function pegarSituacoes(situacoes){ 
	return {
		type: PEGAR_SITUACOES,
		situacoes,
	}
}

export function adicionarSituacoes(situacoes){ 
	return {
		type: ADICIONAR_SITUACOES,
		situacoes,
	}
}

export const pegarProspectosNoAsyncStorage = () => dispatch => {
	return recuperarProspectos()
		.then(prospectosNaAsyncStorage => {
			dispatch(pegarProspectos(prospectosNaAsyncStorage.prospectos))
			return prospectosNaAsyncStorage.prospectos 
		})
}

export const adicionarProspectosAoAsyncStorage = (prospectos) => dispatch => {
	return submeterProspectos(prospectos)
		.then(prospectos => {
			dispatch(adicionarProspectos(prospectos))
			return true
		})
}

export const alterarProspectoNoAsyncStorage = (prospecto) => dispatch => {
	if(prospecto.novo){
		delete prospecto.novo
		return submeterProspectos([prospecto])
			.then(prospectos => {
				dispatch(adicionarProspectos(prospectos))
				return true
			})

	}else{
		return modificarProspecto(prospecto)
			.then(prospecto => {
				dispatch(alterarProspecto(prospecto))
				return true
			})
	}
}

export const pegarUsuarioNoAsyncStorage = () => dispatch => {
	return recuperarUsuario()
		.then(usuarioNaAsyncStorage => {
			dispatch(pegarUsuario(usuarioNaAsyncStorage.usuario))
			return usuarioNaAsyncStorage.usuario 
		})
}

export const alterarUsuarioNoAsyncStorage = (usuario) => dispatch => {
	return submeterUsuario(usuario)
		.then(usuario => { 
			dispatch(alterarUsuario(usuario))
			return true
		})
}

export const limparProspectosNoAsyncStorage = () => dispatch => {
	limparProspectos()
	dispatch(limparProspectosNoState())
}

export const porProspectoDaSincronizacao = (prospectos) => dispatch => {
	return limparESubmeterProspectos(prospectos)
		.then(prospectos => {
			dispatch(pegarProspectos(prospectos))
			return prospectos
		})
}

export const pegarSituacoesNoAsyncStorage = () => dispatch => {
	return recuperarSituacoes()
		.then(situacoesNaAsyncStorage => {
			dispatch(pegarSituacoes(situacoesNaAsyncStorage.situacoes))
			return situacoesNaAsyncStorage.situacoes 
		})
}
