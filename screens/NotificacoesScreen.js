import React from 'react';

import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { lightdark, white, dark, gray } from '../helpers/colors';
import { Icon } from 'react-native-elements';
import arrow from '../assets/images/arrow-back.png'
import { stylesImportar } from '../components/Styles';

class NotificacoesScreen extends React.Component {

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: dark, padding: 20 }} >
				<Text style={{ color: white, fontSize: 30, fontWeight: 'bold' }}>
					Notificações
				</Text>

                <View style={{ backgroundColor: lightdark, borderRadius: 8, marginVertical: 5 }}>

                    {/* REPETIÇÃO ENTRA AQUI */}
                    <View
                        style={{
                            borderTopWidth: 1,
                            borderTopColor: dark,
                            padding: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                            <Text style={{ color: white }}> Atualização </Text>
                        </View>
                    </View>
                    {/* FIM DA REPETIÇÃO */}

                </View>

            </View>
        )
    }
}

export default NotificacoesScreen
