import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	NetInfo,
} from 'react-native';
import { Icon, Card, CheckBox } from 'react-native-elements'
import { Drawer, Header, Title, Left, Body, Right, Fab, Button } from 'native-base'
import ActionButton from 'react-native-action-button';
import SideBar from '../components/SideBar'
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation'
import { LABEL_LISTA_DE_OURO } from '../helpers/constants'
import { white, gold, dark, lightdark } from '../helpers/colors'
import ListaDeProspectos from '../components/ListaDeProspectos'
import { connect } from 'react-redux'
import { 
	SITUACAO_IMPORTAR, 
	SITUACAO_MENSAGEM,
	SITUACAO_LIGAR,
	SITUACAO_VISITA,
	SITUACAO_EVENTO
} from '../helpers/constants'
import styles from '../components/ProspectoStyle';
import { 
	alterarProspectoNoAsyncStorage, 
	alterarAdministracao,
	alterarUsuarioNoAsyncStorage,
	pegarUsuarioNoAsyncStorage,
	adicionarProspectosAoAsyncStorage,
} from '../actions'
import {
	sincronizarNaAPI,
	recuperarHistoricoNaoSincronizado,
	limparHistoricos,
} from '../helpers/api'

class ProspectosScreen extends React.Component {

	state = {
		carregando: true,
		quer: false,
		naoQuer: false,
		pendente: false,
		active: false,
		sincronizando: false,
	}

	closeDrawer = () => {
		this.drawer._root.close()
	};
	openDrawer = () => {
		this.drawer._root.open()
	};

	componentDidMount(){
		if(this.props.prospectos){
			this.setState({carregando:false})
		}
	}

	novoProspecto = () => {
		this.props.navigation.navigate('NovoProspecto')
		this.setState( state => ({ active: state.active = false}))
	}
	importarProspecto = () => {
		this.props.navigation.navigate('ImportarProspectos')
		this.setState( state => ({ active: state.active = false}))
	}

	alterarProspecto = (tipo) => {
		const { 
			alterarProspectoNoAsyncStorage, 
			alterarAdministracao,
			administracao,
		} = this.props
		let prospecto = administracao.prospectoSelecionado

		administracao.ligueiParaAlguem = false
		administracao.prospectoSelecionado = null
		alterarAdministracao(administracao)

		if(tipo === 'remover'){
			prospecto.situacao_id = SITUACAO_REMOVIDO
		}
		prospecto.ligueiParaAlguem = false
		alterarProspectoNoAsyncStorage(prospecto)

		if(tipo === 'remover'){
			Alert.alert('Removido', 'Prospecto removido!')
		}else{
			Alert.alert('Pendente', 'Prospecto pendete!')
		}
	}

	marcarDataEHora = () => {
		const { 
			alterarProspectoNoAsyncStorage, 
			alterarAdministracao,
			administracao,
			navigation,
		} = this.props
		let prospecto = administracao.prospectoSelecionado

		administracao.ligueiParaAlguem = false
		administracao.prospectoSelecionado = null
		alterarAdministracao(administracao)

		prospecto.ligueiParaAlguem = false
		alterarProspectoNoAsyncStorage(prospecto)

		this.setState({
			quer: false,
			naoQuer: false,
			pendente: false,
		})

		navigation.navigate('MarcarDataEHora', { prospecto_id: prospecto._id, situacao_id: SITUACAO_APRESENTAR })
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
			administracao, 
			navigation,
		} = this.props
		const { 
			carregando,
			quer, 
			naoQuer, 
			pendente,
		} = this.state

		const dadosListagem = [
			{
				label: 'Mensagem',
				tipo: SITUACAO_IMPORTAR,
				icone: 'star',
			},
			{
				label: 'Ligar',
				tipo: SITUACAO_LIGAR,
				icone: 'star',
			},
			{
				label: 'Visita',
				tipo: SITUACAO_VISITA,
				icone: 'star',
			},
			{
				label: 'Evento',
				tipo: SITUACAO_EVENTO,
				icone: 'star',
			},
		]

		let componentesDaTab = {}
		dadosListagem.forEach(item => {

			const componenteLista =	(props) => (
				<ListaDeProspectos 
					title={item.label}
					prospectos={prospectos.filter(prospecto => prospecto.situacao_id === item.tipo)} 
					navigation={navigation}
				/>)

			componentesDaTab[[item.label]] = {
				screen: componenteLista, 
				navigationOptions: {
					tabBarIcon: ({ tintColor }) => ( <Icon name={item.icone} type='font-awesome' color={tintColor} />),
				}
			}
		})

