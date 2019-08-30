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
	recuperarAtualizacoes,
	submeterAtualizacoes,
} from '../helpers/api'
import{
	pegarDataEHoraAtual,
} from '../helpers/helper'

export const LIMPAR_PROSPECTOS = 'LIMPAR_PROSPECTOS'
export const PEGAR_PROSPECTOS = 'PEGAR_PROSPECTOS'
export const ADICIONAR_PROSPECTOS = 'ADICIONAR_PROSPECTOS'
export const ALTERAR_PROSPECTO = 'ALTERAR_PROSPECTO'
export const PEGAR_USUARIO = 'PEGAR_USUARIO'
export const ALTERAR_USUARIO = 'ALTERAR_USUARIO'
export const PEGAR_ATUALIZACOES = 'PEGAR_ATUALIZACOES'
export const ALTERAR_ATUALIZACOES = 'ALTERAR_ATUALIZACOES'

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

export function pegarAtualizacoes(atualizacoes){ 
	return {
		type: PEGAR_ATUALIZACOES,
		atualizacoes,
	}
}

export function alterarAtualizacoes(atualizacoes){ 
	return {
		type: ALTERAR_ATUALIZACOES,
		atualizacoes,
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

export const pegarAtualizacoesNoAsyncStorage = () => dispatch => {
	return recuperarAtualizacoes()
		.then(retorno => {
			dispatch(pegarAtualizacoes(retorno.atualizacoes))
			return retorno.atualizacoes 
		})
}

export const alterarAtualizacoesNoAsyncStorage = (atualizacoes) => dispatch => {
	return submeterAtualizacoes(atualizacoes)
		.then(retorno => { 
			dispatch(alterarAtualizacoes(retorno))
			return true
		})
}
