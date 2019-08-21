import React from 'react';
import {
    Alert,
    TouchableOpacity,
    Text,
    View,
    FlatList,
    TextInput,
    Platform,
    Image
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Header, Title, Left, Body, Right } from 'native-base'
import { connect } from 'react-redux'
import { Permissions, Contacts } from 'expo'
import { white, lightdark, dark, black, primary, gray } from '../helpers/colors'
import { LinearGradient } from 'expo'
import {
    adicionarProspectosAoAsyncStorage,
    alterarUsuarioNoAsyncStorage,
} from '../actions'
import {
    submeterSituacoes
} from '../helpers/api'
import { SITUACAO_IMPORTAR, IMPORTAR_CONTATOS, CONFIRMAR } from '../helpers/constants'
import { stylesImportar } from '../components/Styles';
import {
    pegarDataEHoraAtual
} from '../helpers/helper'
import Loading from '../components/Loading'
import arrow from '../assets/images/arrow-back.png'

class MyListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render() {
        const textColor = this.props.selected ? primary : white;
        return (
            <TouchableOpacity style={stylesImportar.containerContato} onPress={this._onPress}>
                <View style={stylesImportar.containerContent}>
                    <View>
                        <Text style={{ color: white }}>{this.props.title}</Text>
                        <Text style={{ color: gray }}>{this.props.subTitle}</Text>
                    </View>
                    <View style={stylesImportar.containerIcon}>
                        <Icon name="check" color={textColor} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

class MultiSelectList extends React.PureComponent {
    state = { selected: (new Map(): Map<string, boolean>) };

    componentDidMount() {
        this.setState({ selected: this.props.selected })
    }

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id: string) => {
        this.props._onPressItem(id)
        // updater functions are preferred for transactional updates
        this.setState((state) => {
            // copy the map rather than modifying state.
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id)); // toggle
            return { selected };
        });
    };

    _renderItem = ({ item }) => (
        <MyListItem
            id={item.id}
            onPressItem={this._onPressItem}
            selected={!!this.state.selected.get(item.id)}
            title={item.title}
            subTitle={item.subTitle}
        />
    );

    render() {
        return (
            <FlatList
                data={this.props.data}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                removeClippedSubviews={false}
            />
        );
    }
}

class ImportarProspectosScreen extends React.Component {
    static navigationOptions = {
        header: null,
    }

    state = {
        carregando: true,
        contatosParaSelecionar: null,
        busca: '',
        selected: (new Map(): Map<string, boolean>)
    }

