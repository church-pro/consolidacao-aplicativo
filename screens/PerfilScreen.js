import React from 'react';
import { FlatList, ScrollView } from 'react-native'
import Loading from '../components/Loading';
import { black, white, lightdark, dark, gray, gold } from '../helpers/colors';
import {
	View,
	Text,
} from 'react-native';
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'
import {
	VALOR_VISITA,
	VALOR_LIGAR,
	VALOR_MENSAGEM,
} from '../helpers/constants'
import { Icon } from 'react-native-elements';

class PerfilScreen extends React.Component {

	static navigationOptions = ({ navigation }) => {
		if (navigation.state && navigation.state.params && navigation.state.params.no) {
			return {
				title: navigation.state.params.no.nome,
				headerTintColor: white,
				headerStyle: {
					backgroundColor: black,
					borderBottomWidth: 0,
				},
				headerBackTitle: null
			}
		} else {
			return {
				headerTintColor: white,
				header: null,
			}
		}
	}

	render() {
		const {
			usuario,
			navigation,
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

		const linhaBorder = {
			padding: 10,
			flexDirection: 'row',
			alignItems: 'center',
			borderWidth: 1,
			borderColor: gray,
			borderRadius: 6,
			flexWrap: 'wrap',
		}

		const texto = {
			color: white,
		}

		let pontos = 0
		if (usuario.mensagens) {
			pontos += usuario.mensagens * VALOR_MENSAGEM
		}
		if (usuario.ligacoes) {
			pontos += usuario.ligacoes * VALOR_LIGAR
		}
		if (usuario.visitas) {
			pontos += usuario.visitas * VALOR_VISITA
		}
		const dados = [
			{
				label: 'Nome',
				valor: usuario.nome,
			},
			{
				label: 'Email',
				valor: usuario.email,
			},
			{
				label: 'Igreja',
				valor: usuario.nome_igreja,
			},
			{
				label: 'Pontos',
				valor: `${pontos} XP`,
			},
		]
		const items = [

			{
				label: 'Ações contabilizadas',
				valor: null,
			},
			{
				label: 'Mensagens Enviadas',
				valor: usuario.mensagens ? usuario.mensagens : 0,
			},
			{
				label: 'Ligações Atendidas',
				valor: usuario.ligacoes ? usuario.ligacoes : 0,
			},
			{
				label: 'Visitas Feitas',
				valor: usuario.visitas ? usuario.visitas : 0,
			},
			{
				label: 'Outras ações',
				valor: null,
			},
			{
				label: 'Importações',
				valor: usuario.importacoes ? usuario.importacoes : 0,
			},
			{
				label: 'Cadastros Novos',
				valor: usuario.cadastros ? usuario.cadastros : 0,
			},
			{
				label: 'Removidos',
				valor: usuario.removidos ? usuario.removidos : 0,
			},
			{
				label: 'Números Inválidos',
				valor: usuario.numeros_invalidos ? usuario.numeros_invalidos : 0,
			},
			{
				label: 'Ligações não atendidas',
				valor: usuario.ligacoes_nao_atendidas ? usuario.ligacoes_nao_atendidas : 0,
			},
			{
				label: 'Visitas marcadas sem ligar',
				valor: usuario.visitas_sem_ligar ? usuario.visitas_sem_ligar : 0,
			},
			{
				label: 'Falei mas não marquei',
				valor: usuario.ligacoes_sem_visita ? usuario.ligacoes_sem_visita : 0,
			},
			{
				label: 'Visitas Desmarcadas',
				valor: usuario.visitas_desmarcadas ? usuario.visitas_desmarcadas : 0,
			},
			{
				label: 'Marquei visita mas não fui',
				valor: usuario.marquei_mas_nao_visitei ? usuario.marquei_mas_nao_visitei : 0,
			},
			{
				label: 'Visitei mas não convidei',
				valor: usuario.visitas_sem_convite ? usuario.visitas_sem_convite : 0,
			},
		]

		let estouVendoMeuPerfil = true
		if (navigation.state && navigation.state.params && navigation.state.params.no) {
			estouVendoMeuPerfil = false
		}
		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
				<View>
					<Text style={{ color: white, fontSize: 18, fontWeight: 'bold', padding: 20 }}>
						{estouVendoMeuPerfil ? 'Meu Progresso' : 'Progresso do participante'}
					</Text>
				</View>
				<View>
					<Text style={{ paddingHorizontal: 20, color: white }}>
						Última Atualização: {usuario.ultima_sincronizacao_data} - {usuario.ultima_sincronizacao_hora}
					</Text>
				</View>
				<ScrollView style={{ paddingHorizontal: 20 }}>
					<View style={container}>
						{
							dados.map(item => {
								let qualStilo = linha
								if (item.valor === null) {
									qualStilo = linhaBorder
								}
								return (
									<View key={item.label} style={qualStilo}>
										<Text style={texto}>
											{item.label}
										</Text>
										<Text style={texto}>
											{item.valor}
										</Text>
									</View>
								)
							})
						}
					</View>
					<View style={container}>
						{

							<View style={{ flexDirection: 'row' }}>
								<Text style={texto}>
									Conquistas
								</Text>
								<View style={{ backgroundColor: '#8D533E', height: 80, width: 80, borderRadius: 80 / 2, alignItems: "center", justifyContent: "center" }}>
									<Icon type="font-awesome" name="envelope" size={30} color={white} />
									<View style={{ flexDirection: "row" }}>
										<Icon name="star" type="font-awesome" color={gold} size={12} />
										<Icon name="star" type="font-awesome" color={gray} size={12} containerStyle={{ marginHorizontal: 5 }} />
										<Icon name="star" type="font-awesome" color={gray} size={12} />
									</View>
									<Text style={{ color: white, }}>5 | 25</Text>
								</View>
								<View style={{ backgroundColor: '#8D533E', height: 80, width: 80, borderRadius: 80 / 2, alignItems: "center", justifyContent: "center" }}>
									<Icon type="font-awesome" name="envelope" size={30} color={white} />
									<View style={{ flexDirection: "row" }}>
										<Icon name="star" type="font-awesome" color={gold} size={12} />
										<Icon name="star" type="font-awesome" color={gray} size={12} containerStyle={{ marginHorizontal: 5 }} />
										<Icon name="star" type="font-awesome" color={gray} size={12} />
									</View>
									<Text style={{ color: white, }}>5 | 25</Text>
								</View>
								<View style={{ backgroundColor: '#8D533E', height: 80, width: 80, borderRadius: 80 / 2, alignItems: "center", justifyContent: "center" }}>
									<Icon type="font-awesome" name="envelope" size={30} color={white} />
									<View style={{ flexDirection: "row" }}>
										<Icon name="star" type="font-awesome" color={gold} size={12} />
										<Icon name="star" type="font-awesome" color={gray} size={12} containerStyle={{ marginHorizontal: 5 }} />
										<Icon name="star" type="font-awesome" color={gray} size={12} />
									</View>
									<Text style={{ color: white, }}>5 | 25</Text>
								</View>
							</View>

						}
					</View>
					<View style={container}>
						{
							dados.map(item => {
								let qualStilo = linha
								if (item.valor === null) {
									qualStilo = linhaBorder
								}
								return (
									<View key={item.label} style={qualStilo}>
										<Text style={texto}>
											{item.label}
										</Text>
										<Text style={texto}>
											{item.valor}
										</Text>
									</View>
								)
							})
						}
					</View>
					<View style={container}>
						{
							items.map(item => {
								let qualStilo = linha
								if (item.valor === null) {
									qualStilo = linhaBorder
								}
								return (
									<View key={item.label} style={qualStilo}>
										<Text style={texto}>
											{item.label}
										</Text>
										<Text style={texto}>
											{item.valor}
										</Text>
									</View>
								)
							})
						}
					</View>
				</ScrollView>
			</LinearGradient>
		)
	}
}

const mapStateToProps = ({ usuario }, { navigation }) => {
	let no = usuario
	if (navigation.state && navigation.state.params && navigation.state.params.no) {
		no = navigation.state.params.no
	}
	return {
		usuario: no,
	}
}

export default connect(mapStateToProps, null)(PerfilScreen)
