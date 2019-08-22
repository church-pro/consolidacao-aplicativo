import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, dark, gray } from '../helpers/colors';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView
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

class ClubeScreen extends React.Component {

	static navigationOptions = ({ navigation, }) => {
		const { params = { clube } } = navigation.state
		return {
			header: null
		}
	}

	render() {
		const {
			clube,
			atualizarDados
		} = this.props

		return (
			<>
				<Header style={[stylesImportar.header, { backgroundColor: dark }]} iosBarStyle="light-content">
					<Left >
						<TouchableOpacity
							hitSlop={{ right: 10, bottom: 10, top: 10, left: 10 }}
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
					<Body >
						<Title
							style={stylesImportar.headerTitle}
						>{clube.nome}</Title>
					</Body>
					<Right>
						{/* <TouchableOpacity
							onPress={atualizarDados}>
							<Icon
								name='download'
								type='font-awesome'
								color={white}
								size={22}
							/>
							<Text style={{ color: white }}>Atualizar Dados</Text>
						</TouchableOpacity> */}
					</Right>

				</Header>
				<ScrollView style={{ flex: 1, backgroundColor: dark, paddingHorizontal: 20 }}>

					<Text style={{ color: white, fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>
						Participantes
					</Text>
					<View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>

						{
							clube.nos &&
							clube.nos.length > 0 &&
							clube.nos
								.map(no => {
									let pontos = 0
									if (no.mensagens) {
										pontos += no.mensagens * VALOR_MENSAGEM
									}
									if (no.ligacoes) {
										pontos += no.ligacoes * VALOR_LIGAR
									}
									if (no.visitas) {
										pontos += no.visitas * VALOR_VISITA
									}
									no.pontos = pontos
									return no
								})
								.sort((a, b) => (a.pontos < b.pontos) ? 1 : -1)
								.map(no => {
									return (
										<TouchableOpacity
											style={{
												flex: 1,
												borderTopWidth: 1,
												borderTopColor: dark,
												padding: 12,
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
											key={no._id}
											onPress={() => this.props.navigation.navigate('PerfilClube', { no })}>
											<Text numberOfLines={1} style={{ color: white, flex: 1, }}> {no.nome} </Text>
											<Text style={{ color: white }}> {no.pontos} XP </Text>
										</TouchableOpacity>
									)
								})
						}
					</View>

					{
						clube.nos && clube.nos.length === 0 &&
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<Image source={empty} style={{ height: 100, width: 100 }} />
							<Text style={{ color: gray, fontSize: 16, marginVertical: 15 }}>
								Clube sem participantes
					</Text>
						</View>
					}
				</ScrollView>
			</>
		)
	}
}

const mapStateToProps = (state, { navigation }) => {
	const {
		clube,
		atualizarDados
	} = navigation.state.params
	return {
		clube,
		atualizarDados
	}
}

export default connect(mapStateToProps, null)(ClubeScreen)
