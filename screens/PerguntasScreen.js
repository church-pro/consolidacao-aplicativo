import React from 'react';
import {
    View,
    Text,
    Alert,
	ActivityIndicator,
} from 'react-native';
import { Button, Card, Icon, Input, CheckBox } from 'react-native-elements'
import { white, red, gray, black, lightdark, dark, gold, blue } from '../helpers/colors'
import { connect } from 'react-redux'
import { SITUACAO_ACOMPANHAR, SITUACAO_FECHADO, SITUACAO_FECHAMENTO } from '../helpers/constants'
import { 
	alterarProspectoNoAsyncStorage,
	adicionarSituacoesAoAsyncStorage,
} from '../actions'
import CPButton from '../components/CPButton';
import { LinearGradient } from 'expo'
import {
	pegarDataEHoraAtual
} from '../helpers/helper'

class PerguntasScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Perguntas',
            headerTintColor: white,
        }
    }

	state = {
		carregando: false,
	}

	componentDidMount(){
		const {
			estados
		} = this.props
		this.setState(estados)
	}

    ajudadorDeSubmit() {
		this.setState({carregando: true})
		const { 
			prospecto, 
			alterarProspectoNoAsyncStorage, 
			adicionarSituacoesAoAsyncStorage,
			navigation,
		} = this.props
		const { 
			situacao_id_nova,
			situacao_id_extra,
			paraOndeNavegar,
			qualAba,
			alertTitulo,
			alertMensagem,
		} = this.state
        prospecto.situacao_id = situacao_id_nova
        alterarProspectoNoAsyncStorage(prospecto)
			.then(() => {
				let situacoes = []
				const situacao = {
					prospecto_id: prospecto.celular_id,
					situacao_id: situacao_id_nova,
					data_criacao: pegarDataEHoraAtual()[0],
					hora_criacao: pegarDataEHoraAtual()[1],
				}
				situacoes.push(situacao)
				if(situacao_id_extra){
					const situacaoExtra = {
						prospecto_id: prospecto.celular_id,
						situacao_id: situacao_id_extra,
						data_criacao: pegarDataEHoraAtual()[0],
						hora_criacao: pegarDataEHoraAtual()[1],
					}
					situacoes.push(situacaoExtra)
				}
				this.props.adicionarSituacoesAoAsyncStorage(situacoes)
					.then(() => {
						Alert.alert(alertTitulo, alertMensagem)
						this.setState({carregando: false})
						navigation.navigate(paraOndeNavegar, qualAba)
					})
			})
    }

    render() {
		const { 
			prospecto, 
			navigation,
			perguntas,
		} = this.props
		const estados = this.state
		const {
			carregando
		} = estados
        return (
            <LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
                <View style={{ flex: 1, padding: 20 }}>

					{
						carregando &&
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<ActivityIndicator
								size="large"
								color={blue}
							/>
						</View>
					}

					{
						perguntas &&
						estados &&
						!carregando &&
						perguntas.map(pergunta => {
							let resposta = <View key={pergunta.titulo}></View>
							if(estados[[pergunta.mostrar]]){
								resposta = 	
									<Card key={pergunta.titulo} containerStyle={{ backgroundColor: dark, borderColor: 'transparent', borderRadius: 6, margin: 0 }}>
										<Text style={{
											color: white, textAlign: 'center', fontWeight: 'bold',
											paddingBottom: 8
										}}>
										{pergunta.titulo}
										</Text>
										<View style={{ backgroundColor: lightdark, height: 100, alignItems: 'center' }}>
											{
												pergunta.opcoes.map(opcao => {
													return <CheckBox
														key={opcao.titulo}
														title={opcao.titulo}
														textStyle={{ color: white }}
														checked={estados[[opcao.estado]]}
														onPress={() => this.setState(opcao.onPress)}
														checkedIcon='dot-circle-o'
														checkedColor={gold}
														uncheckedIcon='circle-o'
														containerStyle={{
															backgroundColor: 'transparent',
															padding: 0, borderColor: 'transparent'
														}}
													/>
												})
											}
										</View>
									</Card>
							}
							return resposta
						})
					}
					{
						estados &&
						estados.mostrarBotaoConfirmar &&
						!carregando &&
						<CPButton
							title='Confirmar'
							OnPress={() => {this.ajudadorDeSubmit()}}
						/>
					}
                </View>
            </LinearGradient>
        )
    }

}

function mapStateToProps({ prospectos }, { navigation }) {
	const { params } = navigation.state
	const {
		prospecto_id,
		estados,
		perguntas,
	} = params
    return {
        prospecto: prospectos && prospectos.find(prospecto => prospecto._id === prospecto_id),
		estados,
		perguntas,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
        adicionarSituacoesAoAsyncStorage: (situacoes) => dispatch(adicionarSituacoesAoAsyncStorage(situacoes)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PerguntasScreen)
