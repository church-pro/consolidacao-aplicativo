import React from 'react';
import Loading from '../components/Loading';
import { primary, green, black, white, lightdark, dark, gray, red } from '../helpers/colors';
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
import { ProgressBar, Colors } from 'react-native-paper'

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

		let acoes = []
		if(item){
			if(item.missao.mensagens > 0){
				const dados = {
					icone: 'envelope',
					valor: item.mensagens,
					valorFinal: item.missao.mensagens,
					valorDaBarra: item.mensagens / item.missao.mensagens
				}
				acoes.push(dados)
			}
			if(item.missao.ligacoes > 0){
				const dados = {
					icone: 'phone',
					valor: item.ligacoes,
					valorFinal: item.missao.ligacoes,
					valorDaBarra: item.ligacoes / item.missao.ligacoes
				}
				acoes.push(dados)
			}
			if(item.missao.visitas > 0){
				const dados = {
					icone: 'home',
					valor: item.visitas,
					valorFinal: item.missao.visitas,
					valorDaBarra: item.visitas / item.missao.visitas
				}
				acoes.push(dados)
			}
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
								{
									acoes.map(item =>
										<View key={item.icone}>
											<View style={{ flexDirection: 'row', }}>
												<Icon type="font-awesome" name={item.icone} size={30} color={white} />
												<View style={{ flex: 1, padding: 10, }}>
													<ProgressBar progress={item.valorDaBarra} color={primary} style={{ paddingVertical: 0 }} />
												</View>
											</View>
											<View>
												<Text
													style={{
														color: white,
														alignSelf: 'center',
													}}>
													{item.valor}/{item.valorFinal}
												</Text>
											</View>
										</View>
									)
								}

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
