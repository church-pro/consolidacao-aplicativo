import React from 'react';
import {
    View,
    Text,
    Alert,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
	Header,
} from 'react-native';
import { Card, Icon, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { white, dark, gold, lightdark, black, primary, gray } from '../helpers/colors'
import { connect } from 'react-redux'
import DatePicker from 'react-native-datepicker'
import {
    alterarProspectoNoAsyncStorage,
    adicionarSituacoesAoAsyncStorage,
} from '../actions'
import {
	submeterSituacoes,
} from '../helpers/api'
import { SITUACAO_APRESENTAR, SITUACAO_ACOMPANHAR, SITUACAO_FECHAMENTO } from '../helpers/constants'
import { LinearGradient } from 'expo'

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
                                color={primary}
                            />
                        </View>
                    }

                    {
                        !carregando &&
                        <View>
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
                                                marginLeft: 4,
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

                            <View style={styles.containerButton}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.ajudadorDeSubmit()}
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
        backgroundColor: primary,
        height: 45,
        borderRadius: 6,
        justifyContent: 'center',
        shadowOffset: { width: 5, height: 5, },
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOpacity: 1.0,
    },
})
