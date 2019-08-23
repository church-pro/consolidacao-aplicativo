import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import { black, white, lightdark, dark, gray, primary, gold, silver, bronze, yellow, darkGray } from '../helpers/colors';
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements';
import CPButton from '../components/CPButton';

class ConquistasScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTintColor: white,
            header: null,
        }
    }

    render() {
        const { usuario, navigation, qualAba, tipo, nivel } = this.props

        let cor = {
            mensagens:
                tipo === 1 && nivel === 1 ? bronze : tipo === 1 && nivel === 2 ? silver : tipo === 1 && nivel === 3 ? gold : darkGray
            ,
            ligacoes:
                tipo === 2 && nivel === 1 ? bronze : tipo === 2 && nivel === 2 ? silver : tipo === 2 && nivel === 3 ? gold : darkGray
            ,
            visitas:
                tipo === 3 && nivel === 1 ? bronze : tipo === 3 && nivel === 2 ? silver : tipo === 3 && nivel === 3 ? gold : darkGray

        }

        return (
            <View style={{ flex: 1, backgroundColor: lightdark, padding: 20 }}>
                <View>
                    <Text style={{ color: white, fontSize: 28, fontWeight: "bold" }}> Parabéns! </Text>
                    <Text style={{ color: white, fontSize: 16, color: gray }}> Você tem uma nova conquista </Text>
                </View>
                {
                    tipo === 1 &&
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <View style={{
                            backgroundColor: cor.mensagens, height: 240, width: 240, borderRadius: 240 / 2, alignItems: "center", justifyContent: "center",
                            borderWidth: 2, borderColor: '#fff'
                        }}
                        >
                            <Icon type="font-awesome" name="envelope" size={120} color={white} />
                            <View style={{ flexDirection: "row" }}>
                                <Icon name="star" type="font-awesome" color={tipo === 1 && nivel >= 1 ? yellow : gray} />
                                <Icon name="star" type="font-awesome" color={tipo === 1 && nivel >= 2 ? yellow : gray} containerStyle={{ marginHorizontal: 5 }} />
                                <Icon name="star" type="font-awesome" color={tipo === 1 && nivel === 3 ? yellow : gray} />
                            </View>
                        </View>
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: white, fontSize: 18, fontWeight: "bold" }}>
                                Mensagem -
                            {
                                    cor.mensagens === bronze ? ' Bronze' : '' ||
                                        cor.mensagens === silver ? ' Prata' : '' ||
                                            cor.mensagens === gold ? ' Ouro' : ''
                                }
                            </Text>
                            <Text style={{ color: gray, fontSize: 16 }} > Enviou
                                {
                                    cor.mensagens === bronze ? ' 5 ' : '' ||
                                        cor.mensagens === silver ? ' 35 ' : '' ||
                                            cor.mensagens === gold ? ' 100 ' : ''
                                }
                                Mensagens
                            </Text>
                        </View>

                    </View>
                }
                {
                    tipo === 2 &&
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <View style={{
                            backgroundColor: cor.ligacoes, height: 240, width: 240, borderRadius: 240 / 2, alignItems: "center", justifyContent: "center",
                            borderWidth: 2, borderColor: '#fff'
                        }}>
                            <Icon type="font-awesome" name="phone" size={120} color={white} />
                            <View style={{ flexDirection: "row" }}>
                                <Icon name="star" type="font-awesome" color={tipo === 2 && nivel >= 1 ? yellow : gray} />
                                <Icon name="star" type="font-awesome" color={tipo === 2 && nivel >= 2 ? yellow : gray} containerStyle={{ marginHorizontal: 5 }} />
                                <Icon name="star" type="font-awesome" color={tipo === 2 && nivel === 3 ? yellow : gray} />
                            </View>
                        </View>
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: white, fontSize: 18, fontWeight: "bold" }}>
                                Ligação -
                            {
                                    cor.ligacoes === bronze ? ' Bronze' : '' ||
                                        cor.ligacoes === silver ? ' Prata' : '' ||
                                            cor.ligacoes === gold ? ' Ouro' : ''
                                }
                            </Text>
                            <Text style={{ color: gray, fontSize: 16 }} >
                                Realizou
                            {
                                    tipo === 2 && nivel === 1 ? ' 5 ' : '' ||
                                        tipo === 2 && nivel === 2 ? ' 35 ' : '' ||
                                            tipo === 2 && nivel === 3 ? ' 100 ' : ''
                                }
                                ligações
                            </Text>
                        </View>
                    </View>
                }
                {
                    tipo === 3 &&
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <View style={{
                            backgroundColor: cor.visitas, height: 240, width: 240, borderRadius: 240 / 2, alignItems: "center", justifyContent: "center",
                            borderWidth: 2, borderColor: '#fff'
                        }}>
                            <Icon type="font-awesome" name="user" size={120} color={white} />
                            <View style={{ flexDirection: "row" }}>
                                <Icon name="star" type="font-awesome" color={tipo === 3 && nivel >= 1 ? yellow : gray} />
                                <Icon name="star" type="font-awesome" color={tipo === 3 && nivel >= 2 ? yellow : gray} containerStyle={{ marginHorizontal: 5 }} />
                                <Icon name="star" type="font-awesome" color={tipo === 3 && nivel === 3 ? yellow : gray} />
                            </View>
                        </View>
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: white, fontSize: 18, fontWeight: "bold" }}>
                                Visita -
                                 {
                                    cor.visitas === bronze ? ' Bronze' : '' ||
                                        cor.visitas === silver ? ' Prata' : '' ||
                                            cor.visitas === gold ? ' Ouro' : ''
                                }
                            </Text>
                            <Text style={{ color: gray, fontSize: 16 }} > Realizou
                            {
                                    tipo === 3 && nivel === 1 ? ' 5 ' : '' ||
                                        tipo === 3 && nivel === 2 ? ' 35 ' : '' ||
                                            tipo === 3 && nivel === 3 ? ' 100 ' : ''
                                }
                                visitas </Text>
                        </View>
                    </View>
                }


                <CPButton
                    title="Obrigado"
                    OnPress={() => { navigation.navigate('Prospectos', { qualAba }) }}
                />

            </View>
        )
    }
}

const mapStateToProps = (state, { navigation }) => {

    let usuario = state.usuario
    return {
        qualAba: navigation.state.params.qualAba,
        tipo: navigation.state.params.conquista.tipo,
        nivel: navigation.state.params.conquista.nivel,
        usuario
    }
}

export default connect(mapStateToProps, null)(ConquistasScreen)
