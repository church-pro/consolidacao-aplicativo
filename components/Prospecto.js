import React from 'react';
import {
	Text,
	View,
	Alert,
	TouchableOpacity,
	Linking
} from 'react-native';
import { Card, Icon, Badge } from 'react-native-elements'
import { white, gray, gold, dark, blue } from '../helpers/colors'
import call from 'react-native-phone-call'
import email from 'react-native-email'
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
import { 
	alterarProspectoNoAsyncStorage, 
	alterarAdministracao,
	adicionarSituacoesAoAsyncStorage,
} from '../actions'
import { connect } from 'react-redux'
import styles from './ProspectoStyle';
import Swipeable from 'react-native-swipeable';
import {
	pegarDataEHoraAtual
} from '../helpers/helper'

class Prospecto extends React.Component {

	perguntaSeDesejaRemover(){
		Alert.alert(
			'Remover',
			'Reamente deseja remover?',
			[
				{
					text: 'Não',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ 
					text: 'Sim', 
					onPress: () => this.removerProspecto() 
				},
			],
			{ 
				cancelable: false 
			},
		)

	}

	removerProspecto() {
		const { 
			prospecto, 
			alterarProspectoNoAsyncStorage,
			adicionarSituacoesAoAsyncStorage,
		} = this.props

		prospecto.situacao_id = SITUACAO_REMOVIDO
		alterarProspectoNoAsyncStorage(prospecto)
			.then(() => {
				const situacao = {
					prospecto_id: prospecto.celular_id,
					situacao_id: SITUACAO_REMOVIDO,
					data_criacao: pegarDataEHoraAtual()[0],
					hora_criacao: pegarDataEHoraAtual()[1],
				}
				this.props.adicionarSituacoesAoAsyncStorage([situacao])
					.then(() => Alert.alert('Removido', 'Prospecto removido!'))
			})
	}

	fecharProspecto() {
		const { prospecto, alterarProspectoNoAsyncStorage } = this.props
		prospecto.situacao_id = SITUACAO_FECHAMENTO
		alterarProspectoNoAsyncStorage(prospecto)
		Alert.alert('Sucesso', 'Prospecto pagou!')
	}

	chamarOTelefoneDoCelular() {
		const { prospecto, alterarAdministracao, alterarProspectoNoAsyncStorage } = this.props
		let { administracao } = this.props
		administracao.ligueiParaAlguem = true
		administracao.prospectoSelecionado = prospecto
		alterarAdministracao(administracao)
		prospecto.ligueiParaAlguem = true
		alterarProspectoNoAsyncStorage(prospecto)
		call({ number: prospecto.telefone, prompt: false }).catch(console.error)
	}
	whatsapp() {
		const { prospecto } = this.props
		Linking.openURL(`https://api.whatsapp.com/send?phone=55${prospecto.ddd}${prospecto.telefone}`).catch((err) => console.error(err))
	}

