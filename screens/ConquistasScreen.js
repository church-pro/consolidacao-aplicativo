import React from 'react';
import { FlatList, ScrollView, Image } from 'react-native'
import Loading from '../components/Loading';
import { black, white, lightdark, dark, gray, primary, gold } from '../helpers/colors';
import {
    View,
    Text,
} from 'react-native';
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'
import { Icon } from 'react-native-elements';
import mensagem from '../assets/images/conquista-mensagem-bronze.png'


class ConquistasScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTintColor: white,
            header: null,
        }
    }

    render() {

        const { usuario } = this.props

        return (
            <View style={{ flex: 1, backgroundColor: lightdark, padding: 20 }}>
                <View>
                    <Text style={{ color: white, fontSize: 28, fontWeight: "bold" }} >Parabéns! </Text>
                    <Text style={{ color: white, fontSize: 16, color: gray }}>você tem uma nova conquista </Text>
                </View>
                {
                    !usuario.mensagens &&
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <View style={{ backgroundColor: '#8D533E', height: 240, width: 240, borderRadius: 240 / 2, alignItems: "center", justifyContent: "center" }}>
                            <Icon type="font-awesome" name="envelope" size={120} color={white} />
                            <View style={{ flexDirection: "row" }}>
                                <Icon name="star" type="font-awesome" color={gold} />
                                <Icon name="star" type="font-awesome" color={gray} containerStyle={{ marginHorizontal: 5 }} />
                                <Icon name="star" type="font-awesome" color={gray} />
                            </View>
                        </View>
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: white, fontSize: 18, fontWeight: "bold" }}> Mensagem - Bronze </Text>
                            <Text style={{ color: gray, fontSize: 16 }} > Enviou 5 mensagens </Text>
                        </View>

                    </View>
                }
                {
                    usuario.ligacoes &&
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <View style={{ backgroundColor: '#B2B3B5', height: 240, width: 240, borderRadius: 240 / 2, alignItems: "center", justifyContent: "center" }}>
                            <Icon type="font-awesome" name="phone" size={120} color={white} />
                            <View style={{ flexDirection: "row" }}>
                                <Icon name="star" type="font-awesome" color={gold} />
                                <Icon name="star" type="font-awesome" color={gold} containerStyle={{ marginHorizontal: 5 }} />
                                <Icon name="star" type="font-awesome" color={gray} />
                            </View>
                        </View>
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: white, fontSize: 18, fontWeight: "bold" }}> Ligação - Prata </Text>
                            <Text style={{ color: gray, fontSize: 16 }} > Realizou 10 ligações </Text>
                        </View>
                    </View>
                }
                {
                    usuario.visitas &&
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <View style={{ backgroundColor: '#B37F14', height: 240, width: 240, borderRadius: 240 / 2, alignItems: "center", justifyContent: "center" }}>
                            <Icon type="font-awesome" name="user" size={120} color={white} />
                            <View style={{ flexDirection: "row" }}>
                                <Icon name="star" type="font-awesome" color={black} />
                                <Icon name="star" type="font-awesome" color={black} containerStyle={{ marginHorizontal: 5 }} />
                                <Icon name="star" type="font-awesome" color={black} />
                            </View>
                        </View>
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: white, fontSize: 18, fontWeight: "bold" }}> Visita - Ouro </Text>
                            <Text style={{ color: gray, fontSize: 16 }} > Realizou 20 visitas </Text>
                        </View>
                    </View>
                }

            </View>
        )
    }
}

const mapStateToProps = ({ usuario }) => {

    return {
        usuario,
    }
}

export default connect(mapStateToProps, null)(ConquistasScreen)