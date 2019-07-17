import { AsyncStorage } from 'react-native'                                                                                                                                                              

const versaoBanco = '0003'
const CHAVE_PROSPECTOS = 'churchProConsolidacao:prospectos' + versaoBanco
const CHAVE_USUARIO = 'churchProConsolidacao:usuario' + versaoBanco
const CHAVE_SITUACOES = 'churchProConsolidacao:situacoes' + versaoBanco

let api = 'http://192.168.0.14:8080'
api = 'https://church-pro-consolidacao-api.herokuapp.com'
const headers = {
	'Content-Type': 'application/json'
}

export const teste = () => 
	fetch(`${api}/`)
		.then(resultado => resultado.json())
		.then(json => json)

export const registrarNaAPI = (dados) =>
	fetch(
		`${api}/no/registrarUsuario`,
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
		`${api}/no/logar`,
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
		`${api}/no/sincronizar`,
		{
			headers,
			method: "POST",
			body: JSON.stringify(dados),
		}
	)
		.then(resultado => resultado.json())
		.then(json => json)

export function recuperarProspectos(){        
	return AsyncStorage.getItem(CHAVE_PROSPECTOS)
		.then(JSON.parse)                     
		.then((dados) => {                    
			if(dados === null){               
				dados = {prospectos: []}      
				AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
			}                                 
			return dados                      
		})                                    
}

export function submeterProspectos(prospectos){
	return recuperarProspectos()              
		.then(dados => {                      
			dados.prospectos = [...dados.prospectos, ...prospectos]
			AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
			return prospectos                 
		})                                    
}

export async function limparESubmeterProspectos(prospectos){
	const dados = {}
	dados.prospectos = [...prospectos]
	await AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
	return prospectos                 
}

export function modificarProspecto(prospecto){
	return recuperarProspectos()              
		.then(dados => {                      
			const prospectosAlterados = 
				dados.prospectos.map(prospectoNoAsyncStorage => {
					if(prospectoNoAsyncStorage._id === prospecto._id){
						return prospecto
					}else{
						return prospectoNoAsyncStorage
					}
				})
			dados.prospectos = prospectosAlterados
			AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
			return prospecto
		})                                    
}

export function limparProspectos(){
	const dados = {prospectos: []}      
	AsyncStorage.setItem(CHAVE_PROSPECTOS, JSON.stringify(dados))
	return true 
}

export function recuperarUsuario(){        
	return AsyncStorage.getItem(CHAVE_USUARIO)
		.then(JSON.parse)                     
		.then((dados) => {                    
			if(dados === null){               
				dados = {usuario: {}}      
				AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados))
			}                                 
			return dados                      
		})                                    
}

export function submeterUsuario(usuario){
	return recuperarUsuario()              
		.then(dados => {                      
			dados.usuario = usuario
			AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados))
			return usuario                 
		})
}

export function recuperarSituacoes(){        
	return AsyncStorage.getItem(CHAVE_SITUACOES)
		.then(JSON.parse)                     
		.then((dados) => {                    
			if(dados === null){               
				dados = {situacoes: []}      
				AsyncStorage.setItem(CHAVE_SITUACOES, JSON.stringify(dados))
			}                                 
			return dados                      
		})                                    
}

export function submeterSituacoes(situacoes){
	return recuperarSituacoes()              
		.then(dados => {                      
			dados.situacoes = [...dados.situacoes, ...situacoes]
			AsyncStorage.setItem(CHAVE_SITUACOES, JSON.stringify(dados))
			return situacoes                 
		})                                    
}
