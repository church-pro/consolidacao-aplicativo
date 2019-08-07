import React from 'react';
import {
	View,
	TouchableOpacity,
	ActivityIndicator,
	Text,
	Platform,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Drawer, Header, Title, Left, Body, Right, } from 'native-base'
import SideBar from '../components/SideBar'
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
import AddButton from '../components/AddButton';
import ImportarProspectosScreen from './ImportarProspectosScreen'

class ProspectosScreen extends React.Component {

	state = {
		carregando: true,
		busca: null,
		buscaMensagem: true,
		buscaTelefone: false,
		buscaVisita: false,
		buscaEvento: false,
	}

	componentDidMount() {
		if (this.props.prospectos) {
			this.setState({ carregando: false })
		}
	}

	static navigationOptions = () => {
		return {
			header: null,
		}
	}

	render() {
		let {
			prospectos,
			navigation,
		} = this.props
		const {
			carregando,
		} = this.state

		console.log(prospectos)
		let { busca, buscaMensagem, buscaTelefone, buscaVisita, buscaEvento } = this.state

		if (buscaMensagem !== false || buscaTelefone !== false || buscaVisita !== false || buscaEvento !== false) {

			prospectos = prospectos.filter(item => {
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
				if (buscaEvento === true) {
					textData = '4'
				}

				return itemData.indexOf(textData) > -1
			})
		}

		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>

				{
					carregando &&
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<ActivityIndicator
							size="large"
							color={gold}
						/>
					</View>
				}
				{
					!carregando &&
					<React.Fragment>
						<View style={[stylesProspecto.containerBadge]}>

							<View style={[stylesProspecto.containerBadgeIcons, {
								borderBottomWidth: buscaMensagem ? 2 : 0,
								borderBottomColor: buscaMensagem ? primary : black,
							}]}>
								<Text
									onPress={() => {
										this.setState({
											buscaMensagem: !buscaMensagem,
											buscaTelefone: false,
											buscaVisita: false,
											buscaEvento: false
										})
									}}
									style={{ color: buscaMensagem === true ? primary : white, fontSize: 12 }} >
									Mensagem
								</Text>
							</View>
							<View style={[stylesProspecto.containerBadgeIcons, {
								borderBottomWidth: buscaTelefone ? 2 : 0,
								borderBottomColor: buscaTelefone ? primary : black
							}]}>
								<Text
									onPress={() => {
										this.setState({
											buscaMensagem: false,
											buscaTelefone: !buscaTelefone,
											buscaVisita: false,
											buscaEvento: false,
										})
									}}
									style={{ color: buscaTelefone === true ? primary : white, fontSize: 12 }} >
									Ligar
								</Text>
							</View>
							<View style={[stylesProspecto.containerBadgeIcons, {
								borderBottomWidth: buscaVisita ? 2 : 0,
								borderBottomColor: buscaVisita ? primary : black
							}]}>
								<Text
									onPress={() => {
										this.setState({
											buscaMensagem: false,
											buscaTelefone: false,
											buscaVisita: !buscaVisita,
											buscaEvento: false,
										})
									}}
									style={{ color: buscaVisita === true ? primary : white, fontSize: 12 }} >
									Visitar
								</Text>
							</View>
						</View>
						<ListaDeProspectos
							prospectos={prospectos}
							navigation={navigation}
						/>
						<TouchableOpacity style={{
							backgroundColor: primary,
							borderRadius: 50 / 2,
							height: 50,
							width: 50,
							justifyContent: 'center',
							alignItems: 'center',
							position: 'absolute',
							bottom: 10,
							right: 10,
						}}
							onPress={() => navigation.navigate('ImportarProspectos')}
							hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} >
							<Text style={{ fontSize: 22, fontWeight: 'bold', color: white, textAlign: 'center' }}>+</Text>
						</TouchableOpacity>
					</React.Fragment>
				}

			</LinearGradient>
		)
	}
}

function mapStateToProps({ prospectos, }) {
	const prospectosFiltrados = prospectos.filter(prospecto =>
		prospecto.situacao_id === SITUACAO_IMPORTAR ||
		prospecto.situacao_id === SITUACAO_CADASTRO ||
		prospecto.situacao_id === SITUACAO_MENSAGEM ||
		prospecto.situacao_id === SITUACAO_LIGAR
	)
	return {
		prospectos: prospectosFiltrados,
	}
}

function mapDispatchToProps(dispatch) {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProspectosScreen)
