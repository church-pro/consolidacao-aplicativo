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
} from '../actions'

function prospectos(state = [], action){
	switch(action.type){
		case LIMPAR_PROSPECTOS:
			return []
		case PEGAR_PROSPECTOS:
			return [...state, ...action.prospectos]
		case ADICIONAR_PROSPECTOS:
			return [...state, ...action.prospectos]
		case ALTERAR_PROSPECTO:
			const estadoAtualizado = state.map(prospecto => {
				if(prospecto.id === action.prospecto.id){
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

const estadoDaAdministracao = {
	ligueiParaAlguem: false,
	prospectoSelecionado: null,
}

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

export default combineReducers({
	prospectos,
	administracao,
	usuario,
})
