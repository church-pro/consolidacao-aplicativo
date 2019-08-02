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
						<ListaDeProspectos
							title='Pessoas'
							prospectos={prospectos}
							navigation={navigation}
						/>
				}

			</LinearGradient>
		)
	}
}

function mapStateToProps({ prospectos, }, props) {
	let qualAba = null
	if (props.navigation.state.params && props.navigation.state.params.qualAba) {
		qualAba = props.navigation.state.params.qualAba
	}
	const prospectosFiltrados = prospectos.filter(prospecto => 
		prospecto.situacao_id === SITUACAO_IMPORTAR ||
		prospecto.situacao_id === SITUACAO_CADASTRO ||
		prospecto.situacao_id === SITUACAO_MENSAGEM ||
		prospecto.situacao_id === SITUACAO_LIGAR ||
		prospecto.situacao_id === SITUACAO_VISITA
	)
	return {
		prospectos: prospectosFiltrados,
		qualAba,
	}
}

function mapDispatchToProps(dispatch) {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProspectosScreen)