	render() {
		const { prospecto, navigation } = this.props

		const rightButtons = [

			<TouchableOpacity
				onPress={() => { navigation.navigate('Prospecto', { prospecto_id: prospecto._id }) }}
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-start',
					backgroundColor: blue,
					paddingLeft: 30,
				}}
			>
				<Icon name="pencil" size={22} color={white} type='font-awesome' />
			</TouchableOpacity>,
			<TouchableOpacity
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-start',
					backgroundColor: blue,
					paddingLeft: 30,
				}}
				onPress={() => { this.perguntaSeDesejaRemover() }} >
				<Icon name="trash" size={22} color={white} type='font-awesome' />
			</TouchableOpacity>
		]

		let funcaoOnPressDoIconeList = ''
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
		if(prospecto.situacao_id === SITUACAO_IMPORTAR){
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
					]
				},
			]
			parametros ={
				estados,
				perguntas,
			}
		}
		if(prospecto.situacao_id === SITUACAO_MENSAGEM){
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
					]
				},
			]
			parametros ={
				estados,
				perguntas,
			}
		}
		if(prospecto.situacao_id === SITUACAO_LIGAR){
			estados = {
				visitei: false,
				naoVisitei: false,
				mostrarBotaoConfirmar: false,
				convidei: false,
				naoConvidei: false,
				desmarcou:false,
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
								desmarcou:false,
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
								desmarcou:false,
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
								desmarcou:false,
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
								desmarcou:false,
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
					]
				},
			]
			parametros ={
				estados,
				perguntas,
			}
		}
		if(prospecto.situacao_id === SITUACAO_VISITA){
			estados = {
				veio: false,
				naoNao: false,
				mostrarBotaoConfirmar: false,
				remover: false,
				recomecar: false,
				mostrarPerguntaUm: true,
				mostrarPerguntaDois: false,
				situacao_id_nova: SITUACAO_EVENTO,
				situacao_id_extra: null,
				paraOndeVoltar: 'Prospectos',
				qualAba: 'Visita',
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
								naoNao: false,
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
							estado: 'naoVisitei',
							titulo: 'Não',
							onPress: {
								veio: false,
								naoNao: true,
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
						{
							estado: 'recomecar',
							titulo: 'Recomeçar o processo com a pessoa',
							onPress: {
								remover: false,
								recomecar: true,
								mostrarBotaoConfirmar: true,
								situacao_id_nova: SITUACAO_IMPORTAR,
								alertTitulo: labelParabens,
								alertMensagem: labelMensagem + 'ligar',
							},
						},
					]
				},
			]
			parametros ={
				estados,
				perguntas,
			}
		}

		parametros.prospecto_id = prospecto._id
		funcaoOnPressDoIconeList = () => navigation.navigate('Perguntas', parametros)

		return (
			<Card containerStyle={styles.containerCard} key={prospecto.id}>
				<Swipeable
					rightButtons={rightButtons}
					onRef={ref => this.swipeable = ref}
					onSwipeStart={this.props.onSwipeStart}
					onSwipeRelease={this.props.onSwipeRelease}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
						{
							prospecto.data &&
							<View style={styles.date}>
								<View style={{
									borderRadius: 9, backgroundColor: blue, borderWidth: 0,
									paddingHorizontal: 4, paddingVertical: 2
								}}>
								<Text style={{ color: white, fontSize: 12 }}>
									{prospecto.data} - {prospecto.hora} {prospecto.local && `-`} {prospecto.local}
								</Text>
							</View>
						</View>
						}

					</View>
					<View style={styles.name_phone}>
						<View style={styles.content}>
							<View style={{ alignItems: 'center', justifyContent: 'center' }}>
								<Icon
									name='star'
									size={34}
									color={blue}
									type='font-awesome'
									containerStyle={{ marginRight: 6 }}
								/>
								<Text style={{ position: "absolute", left: 11.4, top: 9, color: white, fontWeight: 'bold' }}>{prospecto.rating}</Text>
							</View>

							<Text style={[styles.text, style = { fontWeight: 'bold' }]}>{prospecto.nome}</Text>
						</View>

					<View style={{ backgroundColor: 'transparent', marginLeft: 3, flexDirection: 'row', alignItems: 'center' }}>

						<TouchableOpacity style={{ padding: 5 }} onPress={() => { this.chamarOTelefoneDoCelular() }}
							hitSlop={{ top: 15, right: 0, bottom: 15, left: 15 }}
						>
							<Icon name="phone" size={20} color={white} />
						</TouchableOpacity>
					<TouchableOpacity style={{ padding: 5 }} onPress={() => { this.whatsapp() }}
						hitSlop={{ top: 15, right: 15, bottom: 15, left: 0 }}
					>
						<Icon name="whatsapp" size={20} color="#5FCE5F" type='font-awesome' />
					</TouchableOpacity>

					<TouchableOpacity
						hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
						onPress={() => funcaoOnPressDoIconeList()}>
						<Icon name='list' type='font-awesome' color={gray} containerStyle={{ marginRight: 12 }} type='font-awesome' />
					</TouchableOpacity>
				</View>

			</View>
		</Swipeable>
	</Card>
		)
	}
}

function mapStateToProps({ administracao }) {
	return {
		administracao
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
		alterarAdministracao: (administracao) => dispatch(alterarAdministracao(administracao)),
		adicionarSituacoesAoAsyncStorage: (situacoes) => dispatch(adicionarSituacoesAoAsyncStorage(situacoes)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Prospecto)