    _onPressItem = (id: string) => {
        // updater functions are preferred for transactional updates
        this.setState((state) => {
            // copy the map rather than modifying state.
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id)); // toggle
            return { selected };
        });
    };

    componentDidMount() {
        let contatosParaSelecionar = []
        try {
            Permissions.askAsync(Permissions.CONTACTS)
                .then(({ status }) => {

                    if (status === 'granted') {
                        Contacts.getContactsAsync()
                            .then(data => {
                                data.data.sort((a, b) => (a.name > b.name) ? 1 : -1)
                                data.data.map(contato => {
                                    if (contato.phoneNumbers && contato.phoneNumbers.length) {
                                        let contatoNovo = {}
                                        delete contatoNovo.selecionado
                                        contatoNovo.situacao_id = SITUACAO_IMPORTAR
                                        contatoNovo.id = Date.now() + contato.id
                                        contatoNovo.nome = contato.name
                                        contatoNovo.rating = null
                                        contatoNovo.email = null
                                        contatoNovo.online = false
                                        contatoNovo.cadastroNaApi = false
                                        contatoNovo.celular_id = contatoNovo.id
                                        contatoNovo.dataParaFinalizarAAcao = pegarDataEHoraAtual(1)[0]
                                        let contador = 1
                                        contato.phoneNumbers.map(item => {
                                            if (contador === 1) {
                                                let ddd = 61
                                                let telefoneTexto = item.number.toString()
                                                telefoneTexto = telefoneTexto.replace('-', '')
                                                telefoneTexto = telefoneTexto.replace('-', '')
                                                telefoneTexto = telefoneTexto.replace(' ', '')
                                                telefoneTexto = telefoneTexto.replace('+', '')
                                                telefoneTexto = telefoneTexto.replace('(', '')
                                                telefoneTexto = telefoneTexto.replace(')', '')
                                                let telefone = telefoneTexto
                                                const tamanhoDoNumero = telefoneTexto.length
                                                if (tamanhoDoNumero > 9) {
                                                    telefone = telefoneTexto.substr(tamanhoDoNumero - 9)
                                                    if (parseInt(telefone.substr(0, 1)) !== 9) {
                                                        telefone = telefoneTexto.substr(tamanhoDoNumero - 8)
                                                    }
                                                }
                                                if (tamanhoDoNumero >= 11) {
                                                    let valorParaReduzir = 11
                                                    if (parseInt(telefoneTexto.substr(0, 1)) === 0) {
                                                        valorParaReduzir = 10
                                                    }
                                                    ddd = telefoneTexto.substr(tamanhoDoNumero - valorParaReduzir, 2)
                                                    if (parseInt(ddd).toString().length !== 2) {
                                                        ddd = '61'
                                                    }
                                                }
                                                contatoNovo.ddd = ddd
                                                contatoNovo.telefone = telefone
                                                contatoNovo.title = `${contatoNovo.nome}`
                                                contatoNovo.subTitle = `(${contatoNovo.ddd}) ${contatoNovo.telefone}`
                                                contatosParaSelecionar.push(contatoNovo)
                                                contador++
                                            }
                                        })
                                    }
                                })
                                if (contatosParaSelecionar.length) {
                                    this.setState({
                                        contatosParaSelecionar,
                                        carregando: false
                                    })
                                }
                            }).catch(error => console.log(error))
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }


    selecionarContato(indice) {
        let {
            contatosParaSelecionar,
        } = this.state
        let contatoDoIndice = contatosParaSelecionar[indice]
        contatoDoIndice.selecionado = !contatoDoIndice.selecionado
        contatosParaSelecionar[indice] = contatoDoIndice
        this.setState({ contatosParaSelecionar })
    }

    adicionarContatos() {
        const {
            contatosParaSelecionar,
            selected,
            carregando,
        } = this.state
        const {
            adicionarProspectosAoAsyncStorage,
            navigation,
            usuario,
            alterarUsuarioNoAsyncStorage,
        } = this.props
        this.setState({ carregando: true })
        const contatosFiltrados =
            contatosParaSelecionar
                .filter(contato => selected.get(contato.id))
                .map(contato => {
                    contato._id = contato.id
                    return contato
                })
        adicionarProspectosAoAsyncStorage(contatosFiltrados)
            .then(() => {
                let situacoes = []
                contatosFiltrados
                    .forEach(contato => {
                        const situacao = {
                            prospecto_id: contato.celular_id,
                            situacao_id: SITUACAO_IMPORTAR,
                            data_criacao: pegarDataEHoraAtual()[0],
                            hora_criacao: pegarDataEHoraAtual()[1],
                        }
                        situacoes.push(situacao)
                    })
                submeterSituacoes(situacoes)
                    .then(() => {

                        if (usuario.importacoes) {
                            usuario.importacoes += contatosFiltrados.length
                        } else {
                            usuario.importacoes = contatosFiltrados.length
                        }

                        alterarUsuarioNoAsyncStorage(usuario)
                            .then(() => {
                                this.setState({ carregando: false })
                                Alert.alert('Importação', 'Importação concluida com sucesso!')
                                navigation.navigate('Prospectos', { qualAba: 'Importar' })
                            })
                    })
            })
    }

    render() {
        const { carregando } = this.state
        let {
            contatosParaSelecionar,
            selected,
            busca
        } = this.state

        if (busca != '') {

            contatosParaSelecionar = contatosParaSelecionar.filter(item => {
                const itemData = item.nome
                const textData = busca

                return itemData.indexOf(textData) > -1
            })
        }

        return (
            <LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>
                <Header style={stylesImportar.header} iosBarStyle="light-content">
                    <Left style={{ flex: Platform.OS === "ios" ? 0 : 0 }} >
                        <TouchableOpacity
                            hitSlop={{ right: 10 }}
                            style={stylesImportar.containerIcon}
                            onPress={() => this.props.navigation.goBack()}>
                            {
                                Platform.OS === "ios" ?
                                    <Icon type="font-awesome" name={"angle-left"}
                                        color={white} size={36} />
                                    :
                                    <Image source={arrow} style={{ height: 16, width: 16, marginHorizontal: 5 }} />
                            }
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 1, marginLeft: Platform.OS === "ios" ? 0 : 15 }}>
                        <Title style={[stylesImportar.headerTitle, { textAlign: 'center' }]}>{IMPORTAR_CONTATOS}</Title>
                    </Body>
                    <Right
                        style={{ flex: 0 }} >
                        <TouchableOpacity
                            style={stylesImportar.containerIcon}
                            onPress={() => this.props.navigation.navigate('Prospecto')}>
                            <Icon name='user-plus' type='font-awesome' color={white} />
                        </TouchableOpacity>
                    </Right>
                </Header>

                {
                    carregando &&
                    <Loading title='Carregando Contatos' />
                }

                {
                    !carregando && contatosParaSelecionar &&
                    <View style={{ height: 40, borderWidth: 1, borderColor: gray, borderRadius: 6, marginHorizontal: 10 }}>
                        <TextInput
                            placeholder="Buscar"
                            placeholderTextColor={gray}
                            style={{ flex: 1, paddingHorizontal: 5, color: white }}
                            onChangeText={texto => this.setState({ busca: texto })}
                            value={busca}
                            autoCorrect={false}
                        />
                    </View>
                }
                {
                    !carregando && contatosParaSelecionar &&

                    <MultiSelectList
                        data={contatosParaSelecionar}
                        selected={selected}
                        _onPressItem={this._onPressItem}
                    >
                    </MultiSelectList>
                }

                {
                    !carregando && contatosParaSelecionar &&
                    <View style={stylesImportar.containerButton}>
                        <TouchableOpacity style={stylesImportar.buttonImport}
                            onPress={() => { this.adicionarContatos() }}
                        >
                            <Text style={stylesImportar.textButtonImport}>{CONFIRMAR}</Text>
                        </TouchableOpacity>
                    </View>
                }

            </LinearGradient >
        );
    }

}

function mapStateToProps({ usuario }) {
    return {
        usuario
    }
}

function mapDispatchToProps(dispatch) {
    return {
        adicionarProspectosAoAsyncStorage: (contatos) => dispatch(adicionarProspectosAoAsyncStorage(contatos)),
        alterarUsuarioNoAsyncStorage: (usuario) => dispatch(alterarUsuarioNoAsyncStorage(usuario)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportarProspectosScreen)
