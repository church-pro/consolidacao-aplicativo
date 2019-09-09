import React from 'react';
import Loading from '../components/Loading';
import { green, black, white, lightdark, dark, gray, red } from '../helpers/colors';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView,
	NetInfo,
	Alert
} from 'react-native';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import empty from '../assets/images/empty.png'
import { Header, Title, Left, Body, Right } from 'native-base'
import arrow from '../assets/images/arrow-back.png'
import { stylesImportar } from '../components/Styles'
import {
	VALOR_VISITA,
	VALOR_LIGAR,
	VALOR_MENSAGEM,
} from '../helpers/constants'
import {
	atualizarClubeNaAPI,
	removerParticipanteDoClubeNaAPI,
	removerParticipanteEBloquearDoClubeNaAPI,
	removerPessoaDaListaNegraNaAPI,
} from '../helpers/api'

class MissaoScreen extends React.Component {

	static navigationOptions = ({ navigation, }) => {
		const { params = { clube } } = navigation.state
		return {
			header: null
		}
	}

	state = {
		item: null,
		carregando: true,
	}

	componentDidMount() {
		const {
			item,
		} = this.props
		this.setState({
			item,
			carregando: false,
		})
	}

	render() {
		const {
			item,
			carregando,
		} = this.state
		const { 
			usuario,
		} = this.props

		const container = {
			padding: 10,
			borderWidth: 1,
			borderColor: gray,
			borderRadius: 6,
			marginTop: 10
		}

		const linha = {
			paddingVertical: 5,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			flexWrap: 'wrap',
		}

		const texto = {
			color: white,
		}

		return (
			<View style={{ flex: 1, backgroundColor: dark }}>
				<Header style={[stylesImportar.header, { backgroundColor: dark }]} iosBarStyle="light-content">
					<Left>
						<TouchableOpacity
							hitSlop={{ right: 15, bottom: 10, top: 10, left: 10 }}
							style={stylesImportar.containerIcon}
							onPress={() => this.props.navigation.goBack()}>
							{
								Platform.OS === "ios" ?
								<Icon type="font-awesome" name={"angle-left"}
									color={white} size={36}
								/>
								:
								<Image source={arrow} style={{ height: 16, width: 16, marginHorizontal: 5 }} />
							}
						</TouchableOpacity>
					</Left>
					<Body>
						<Title style={stylesImportar.headerTitle}>
							Missão
						</Title>
					</Body>
					<Right>
					</Right>
				</Header>
				{
					carregando &&
						<Loading title='Atualizando Missão' />
				}
				{
					!carregando &&
						item &&
						<ScrollView style={{ flex: 1, backgroundColor: dark, paddingHorizontal: 20 }}>
							<Text style={{ alignSelf: 'center', color: white, fontSize: 24, fontWeight: 'bold', marginTop: 15 }}>
								{item.missao.nome}
							</Text>
						<View style={container}>
								<View style={linha}>
									<Icon type="font-awesome" name="envelope" size={30} color={white} />
									<Text style={texto}>
										{item.missao.mensagens}
									</Text>
									<Text style={texto}>
										{item.mensagens}
									</Text>
								</View>
								<View style={linha}>
									<Icon type="font-awesome" name="phone" size={30} color={white} />
									<Text style={texto}>
										{item.missao.ligacoes}
									</Text>
									<Text style={texto}>
										{item.ligacoes}
									</Text>
								</View>
								<View style={linha}>
									<Icon type="font-awesome" name="home" size={30} color={white} />
									<Text style={texto}>
										{item.missao.visitas}
									</Text>
									<Text style={texto}>
										{item.visitas}
									</Text>
								</View>
							</View>
							<Text style={{ alignSelf: 'center', color: white, fontSize: 24, borderColor: gray, borderRadius: 6, fontWeight: 'bold', marginTop: 15 }}>
								Pontos: {item.missao.pontos} XP
							</Text>
						</ScrollView>
				}
			</View>
		)
	}
}

const mapStateToProps = (state, { navigation }) => {
	let usuario = state.usuario
	const {
		item,
	} = navigation.state.params
	return {
		item,
		usuario,
	}
}

export default connect(mapStateToProps, null)(MissaoScreen)
