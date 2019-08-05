import React from 'react';
import {
	View,
	TouchableOpacity,
	ActivityIndicator,
	Text,
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

		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>

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

						<ListaDeProspectos
							title='Pessoas'
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
							bottom: 20,
							right: 20,
						}}
							onPress={() => navigation.navigate('ImportarProspectos')}
							hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
						>
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
		prospecto.situacao_id === SITUACAO_LIGAR ||
		prospecto.situacao_id === SITUACAO_VISITA
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
