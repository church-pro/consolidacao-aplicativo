import React from 'react';
import {
	View,
	Text,
	Alert,
} from 'react-native';
import { Button, Card, Icon, Input, CheckBox } from 'react-native-elements'
import { white, red, gray, green, lightdark, dark, gold } from '../helpers/colors'
import { connect } from 'react-redux'
import { SITUACAO_ACOMPANHAR, SITUACAO_FECHADO, SITUACAO_FECHAMENTO } from '../helpers/constants'
import { alterarProspectoNoAsyncStorage } from '../actions'

class PerguntasScreen extends React.Component {

	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Resultado',
			headerTintColor: white,
		}
	}

	state = {
		foiFeitoOPreCadastro: false,
		naoFoiFeitoOPreCadastro: false,
		foiFechado: false,
		naoFoiFechado: false,
	}

	alterarProspecto(){
		const { prospecto, alterarProspectoNoAsyncStorage, navigation } = this.props
		prospecto.situacao_id = SITUACAO_FECHAMENTO
		alterarProspectoNoAsyncStorage(prospecto)
			.then(() => {
				Alert.alert('Sucesso', 'Prospecto pagou!')
				navigation.goBack()
			})
	}

	render() {
		const { prospecto, navigation } = this.props
		const { foiFeitoOPreCadastro, naoFoiFeitoOPreCadastro, foiFechado, naoFoiFechado } = this.state

		return (
			<View style={{flex: 1, backgroundColor: lightdark}}>
				<Card containerStyle={{backgroundColor: dark, borderColor: gold, borderRadius: 6}}>
					<Text style={{color: white, textAlign: 'center', fontWeight: 'bold',
					paddingBottom: 8
				}}>
					Foi feito o pré-cadastro?</Text>
					<View style={{flexDirection: 'row', backgroundColor: lightdark, height: 50, justifyContent: 'center', alignItems: 'center'}}>
						<CheckBox
							title='Sim'
							textStyle={{color: white}}
							checked={this.state.foiFeitoOPreCadastro}
							onPress={() => this.setState({
								foiFeitoOPreCadastro: true,
								naoFoiFeitoOPreCadastro: false,
							})}
							checkedIcon='dot-circle-o'
							checkedColor={gold}
							uncheckedIcon='circle-o'
							containerStyle={{backgroundColor: 'transparent', 
							padding: 0, borderColor: 'transparent'}}
						/>
						<CheckBox
							title='Não'
							textStyle={{color: white}}
							checked={this.state.naoFoiFeitoOPreCadastro}
							onPress={() => this.setState({
								foiFeitoOPreCadastro: false,
								naoFoiFeitoOPreCadastro: true,
								foiFechado: false
							})}
							checkedIcon='dot-circle-o'
							checkedColor={gold}
							uncheckedIcon='circle-o'
							containerStyle={{backgroundColor: 'transparent', 
							padding: 0, borderColor: 'transparent'}}
						/>
					</View>
				</Card>
				{
					foiFeitoOPreCadastro &&
						<Card containerStyle={{backgroundColor: dark, borderColor: gold}}>
							<Text style={{color: white, textAlign: 'center', 
							fontWeight: 'bold', paddingBottom: 8}}>
								O prospecto pagou?
							</Text>
							<View style={{flexDirection: 'row', backgroundColor: lightdark, height: 50, justifyContent: 'center', alignItems: 'center'}}>
								<CheckBox
									title='Sim'
									textStyle={{color: white}}
									checked={this.state.foiFechado}
									onPress={() => this.setState({
										foiFechado: true,
										naoFoiFechado: false,
									})}
									checkedIcon='dot-circle-o'
									checkedColor={gold}
									uncheckedIcon='circle-o'
									containerStyle={{backgroundColor: 'transparent', 
									padding: 0, borderColor: 'transparent'}}
								/>
								<CheckBox
									title='Não'
									textStyle={{color: white}}
									checked={this.state.naoFoiFechado}
									onPress={() => this.setState({
										foiFechado: false,
										naoFoiFechado: true,
									})}
									checkedIcon='dot-circle-o'
									checkedColor={gold}
									uncheckedIcon='circle-o'
									containerStyle={{backgroundColor: 'transparent', 
									padding: 0, borderColor: 'transparent'}}
								/>
							</View>
						</Card>

				}
				{
					foiFeitoOPreCadastro && foiFechado &&
						<Button 
							title='Prospecto pagou'
							buttonStyle={{backgroundColor: gold, height: 50, margin: 15}}
							titleStyle={{color: dark}}
							onPress={() => { this.alterarProspecto() }} 
						/>
				}
				{
					foiFeitoOPreCadastro && !foiFechado && naoFoiFechado &&
						<Button 
							title='Remarcar'
							buttonStyle={{backgroundColor: gold, height: 50, margin: 15}}
							titleStyle={{color: dark}}
							
							onPress={() => { navigation.navigate('MarcarDataEHora', {prospecto_id: prospecto.id, situacao_id: SITUACAO_ACOMPANHAR,}) }} 
						/>
				}
			</View>
		)
	}

}

function mapStateToProps({prospectos}, {navigation}){
	const prospecto_id = navigation.state.params.prospecto_id
	return {
		prospecto: prospectos && prospectos.find(prospecto => prospecto.id === prospecto_id)
	}
}

function mapDispatchToProps(dispatch){
	return {
		alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PerguntasScreen)
