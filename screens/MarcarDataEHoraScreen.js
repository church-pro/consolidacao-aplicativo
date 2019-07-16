import React from 'react';
import {
    View,
    Text,
    Alert,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Card, Icon, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { white, dark, gold, lightdark, black, blue, gray } from '../helpers/colors'
import { connect } from 'react-redux'
import DatePicker from 'react-native-datepicker'
import { alterarProspectoNoAsyncStorage } from '../actions'
import { SITUACAO_APRESENTAR, SITUACAO_ACOMPANHAR, SITUACAO_FECHAMENTO } from '../helpers/constants'
import { LinearGradient } from 'expo'

class MarcarDataEHoraScreen extends React.Component {

    alterarProspecto = () => {
        this.setState({ carregando: true })
        const { prospecto, alterarProspectoNoAsyncStorage, navigation, situacao_id } = this.props
        if (this.state.dataParaOAgendamento === null ||
            this.state.horaParaOAgendamento === null) {
            Alert.alert('Erro', 'Selecione a data e hora')
        } else {
            prospecto.data = this.state.dataParaOAgendamento
            prospecto.hora = this.state.horaParaOAgendamento
            if (this.state.local) {
                prospecto.local = this.state.local
            }
            prospecto.situacao_id = situacao_id
            alterarProspectoNoAsyncStorage(prospecto)
                .then(() => {
                    let textoMarcouUmaApresentacao = ''
                    let tab = ''
                    switch (situacao_id) {
                        case SITUACAO_APRESENTAR:
                            textoMarcouUmaApresentacao = 'Você marcou uma apresentação, agora seu prospecto está na etapa "Apresentar"'
                            tab = 'Convidar'
                            break;
                        case SITUACAO_ACOMPANHAR:
                            textoMarcouUmaApresentacao = 'Você remarcou, agora seu prospecto está na etapa "Acompanhar"'
                            tab = 'Apresentar'
                            break;
                        case SITUACAO_FECHAMENTO:
                            textoMarcouUmaApresentacao = 'Você remarcou, agora seu prospecto está na etapa "Fechamento"'
                            tab = 'Acompanhar'
                            break;
                    }
                    Alert.alert('Sucesso', textoMarcouUmaApresentacao)
                    this.setState({ carregando: false })
                    navigation.navigate('Prospectos', { tab })
                })
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            alterarProspecto: this.alterarProspecto
        })
    }

    state = {
        carregando: false,
        selecionarDataMostrando: false,
        selecionarHoraMostrando: false,
        dataParaOAgendamento: null,
        horaParaOAgendamento: null,
        local: '',
        date: new Date(),
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        return {
            title: 'Marcar Data e Hora',
            headerStyle: {
                backgroundColor: black,
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                flex: 1,
                textAlign: 'center',
                alignSelf: 'center',
                color: white,
            },
            headerTintColor: white,
            headerLeftContainerStyle: {
                padding: 10,
            },
        }
    }


    render() {
        const { prospecto } = this.props
        const { carregando } = this.state

        return (
            <LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.container}
                    keyboardShoulfPersistTaps='always'
                    enableOnAndroid enableAutomaticScroll={true} extraScrollHeight={80} >

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
                        !carregando &&
                        <View>
                            {/* <Card containerStyle={{ backgroundColor: dark, borderColor: gold, borderRadius: 6 }}> */}

                            <View style={{ paddingHorizontal: 10, borderWidth: 1, borderColor: gray, borderRadius: 6 }}>
                                <Text style={{ fontSize: 16, color: white, fontWeight: "bold", marginTop: 6 }}>DATA</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <DatePicker
                                        style={{ flex: 1, }}
                                        date={this.state.dataParaOAgendamento}
                                        mode="date"
                                        placeholder=" "
                                        format="DD/MM/YYYY"
                                        minDate={this.state.date}
                                        showIcon={false}
                                        confirmBtnText="Confirmar"
                                        cancelBtnText="Cancelar"
                                        customStyles={{
                                            dateInput: {
                                                borderWidth: 0,
                                                alignItems: "flex-start",

                                            },
                                            dateText: {
                                                color: white,
                                                fontSize: 18,
                                                marginLeft: 4,
                                            }
                                        }}
                                        onDateChange={(date) => {
                                            this.setState({ dataParaOAgendamento: date })
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 10, borderWidth: 1, borderColor: gray, borderRadius: 6, marginVertical: 10 }}>
                                <Text style={{ fontSize: 16, color: white, fontWeight: "bold", marginTop: 6 }}>HORA</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <DatePicker
                                        style={{ flex: 1 }}
                                        date={this.state.horaParaOAgendamento}
                                        mode="time"
                                        placeholder=" "
                                        is24Hour={true}
                                        showIcon={false}
                                        confirmBtnText="Confirmar"
                                        cancelBtnText="Cancelar"
                                        customStyles={{
                                            dateInput: {
                                                borderWidth: 0,
                                                alignItems: 'flex-start',
                                            },
                                            dateText: {
                                                color: white,
                                                fontSize: 18,
                                                marginLeft: 35,
                                            }
                                        }}
                                        onDateChange={(date) => {
                                            this.setState({ horaParaOAgendamento: date })
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={{ paddingHorizontal: 10, borderWidth: 1, borderColor: gray, borderRadius: 6 }}>
                                <Text style={{ fontSize: 16, color: white, fontWeight: "bold", marginTop: 6 }}>LOCAL</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <TextInput
                                        keyboardAppearance='dark'
                                        placeholder=""
                                        style={{ color: white, fontSize: 18, marginLeft: 6, minHeight: 40, flex: 1 }}
                                        value={this.local}
                                        onChangeText={(text) => this.setState({ local: text })}
                                    />
                                </View>
                            </View>
                            {/* </Card> */}

                            <View style={styles.containerButton}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.alterarProspecto()}
                                >
                                    <Text style={{ textAlign: "center", fontSize: 16, color: white }}>Marcar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </KeyboardAwareScrollView>
            </LinearGradient>
        )
    }

}

function mapStateToProps({ prospectos }, { navigation }) {
    const prospecto_id = navigation.state.params.prospecto_id
    return {
        prospecto: prospectos && prospectos.find(prospecto => prospecto._id === prospecto_id),
        situacao_id: navigation.state.params.situacao_id
    }
}

function mapDispatchToProps(dispatch) {
    return {
        alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarcarDataEHoraScreen)

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    containerButton: {
        paddingVertical: 10,
        marginTop: 10,
    },
    button: {
        backgroundColor: blue,
        height: 45,
        borderRadius: 6,
        justifyContent: 'center',
        shadowOffset: { width: 5, height: 5, },
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOpacity: 1.0,
    },
})
