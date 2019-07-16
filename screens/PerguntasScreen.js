import React from 'react';
import {
    View,
    Text,
    Alert,
} from 'react-native';
import { Button, Card, Icon, Input, CheckBox } from 'react-native-elements'
import { white, red, gray, black, lightdark, dark, gold, blue } from '../helpers/colors'
import { connect } from 'react-redux'
import { SITUACAO_ACOMPANHAR, SITUACAO_FECHADO, SITUACAO_FECHAMENTO } from '../helpers/constants'
import { alterarProspectoNoAsyncStorage } from '../actions'
import CPButton from '../components/CPButton';
import { LinearGradient } from 'expo'

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

    alterarProspecto() {
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
            <LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
                <View style={{ flex: 1, padding: 20 }}>
                    <Card containerStyle={{ backgroundColor: dark, borderColor: 'transparent', borderRadius: 6, margin: 0 }}>
                        <Text style={{
                            color: white, textAlign: 'center', fontWeight: 'bold',
                            paddingBottom: 8
                        }}>
                            Foi feito o pré-cadastro?</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: lightdark, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <CheckBox
                                title='Sim'
                                textStyle={{ color: white }}
                                checked={this.state.foiFeitoOPreCadastro}
                                onPress={() => this.setState({
                                    foiFeitoOPreCadastro: true,
                                    naoFoiFeitoOPreCadastro: false,
                                })}
                                checkedIcon='dot-circle-o'
                                checkedColor={gold}
                                uncheckedIcon='circle-o'
                                containerStyle={{
                                    backgroundColor: 'transparent',
                                    padding: 0, borderColor: 'transparent'
                                }}
                            />
                            <CheckBox
                                title='Não'
                                textStyle={{ color: white }}
                                checked={this.state.naoFoiFeitoOPreCadastro}
                                onPress={() => this.setState({
                                    foiFeitoOPreCadastro: false,
                                    naoFoiFeitoOPreCadastro: true,
                                    foiFechado: false
                                })}
                                checkedIcon='dot-circle-o'
                                checkedColor={gold}
                                uncheckedIcon='circle-o'
                                containerStyle={{
                                    backgroundColor: 'transparent',
                                    padding: 0, borderColor: 'transparent'
                                }}
                            />
                        </View>
                    </Card>
                    {
                        foiFeitoOPreCadastro &&
                        <Card containerStyle={{ backgroundColor: dark, borderColor: 'transparent', borderRadius: 6, margin: 0, marginTop: 10, }}>
                            <Text style={{
                                color: white, textAlign: 'center',
                                fontWeight: 'bold', paddingBottom: 8
                            }}>
                                O prospecto pagou?
							</Text>
                            <View style={{ flexDirection: 'row', backgroundColor: lightdark, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                <CheckBox
                                    title='Sim'
                                    textStyle={{ color: white }}
                                    checked={this.state.foiFechado}
                                    onPress={() => this.setState({
                                        foiFechado: true,
                                        naoFoiFechado: false,
                                    })}
                                    checkedIcon='dot-circle-o'
                                    checkedColor={gold}
                                    uncheckedIcon='circle-o'
                                    containerStyle={{
                                        backgroundColor: 'transparent',
                                        padding: 0, borderColor: 'transparent'
                                    }}
                                />
                                <CheckBox
                                    title='Não'
                                    textStyle={{ color: white }}
                                    checked={this.state.naoFoiFechado}
                                    onPress={() => this.setState({
                                        foiFechado: false,
                                        naoFoiFechado: true,
                                    })}
                                    checkedIcon='dot-circle-o'
                                    checkedColor={gold}
                                    uncheckedIcon='circle-o'
                                    containerStyle={{
                                        backgroundColor: 'transparent',
                                        padding: 0, borderColor: 'transparent'
                                    }}
                                />
                            </View>
                        </Card>

                    }
                    {
                        foiFeitoOPreCadastro && foiFechado &&
                        <CPButton
                            title='Prospecto pagou'
                            OnPress={() => { this.alterarProspecto() }}
                        />
                    }
                    {
                        foiFeitoOPreCadastro && !foiFechado && naoFoiFechado &&
                        <CPButton
                            title='Remarcar'
                            OnPress={() => { navigation.navigate('MarcarDataEHora', { prospecto_id: prospecto.id, situacao_id: SITUACAO_ACOMPANHAR, }) }}
                        />
                    }
                </View>
            </LinearGradient>
        )
    }

}

function mapStateToProps({ prospectos }, { navigation }) {
    const prospecto_id = navigation.state.params.prospecto_id
    return {
        prospecto: prospectos && prospectos.find(prospecto => prospecto._id === prospecto_id)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PerguntasScreen)
