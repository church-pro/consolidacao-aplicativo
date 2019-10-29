import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark, dark, primary, gray, red } from '../helpers/colors';
import {
	View,
	Text,
	NetInfo,
	TouchableOpacity,
	TextInput,
	Alert,
	ScrollView,
	Image
} from 'react-native';
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements';
import { stylesMarcar } from '../components/Styles';
import empty from '../assets/images/empty.png'
import sad from '../assets/images/sad.png'
import {
	alterarUsuarioNoAsyncStorage,
} from '../actions'
import {
	missoesValidas,
} from '../helpers/helper'

class MissoesScreen extends React.Component {

	static navigationOptions = () => {
		return {
			headerTintColor: white,
			header: null,
		}
	}

	state = {
		missoes: [],
		carregando: true,
	}

	componentDidMount() {
		const {
			missoes,
		} = this.props
		if(missoes){
			this.setState({
				missoes,
				carregando: false,
			})
		}
	}

	async selecionarMissao(itemSelecionado){
		this.setState({carregando: true})
		const {
			navigation,
			usuario,
			alterarUsuarioNoAsyncStorage
		} = this.props

		usuario.missoes = usuario.missoes.map(item => {
			if(itemSelecionado.missao._id === item.missao._id){
				itemSelecionado.visto = true
				return itemSelecionado
			}else{
				return item
			}
		})

		await alterarUsuarioNoAsyncStorage(usuario)
		await this.setState({carregando: false})
		navigation.navigate('Missao', {item: itemSelecionado})
	}

	render() {
		const {
			missoes,
			carregando,
		} = this.state
		const { 
			navigation,
		} = this.props

		return (
			<View style={{ flex: 1, backgroundColor: dark }}>

				{
					carregando &&
					<Loading title={'Carregando ...'} />
				}
				{
					!carregando &&
						<View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}>
								<Text style={{ color: white, fontSize: 30, fontWeight: 'bold' }}>
									Missões
								</Text>
							</View>
							{
								missoes &&
									missoes.length === 0 && 
									<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
										<Text style={{ color: gray, fontSize: 18 }}>Você não possui nenhuma missão...</Text>
										<Image source={empty} style={{ height: 100, width: 100, marginVertical: 15 }} />
									</View>
							}
							{
								missoes.length > 0 &&
									<ScrollView>
										<View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>
											{
												missoes.map(item =>
													<View style={{
														borderTopWidth: 1,
														borderTopColor: dark,
														padding: 12,
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'space-between',
														backgroundColor: item.visto ? lightdark : primary,
													}}
													key={item.missao._id}>
													<TouchableOpacity
														onPress={() => this.selecionarMissao(item)}
														style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
														<View>
															<Text style={{ color: white }}>{item.missao.nome}</Text>
															<Text style={{ color: white, fontSize: 8, }}>{item.missao.data_inicial} até {item.missao.data_final}</Text>
														</View>
														<View style={{ flexDirection: 'row', alignItems: 'center' }}>
															<Icon type="font-awesome" name="angle-right" size={22} containerStyle={{ marginLeft: 5 }} color={white} />
														</View>
													</TouchableOpacity>
												</View>
												)
											}
										</View>

									</ScrollView>
							}
						</View>
				}
			</View>
		)
	}
}

const mapStateToProps = ({ usuario }) => {
	const missoes = missoesValidas(usuario)
	return { 
		usuario,
		missoes,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MissoesScreen)
