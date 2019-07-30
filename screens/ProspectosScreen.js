import React from 'react';
import {
	View,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Drawer, Header, Title, Left, Body, Right, } from 'native-base'
import SideBar from '../components/SideBar'
import { createBottomTabNavigator } from 'react-navigation'
import { LinearGradient } from 'expo'
import { white, gold, dark, lightdark, black, primary } from '../helpers/colors'
import ListaDeProspectos from '../components/ListaDeProspectos'
import { connect } from 'react-redux'
import {
	SITUACAO_IMPORTAR,
	SITUACAO_CADASTRO,
	SITUACAO_MENSAGEM,
	SITUACAO_LIGAR,
	SITUACAO_VISITA,
	CHURCH_PRO,
} from '../helpers/constants'
import {
	sincronizarNaAPI,
	recuperarHistoricoNaoSincronizado,
	limparHistoricos,
} from '../helpers/api'
import AddButton from '../components/AddButton';
import ImportarProspectosScreen from './ImportarProspectosScreen'

class ProspectosScreen extends React.Component {

	state = {
		carregando: true,
	}

	closeDrawer = () => {
		this.drawer._root.close()
	};
	openDrawer = () => {
		this.drawer._root.open()
	};

	componentDidMount() {
		if (this.props.prospectos) {
			this.setState({ carregando: false })
		}
	}

	static navigationOptions = () => {
		return {
			header: null,
			gesturesEnabled: false,
		}
	}

	render() {
		const {
			prospectos,
			navigation,
		} = this.props
		const {
			carregando,
		} = this.state

		const dadosListagem = [
			{
				label: 'Mensagem',
				tipo: SITUACAO_IMPORTAR,
				icone: 'envelope',
			},
			{
				label: 'Ligar',
				tipo: SITUACAO_MENSAGEM,
				icone: 'phone',
			},
			{
				label: 'Adicionar',
				tipo: null,
			},
			{
				label: 'Visita',
				tipo: SITUACAO_LIGAR,
				icone: 'calendar',
			},
			{
				label: 'Evento',
				tipo: SITUACAO_VISITA,
				icone: 'home',
			},
		]

		let componentesDaTab = {}
		dadosListagem.forEach(item => {

			if (item.tipo) {

				let prospectosFiltrados = prospectos.filter(prospecto => prospecto.situacao_id === item.tipo)

				if (item.tipo === SITUACAO_IMPORTAR) {
					prospectosFiltrados = prospectosFiltrados.concat(prospectos.filter(prospecto => prospecto.situacao_id === SITUACAO_CADASTRO))
				}

				const componenteLista = (props) => (
					<ListaDeProspectos
						title={item.label}
						prospectos={prospectosFiltrados}
						navigation={navigation}
					/>)

				componentesDaTab[[item.label]] = {
					screen: componenteLista,
					navigationOptions: {
						tabBarIcon: ({ tintColor }) => (<Icon name={item.icone} type='font-awesome' color={tintColor} />),
					}
				}

			}

			if (item.tipo === null) {

				componentesDaTab.adicionar = {
					screen: ImportarProspectosScreen,
					navigationOptions: () => ({
						tabBarButtonComponent: () => (
							<AddButton />
						),
					}),
				}

			}
		})

		let qualAba = 'Mensagem'
		if (this.props.qualAba) {
			qualAba = this.props.qualAba
		}
		const Tabs = createBottomTabNavigator(
			componentesDaTab,
			{
				initialRouteName: qualAba,
				tabBarOptions: {
					showIcon: true,
					showLabel: false,
					activeTintColor: primary,
					inactiveTintColor: '#eee',
					style: {
						backgroundColor: dark,
					},
					indicatorStyle: {
						backgroundColor: gold,
					},
				}
			}
		)

		return (
			<Drawer
				ref={(ref) => { this.drawer = ref; }}
				content={<SideBar closeDrawer={this.closeDrawer} navigation={this.props.navigation} />}
				onClose={() => this.closeDrawer()}
			>
				<Header style={{ backgroundColor: black, borderBottomWidth: 0, paddingTop: 0, paddingLeft: 10 }} iosBarStyle="light-content">
					<Left style={{ flex: 0 }}>
						<TouchableOpacity
							style={{ backgroundColor: 'transparent', margin: 0, borderWidth: 0, paddingHorizontal: 8 }}
							onPress={() => this.openDrawer()}>
							<Icon type="font-awesome" name="bars" color={white} />
						</TouchableOpacity>
					</Left>
					<Body style={{ flex: 1 }}>
						<Title style={{ textAlign: 'center', alignSelf: 'center', justifyContent: "center", color: white, fontWeight: '200', fontSize: 16 }}> {CHURCH_PRO} </Title>
					</Body>
					<Right style={{ flex: 0 }}>
						<TouchableOpacity
							style={{ backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 8 }}
							onPress={() => navigation.navigate('Sincronizacao', { tela: 'Prospectos' })}>
							<Icon name='retweet' type='font-awesome' color={white} />
						</TouchableOpacity>
					</Right>
				</Header>

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
						<Tabs />
					}

				</LinearGradient>
			</Drawer>
		)
	}
}

function mapStateToProps({ prospectos, }, props) {
	let qualAba = null
	if (props.navigation.state.params && props.navigation.state.params.qualAba) {
		qualAba = props.navigation.state.params.qualAba
	}
	return {
		prospectos,
		qualAba,
	}
}

function mapDispatchToProps(dispatch) {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProspectosScreen)