		let tabInicial = 'Mensagem'
		if(this.props.tabInicial){
			tabInicial = this.props.tabInicial
		}
		const Tabs = createMaterialTopTabNavigator(
			componentesDaTab,
			{
				initialRouteName: tabInicial,
				tabBarOptions: {
					showIcon: true,
					showLabel: false,
					activeTintColor: gold,
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
				<Header  style={{backgroundColor: dark, borderBottomWidth: 0, paddingTop: 0, paddingLeft: 10}} iosBarStyle="light-content">
					<Left style={{flex: 0}}>
						<TouchableOpacity 
							style={{backgroundColor: 'transparent', margin: 0, borderWidth: 0, paddingHorizontal:8}}
							onPress={() => this.openDrawer()}>
							<Icon type="font-awesome" name="bars" color={white}/>
						</TouchableOpacity>
					</Left>
					<Body style={{flex: 1}}>
						<Title style={{textAlign: 'center', alignSelf: 'center', justifyContent: "center", color: white, fontWeight: '200', fontSize: 16 }}>CHURCH PRO CONSOLIDAÇÃO</Title>
					</Body>
					<Right style={{flex: 0}}>
						<TouchableOpacity 
							style={{backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 8}}
							onPress={() => navigation.navigate('Sincronizacao', {tela: 'Prospectos'})}>
							<Icon name='retweet' type='font-awesome' color={white} />
						</TouchableOpacity>
					</Right>
				</Header>

				<View style={{flex: 1, backgroundColor: lightdark}}>

					{
						carregando && 
						<View style={{flex: 1, justifyContent: 'center'}}>
							<ActivityIndicator 
								size="large"
								color={gold}
							/>
						</View>
					}

					{
						!carregando &&
							!administracao.ligueiParaAlguem &&
							<Tabs />
					}

					{
						!carregando &&
							administracao.ligueiParaAlguem &&
							<Card containerStyle={{backgroundColor: dark, borderColor: gold, borderRadius: 6}}>
								<Text style={{color: white, textAlign: 'center', fontWeight: 'bold',
									paddingBottom: 8}}
								>
									Prospecto mostrou interesse?
								</Text>
								<View style={{backgroundColor: lightdark, height: 180, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
									<CheckBox
										title='Quer'
										checked={this.state.quer}
										onPress={() => this.setState({
											quer: true,
											naoQuer: false,
											pendente: false,
										})}
										checkedIcon='dot-circle-o'
										uncheckedIcon='circle-o'
										checkedColor={gold}
										textStyle={{color: white}}
										containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
									/>
									<CheckBox
										title='Não quer'
										checked={this.state.naoQuer}
										onPress={() => this.setState({
											quer: false,
											naoQuer: true,
											pendente: false,
										})}
										checkedIcon='dot-circle-o'
										uncheckedIcon='circle-o'
										checkedColor={gold}
										textStyle={{color: white}}
										containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
									/>
									<CheckBox
										title='Ligar depois'
										checked={this.state.pendente}
										onPress={() => this.setState({
											quer: false,
											naoQuer: false,
											pendente: true,
										})}
										checkedIcon='dot-circle-o'
										uncheckedIcon='circle-o'
										checkedColor={gold}
										textStyle={{color: white}}
										containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
									/>
								</View>

								<View style={{backgroundColor: dark, height: 40, marginTop: 20, justifyContent: 'flex-end', marginLeft: -15, marginRight: -15, marginBottom: -15}}>
									{
										this.state.quer && 
										<TouchableOpacity
											style={[styles.button, style={height: 40, borderRadius: 0, backgroundColor: gold}]}
											onPress={() => {this.marcarDataEHora()}}>
											<Text style={styles.textButton}>Marcar Apresentação</Text>
										</TouchableOpacity>
									}
									{
										this.state.naoQuer && 
										<TouchableOpacity
											style={[styles.button, style={height: 40, borderRadius: 0, backgroundColor: gold}]}
											onPress={() => {this.alterarProspecto('remover')}}>
											<Text style={styles.textButton}>Remover</Text>
										</TouchableOpacity>
									}
									{
										this.state.pendente && 
										<TouchableOpacity
											style={[styles.button, style={height: 40, borderRadius: 0, backgroundColor: gold}]}
											onPress={() => {this.alterarProspecto()}}>
											<Text style={styles.textButton}>Deixar Pendente</Text>
										</TouchableOpacity>
									}
								</View>

							</Card>
					}
				</View>
			</Drawer>
		)
	}
}

function mapStateToProps({ prospectos, usuario, administracao,}, props){
	let tabInicial = null
	if(props.navigation.state.params && props.navigation.state.params.tab){
		tabInicial = props.navigation.state.params.tab
	}
	return {
		prospectos,
		usuario,
		administracao,
		tabInicial,
	}
}

function mapDispatchToProps(dispatch){
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
		alterarAdministracao: (administracao) => dispatch(alterarAdministracao(administracao)),
		alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
		pegarProspectosNoAsyncStorage: () => dispatch(pegarProspectosNoAsyncStorage()),
		pegarUsuarioNoAsyncStorage: () => dispatch(pegarUsuarioNoAsyncStorage()),
		adicionarProspectosAoAsyncStorage: (prospectos) => dispatch(adicionarProspectosAoAsyncStorage(prospectos)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProspectosScreen)
