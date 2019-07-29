import { combineReducers } from 'redux'
import { 
	LIMPAR_PROSPECTOS,
	PEGAR_PROSPECTOS, 
	ADICIONAR_PROSPECTOS, 
	ALTERAR_PROSPECTO, 
	PEGAR_ADMINISTRACAO,
	ALTERAR_ADMINISTRACAO,
	PEGAR_USUARIO,
	ALTERAR_USUARIO,
	PEGAR_SITUACOES,
	ADICIONAR_SITUACOES,
} from '../actions'

function prospectos(state = [], action){
	switch(action.type){
		case LIMPAR_PROSPECTOS:
			return []
		case PEGAR_PROSPECTOS:
			return [...action.prospectos]
		case ADICIONAR_PROSPECTOS:
			return [...state, ...action.prospectos]
		case ALTERAR_PROSPECTO:
			const estadoAtualizado = state.map(prospecto => {
				if(prospecto._id === action.prospecto._id){
					return action.prospecto
				}else{
					return prospecto
				}
			})
			return [...estadoAtualizado]
		default:
			return state
	}
}

const estadoDaAdministracao = {}

function administracao(state = estadoDaAdministracao, action){
	switch(action.type){
		case PEGAR_ADMINISTRACAO:
			return {
				...state
			}
		case ALTERAR_ADMINISTRACAO:
			return {
				...action.administracao
			}
		default:
			return state
	}
}

function usuario(state = {}, action){
	switch(action.type){
		case PEGAR_USUARIO:
			return {
				...action.usuario
			}
		case ALTERAR_USUARIO:
			return {
				...action.usuario
			}
		default:
			return state
	}
}

function situacoes(state = [], action){
	switch(action.type){
		case PEGAR_SITUACOES:
			return [...action.situacoes]
		case ADICIONAR_SITUACOES:
			return [...state, ...action.situacoes]
		default:
			return state
	}
}

export default combineReducers({
	prospectos,
	administracao,
	usuario,
	situacoes,
})
