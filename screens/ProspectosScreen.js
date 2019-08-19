import React from 'react';
import {
	View,
	TouchableOpacity,
	ActivityIndicator,
	Text,
	Platform,
	Image,
} from 'react-native';
import { LinearGradient } from 'expo'
import { white, gold, dark, lightdark, black, primary, gray } from '../helpers/colors'
import ListaDeProspectos from '../components/ListaDeProspectos'
import { connect } from 'react-redux'
import { stylesProspecto } from '../components/Styles'
import {
	SITUACAO_IMPORTAR,
	SITUACAO_CADASTRO,
	SITUACAO_MENSAGEM,
	SITUACAO_LIGAR,
	SITUACAO_VISITA,
	CHURCH_PRO,
	VALOR_MENSAGEM,
	VALOR_LIGAR,
	VALOR_VISITA,
} from '../helpers/constants'
import {
	sincronizar,
} from '../helpers/helper'
import consolidacao from '../assets/images/user.png'
import seta from '../assets/images/seta.png'
import {
	alterarUsuarioNoAsyncStorage,
	porProspectoDaSincronizacao,
	pegarAdministracaoNoAsyncStorage,
} from '../actions'
import Loading from '../components/Loading';
import { Icon } from 'react-native-elements'

class ProspectosScreen extends React.Component {

	state = {
		carregando: true,
		busca: null,
		buscaMensagem: true,
		buscaTelefone: false,
		buscaVisita: false,
		sincronizando: false,
	}

	componentDidMount = async () => {
		const {
			navigation,
			prospectos,
			pegarAdministracaoNoAsyncStorage,
		} = this.props
		const retorno =	await pegarAdministracaoNoAsyncStorage()
		this.setState({ carregando: false })
		if (retorno && retorno.bloqueiarTela) {
			navigation.navigate('Perguntas', { prospecto_id: retorno.prospecto_id })
		}else{
			this.comecarSincronizacao()
		}
	}

	static navigationOptions = () => {
		return {
			header: null,
		}
	}

	comecarSincronizacao = () => {
		this.setState({ sincronizando: true })
		if(this.props.usuario){
			sincronizar(this.props, () => { this.setState({ sincronizando: false }) })
		}
	}

	render() {
		let {
			prospectosFiltrados,
			navigation,
			usuario,
		} = this.props
		const {
			carregando,
			sincronizando,
		} = this.state

		let { busca, buscaMensagem, buscaTelefone, buscaVisita, buscaEvento } = this.state

		if (buscaMensagem !== false || buscaTelefone !== false || buscaVisita !== false || buscaEvento !== false) {

			prospectosFiltrados = prospectosFiltrados.filter(item => {
				const itemData = item.situacao_id.toString()
				let textData = ''
				if (buscaMensagem === true) {
					textData = '1'
				}
				if (buscaTelefone === true) {
					textData = '2'
				}
				if (buscaVisita === true) {
					textData = '3'
				}
				return itemData.indexOf(textData) > -1
			})
		}

		let pontos = 0
		if (usuario.mensagens) {
			pontos += usuario.mensagens * VALOR_MENSAGEM
		}
		if (usuario.ligacoes) {
			pontos += usuario.ligacoes * VALOR_LIGAR
		}
		if (usuario.visitas) {
			pontos += usuario.visitas * VALOR_VISITA
		}

		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				{
					sincronizando &&
					<View style={{
						flex: 0.1,
						flexDirection: 'row',
						alignItems: 'center',
						alignSelf: 'center',
					}}>
						<ActivityIndicator />
						<Text style={{ marginLeft: 5, color: white }}>
							Sincronizando ...
						</Text>
					</View>
				}
				{
					carregando &&
					<Loading title={'Buscando pessoas'} />
				}
				{
					!carregando &&
						<React.Fragment>
							<View style={{
								padding: 10, 
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}>
							<Text style={{color: white}}>
								{usuario.nome}
							</Text>
							<Text style={{color: primary}}>
								{pontos} XP
							</Text>
						</View>
						<View style={{
							padding: 10,
							flexDirection: 'row-reverse',
							}}>
							<Text style={{fontSize: 10, color: white}}>
								Última Sincronização: {usuario.ultima_sincronizacao_data} - {usuario.ultima_sincronizacao_hora}
							</Text>
						</View>
						<View style={[stylesProspecto.containerBadge]}>

							<TouchableOpacity
								style={{
									borderBottomWidth: buscaMensagem ? 2 : 0,
									borderBottomColor: buscaMensagem ? primary : 'transparent',
									marginRight: 0, flex: 1, padding: 10
								}}
								activeOpacity={1}
								onPress={() => {
									this.setState({
										buscaMensagem: !buscaMensagem,
										buscaTelefone: false,
										buscaVisita: false,
										buscaEvento: false
									})
								}} >
								<Text style={{
									color: buscaMensagem === true ? primary : white,
									fontSize: 12,
									textAlign: 'center',
									fontWeight: buscaMensagem === true ? 'bold' : 'normal'
								}}>Mensagem</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{
									borderBottomWidth: buscaTelefone ? 2 : 0,
									borderBottomColor: buscaTelefone ? primary : 'transparent',
									marginRight: 0, flex: 1, padding: 5
								}}
								activeOpacity={1}
								onPress={() => {
									this.setState({
										buscaMensagem: false,
										buscaTelefone: !buscaTelefone,
										buscaVisita: false,
										buscaEvento: false,
									})
								}} >
								<Text
									style={{
										color: buscaTelefone === true ? primary : white,
										fontSize: 13,
										textAlign: 'center',
										fontWeight: buscaTelefone === true ? 'bold' : 'normal'
									}} >
									Ligar
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{
									borderBottomWidth: buscaVisita ? 2 : 0,
									borderBottomColor: buscaVisita ? primary : 'transparent',
									marginRight: 0, flex: 1, padding: 5
								}}
								activeOpacity={1}
								onPress={() => {
									this.setState({
										buscaMensagem: false,
										buscaTelefone: false,
										buscaVisita: !buscaVisita,
										buscaEvento: false,
									})
								}} >
								<Text
									style={{
										color: buscaVisita === true ? primary : white,
										fontSize: 12,
										textAlign: 'center',
										fontWeight: buscaVisita === true ? 'bold' : 'normal'
									}} >
									Visitar
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{ marginRight: 0, flex: 1 }}
								onPress={() => this.comecarSincronizacao()}>
								<Icon
									name='retweet'
									type='font-awesome'
									color={white}
									size={22}
								/>
							</TouchableOpacity>

