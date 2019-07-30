import React from 'react';
import {
    View,
    Text,
    Alert,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { white, dark, lightdark, black, primary, gray } from '../helpers/colors'
import { connect } from 'react-redux'
import DatePicker from 'react-native-datepicker'
import {
    alterarProspectoNoAsyncStorage,
    adicionarSituacoesAoAsyncStorage,
} from '../actions'
import {
    submeterSituacoes,
} from '../helpers/api'
import { LinearGradient } from 'expo'
import Loading from '../components/Loading';
import { stylesMarcar } from '../components/Styles'
import CPButton from '../components/CPButton';
import { DATA, HORA, LOCAL, CONFIRMAR, MARCAR_DATA_E_HORA, CANCELAR } from '../helpers/constants';

class MarcarDataEHoraScreen extends React.Component {

    ajudadorDeSubmit = () => {
        this.setState({ carregando: true })
        const {
            prospecto,
            alterarProspectoNoAsyncStorage,
            navigation,
            situacao_id_nova,
            situacoes,
            paraOndeVoltar,
            qualAba,
            alertTitulo,
            alertMensagem,
        } = this.props
        if (this.state.dataParaOAgendamento === null ||
            this.state.horaParaOAgendamento === null) {
            this.setState({ carregando: false })
            Alert.alert('Erro', 'Selecione a data e hora')
        } else {
            prospecto.data = this.state.dataParaOAgendamento
            prospecto.hora = this.state.horaParaOAgendamento
            if (this.state.local) {
                prospecto.local = this.state.local
            }
            prospecto.situacao_id = situacao_id_nova
            submeterSituacoes(situacoes)
                .then(() => {
                    alterarProspectoNoAsyncStorage(prospecto)
                        .then(() => {
                            Alert.alert(alertTitulo, alertMensagem)
                            this.setState({ carregando: false })
                            navigation.navigate(paraOndeVoltar, { qualAba })
                        })
                })
        }
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
        return {
            title: MARCAR_DATA_E_HORA,
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
                    contentContainerStyle={stylesMarcar.container}
                    keyboardShoulfPersistTaps='always'
                    enableOnAndroid enableAutomaticScroll={true} extraScrollHeight={80} >

                    {
                        carregando &&
                        <Loading />
                    }

                    {
                        !carregando &&
                        <View>
                            <View style={stylesMarcar.containerInput}>
                                <Text style={stylesMarcar.labelMarcar}>{DATA}</Text>
                                <View style={stylesMarcar.inputContainerStyle}>
                                    <DatePicker
                                        style={{ flex: 1, }}
                                        date={this.state.dataParaOAgendamento}
                                        mode="date"
                                        placeholder=" "
                                        format="DD/MM/YYYY"
                                        minDate={this.state.date}
                                        showIcon={false}
                                        confirmBtnText={CONFIRMAR}
                                        cancelBtnText={CANCELAR}
                                        customStyles={{
                                            dateInput: stylesMarcar.dateInput,
                                            dateText: stylesMarcar.dateText
                                        }}
                                        onDateChange={(date) => {
                                            this.setState({ dataParaOAgendamento: date })
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[stylesMarcar.containerInput, { marginVertical: 10 }]}>
                                <Text style={stylesMarcar.labelMarcar}>{HORA}</Text>
                                <View style={stylesMarcar.inputContainerStyle}>
                                    <DatePicker
                                        style={{ flex: 1 }}
                                        date={this.state.horaParaOAgendamento}
                                        mode="time"
                                        placeholder=" "
                                        is24Hour={true}
                                        showIcon={false}
                                        confirmBtnText={CONFIRMAR}
                                        cancelBtnText={CANCELAR}
                                        customStyles={{
                                            dateInput: stylesMarcar.dateInput,
                                            dateText: stylesMarcar.dateText
                                        }}
                                        onDateChange={(date) => {
                                            this.setState({ horaParaOAgendamento: date })
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={stylesMarcar.containerInput}>
                                <Text style={stylesMarcar.labelMarcar}>{LOCAL}</Text>
                                <View style={stylesMarcar.inputContainerStyle}>
                                    <TextInput
                                        keyboardAppearance='dark'
                                        placeholder=""
                                        style={stylesMarcar.inputMarcar}
                                        value={this.local}
                                        onChangeText={(text) => this.setState({ local: text })}
                                    />
                                </View>
                            </View>

                            <CPButton OnPress={() => this.ajudadorDeSubmit()} title={CONFIRMAR} />

                        </View>
                    }
                </KeyboardAwareScrollView>
            </LinearGradient>
        )
    }

}

function mapStateToProps({ prospectos }, { navigation }) {
    const {
        prospecto_id,
        situacao_id_nova,
        situacoes,
        paraOndeVoltar,
        qualAba,
        alertTitulo,
        alertMensagem
    } = navigation.state.params
    return {
        prospecto: prospectos && prospectos.find(prospecto => prospecto._id === prospecto_id),
        situacao_id_nova,
        situacoes,
        paraOndeVoltar,
        qualAba,
        alertTitulo,
        alertMensagem,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        alterarProspectoNoAsyncStorage: (prospecto) => dispatch(alterarProspectoNoAsyncStorage(prospecto)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarcarDataEHoraScreen)
