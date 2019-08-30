import { combineReducers } from 'redux'
import { 
	LIMPAR_PROSPECTOS,
	PEGAR_PROSPECTOS, 
	ADICIONAR_PROSPECTOS, 
	ALTERAR_PROSPECTO, 
	PEGAR_USUARIO,
	ALTERAR_USUARIO,
	PEGAR_ATUALIZACOES,
	ALTERAR_ATUALIZACOES,
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

function atualizacoes(state = [], action){
	switch(action.type){
		case PEGAR_ATUALIZACOES:
			return {
				...action.atualizacoes
			}
		case ALTERAR_ATUALIZACOES:
			return {
				...action.atualizacoes
			}
		default:
			return state
	}
}

export default combineReducers({
	prospectos,
	usuario,
	atualizacoes,
})