						</View>
						{
							prospectosFiltrados.length === 0 ?
								<View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
									<Text style={{ color: gray, fontSize: 20 }}>Você não possui</Text>
									<Text style={{ color: gray, fontSize: 20 }}>consolidações!</Text>
									<Image source={consolidacao} style={{ marginTop: 15, width: 120, height: 120, resizeMode: "contain", }} />
									<Text style={{ color: gray, fontSize: 14, padding: 15 }}>Para incluir, basta cadastrar ou importar </Text>

									<Image source={seta} style={{
										width: 100, height: 100, resizeMode: "contain",
										position: 'absolute', bottom: -120, right: -20
									}} />
								</View>
								:
								prospectosFiltrados &&
								<ListaDeProspectos
									prospectos={prospectosFiltrados}
									navigation={navigation}
								/>
						}

						<TouchableOpacity style={{
							backgroundColor: primary,
							borderRadius: 50 / 2,
							height: 50,
							width: 50,
							justifyContent: 'center',
							alignItems: 'center',
							position: 'absolute',
							bottom: 10,
							right: 5,
						}}
							onPress={() => navigation.navigate('ImportarProspectos')}
							hitSlop={{ top: 5, right: 5, bottom: 5, left: 0 }} >
							<Text style={{ fontSize: 22, fontWeight: 'bold', color: white, textAlign: 'center' }}>+</Text>
						</TouchableOpacity>
					</React.Fragment>
				}

			</LinearGradient>
		)
	}
}

function mapStateToProps({ prospectos, usuario, }) {
	const prospectosFiltrados = prospectos.filter(prospecto =>
		prospecto.situacao_id === SITUACAO_IMPORTAR ||
		prospecto.situacao_id === SITUACAO_CADASTRO ||
		prospecto.situacao_id === SITUACAO_MENSAGEM ||
		prospecto.situacao_id === SITUACAO_LIGAR
	)
	return {
		prospectosFiltrados,
		prospectos,
		usuario,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		porProspectoDaSincronizacao: (prospectos) => dispatch(porProspectoDaSincronizacao(prospectos)),
		pegarAdministracaoNoAsyncStorage: () => dispatch(pegarAdministracaoNoAsyncStorage()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProspectosScreen)
