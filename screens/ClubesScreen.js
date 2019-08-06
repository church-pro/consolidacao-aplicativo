import React from 'react';
import Loading from '../components/Loading';
import { black, white, lightdark } from '../helpers/colors';
import {
	View,
	Text,
	NetInfo,
	TouchableOpacity,
	TextInput,
} from 'react-native';
import {
	clubesNaAPI,
	buscarClubesNaAPI,
} from '../helpers/api'
import { connect } from 'react-redux'

class ClubesScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	state = {
		clubes: [],
		mostrarBuscar: false,
		mostrarCriar: false,
		nome: '',
		busca: '',
		mensagemDeError: '',
		clubesBuscados: [],
		carregando: false,
	}

	ajudadorDeSubmissao(){

	}

	buscarClubes(){
		const {
			busca,
			mensagemDeError,
		} = this.state
		this.setState({carregando: true})

		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if(isConnected){
						buscarClubesNaAPI({busca})
							.then(retorno => {
								if(retorno.ok){
									this.setState({
										clubesBuscados: retorno.resultado.clubes,
										mensagemDeError: '',
									})
								}
								if(!retorno.ok){
									this.setState({
										mensagemDeError: 'Clubes não encontrados',
									})
								}
								this.setState({carregando:false})
							})
					} else {
						this.setState({
							carregando: false,
						})
					}
				})
		} catch (err) {
			Alert.alert('Internet', 'Verifique sua internet!')
		}
	}

	componentDidMount(){
		const {
			usuario
		} = this.props
		try {
			NetInfo.isConnected
				.fetch()
				.then(isConnected => {
					if(isConnected){
						clubesNaAPI({no_id: usuario._id})
							.then(retorno => {
								this.setState({clubes: retorno.resultado.clubes})
							})
					} else {
						Alert.alert('Internet', 'Verifique sua internet!')
						this.props.navigation.goBack()
					}
				})
		} catch (err) {
			Alert.alert('Internet', 'Verifique sua internet!')
			this.props.navigation.goBack()
		}
	}

	render() {
		const {
			clubes,
			mostrarCriar,
			mostrarBuscar,
			nome,
			busca,
			mensagemDeError,
			carregando,
			clubesBuscados,
		} = this.state
		return (
			<View style={{color: '#000000'}}>
				<Text>
					Meus Clubes
				</Text>
				{
					mostrarCriar &&
						!mostrarBuscar &&
						<View>
							<Text>
								Criar Clube
							</Text>		
							<TextInput
								value={nome} 
								onChangeText={texto => this.setState({nome: texto})}/>
							<TouchableOpacity
								onPress={() => this.ajudadorDeSubmissao()}
							>
								<Text>
									Criar
								</Text>	
							</TouchableOpacity>
							<Text>
								{mensagemDeError}	
							</Text>
						</View>
				}
				{
					!mostrarCriar &&
						mostrarBuscar &&
						<View>
							{
								!carregando &&
									<View>
										<Text>
											Buscar Clube
										</Text>		
										<TextInput
											value={busca} 
											onChangeText={texto => this.setState({busca: texto})}/>
										<TouchableOpacity
											onPress={() => this.buscarClubes()}>
											<Text>
												Buscar
											</Text>	
										</TouchableOpacity>
									</View>
							}
							{
								carregando &&
									<Loading title={'Buscando clubes ...'} background={lightdark} />
							}
							{
								!carregando &&
									clubesBuscados &&
									clubesBuscados.map(clube => {
										return 
											<View>
												<Text>
													{clube.id}
												</Text>
												<Text>
													{clube.nome}
												</Text>
												<Text>
													{clube.no.nome}
												</Text>
												<TouchableOpacity
													onPress={() => this.ajudadorDeSubmissao()}
												>
													<Text>
														Criar
													</Text>	
												</TouchableOpacity>
											</View>
									})
							}
						</View>
				}
				{
					!carregando &&
						!mostrarBuscar &&
						!mostrarCriar &&
						<View>
							{
								clubes &&
									clubes.map(clube => 
										<TouchableOpacity
											key={clube._id}
											onPress={() => this.props.navigation.navigate('Clube', {clube})}>
											<Text>
												{clube.nome}
											</Text>
										</TouchableOpacity>
									)
							}

							<TouchableOpacity
								onPress={() => this.setState({mostrarCriar: true})}>
								<Text>
									Criar
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => this.setState({mostrarBuscar: true})}>
								<Text>
									Participar
								</Text>
							</TouchableOpacity>
						</View>
				}
			</View>
		)
	}
}

const mapStateToProps = ({usuario}) => {
	return {usuario}
}

export default connect(mapStateToProps, null)(ClubesScreen)
