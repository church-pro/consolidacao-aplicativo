import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, dark, gray } from '../helpers/colors';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	Platform
} from 'react-native';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import empty from '../assets/images/empty.png'
import { Header, Title, Left, Body, Right } from 'native-base'
import arrow from '../assets/images/arrow-back.png'
import { stylesImportar } from '../components/Styles'

class ClubeScreen extends React.Component {

	static navigationOptions = ({ navigation, }) => {
		const { params = { clube } } = navigation.state
		return {
			header: null
		}
	}

	render() {
		const {
			clube
		} = this.props

		return (
			<>
				<Header style={[stylesImportar.header, { backgroundColor: dark }]} iosBarStyle="light-content">
					<Left >
						<TouchableOpacity
							hitSlop={{ right: 10 }}
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
					<Right />

				</Header>
				<View style={{ flex: 1, backgroundColor: dark, padding: 20 }}>

					<Text style={{ color: white, fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>
						Participantes
				</Text>
					<View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>

						{
							clube.nos && clube.nos.length > 0 &&
							clube.nos.map(no => {
								let pontos = 0
								if(no.mensagems){
									pontos+= no.mensagems
								}
								if(no.ligacoes){
									pontos+= no.ligacoes
								}
								if(no.visitas){
									pontos+= no.visitas
								}
								return (
									<TouchableOpacity
										style={{
											borderTopWidth: 1,
											borderTopColor: dark,
											padding: 12,
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}
										key={no._id}
										onPress={() => this.props.navigation.navigate('PerfilClube', { no })}>
										<Text style={{ color: white }}> {no.nome} </Text>
										<Text style={{ color: white }}> {pontos} ações </Text>
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
				</View>
			</>
		)
	}
}

const mapStateToProps = (state, { navigation }) => {
	const {
		clube
	} = navigation.state.params
	return {
		clube,
	}
}

export default connect(mapStateToProps, null)(ClubeScreen)
