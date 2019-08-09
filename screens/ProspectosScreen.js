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
} from '../helpers/constants'
import { 
	sincronizar,
} from '../helpers/helper'
import consolidacao from '../assets/images/user.png'
import seta from '../assets/images/seta.png'
import {
	alterarUsuarioNoAsyncStorage,
	porProspectoDaSincronizacao,
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

	componentDidMount() {
		this.comecarSincronizacao()
		if (this.props.prospectos) {
			this.setState({ carregando: false })
		}
	}

	static navigationOptions = () => {
		return {
			header: null,
		}
	}

	comecarSincronizacao = () => {
		this.setState({sincronizando: true})
		sincronizar(this.props, () => {this.setState({sincronizando: false})})
	}

	render() {
		let {
			prospectosFiltrados,
			navigation,
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

		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				{
					sincronizando &&
					<View style={{ 
						flex: 0.1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-around',
						flexWrap: 'wrap',
					}}>
						<ActivityIndicator />
						<Text style={{color: white}}>
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
								onPress={() => this.comecarSincronizacao()}>
								<Icon
									name='retweet'
									type='font-awesome'
									color={white}
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
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProspectosScreen)
