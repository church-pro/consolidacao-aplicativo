import { StyleSheet, Platform } from 'react-native';
import { lightdark, gray, white, gold, dark, primary, black } from '../helpers/colors';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: lightdark,
    },
    containerCard: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: gray,
        padding: 0,
        margin: 0,
        flexDirection: 'column',
    },
    name_phone: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    text: {
        color: white
    },
    content: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: 'center',
    },

    date: {
        paddingTop: 6,
        paddingLeft: 6,
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    badgeDate: {
        backgroundColor: gold,
    },


    //STYLE BUTTON
    button: {
        backgroundColor: lightdark,
        borderWidth: 0,
        borderRadius: 5,
        justifyContent: 'center',
        height: 28,
        paddingHorizontal: 8,
    },
    textButton: {
        textAlign: 'center',
        color: white
    },

    //SIDE MENU
    sideMenu: {
        flex: 1,
        alignItems: 'flex-start',
    },
    imgLogo: {
        height: 85,
        width: 90,
        marginBottom: 20,
        marginLeft: 20,
        marginTop: 50,
    },
    textMenu: {
        color: white,
        fontSize: 28,
        fontWeight: '200',
        paddingVertical: 30,
        marginLeft: 20
    },

})

// TELA DE LOGIN
export const stylesLogin = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: 20,
    },
    containerLogo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 50,
        resizeMode: 'contain',
    },
    containerInputEmail: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: gray,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    },
    containerInputSenha: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        height: 45,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6
    },
    inputText: {
        fontSize: 16,
        color: white,
        fontWeight: '400',
        height: 45,
        paddingHorizontal: 8
    },
    containerButton: {
        marginBottom: 6,
    },
    button: {
        backgroundColor: gold,
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        marginHorizontal: 12,
    },
    textButton: {
        fontSize: 16,
        color: white,
        fontWeight: '200',
        textAlign: 'center',
    },

})

// TELA DE REGISTRO
export const stylesRegistro = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    containerInputRegistro: {
        borderWidth: 1,
        borderColor: gray,
        borderRadius: 6,
        height: 60,
        marginTop: 6,
        paddingTop: 3,
        paddingHorizontal: 5
    },
    inputRegistro: {
        color: white,
        fontSize: 18,
        marginLeft: 6,
        paddingTop: 2,
        flex: 1
    },
    labelRegistro: {
        fontSize: 16,
        color: white,
        fontWeight: "bold",
        marginTop: 6
    },
    inputContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }

})

// TELA DE IMPORTAR
export const stylesImportar = StyleSheet.create({
    buttonImport: {
        backgroundColor: primary,
        borderWidth: 0,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
        height: '100%',
    },
    textButtonImport: {
        textAlign: 'center',
        color: white,
        fontSize: 17,
        fontWeight: "bold"
    },
    containerButton: {
        height: 70,
        backgroundColor: primary,
        justifyContent: 'center',
    },
    header: {
        backgroundColor: black,
        borderBottomWidth: 0,
        paddingTop: 20
    },
    headerTitle: {
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: "center",
        color: white,
        fontSize: 16
    },
    containerIcon: {
        backgroundColor: 'transparent',
        margin: 0,
        borderWidth: 0,
        paddingHorizontal: 6
    },
    containerContato: {
        padding: 20,
        borderBottomWidth: 1,
        borderColor: gray,
        backgroundColor: 'transparent'
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

// TELA MARCAR DATA E HORA
export const stylesMarcar = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    containerInput: {
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: gray,
        borderRadius: 6
    },
    inputMarcar: {
        color: white,
        fontSize: 18,
        marginLeft: 6,
        minHeight: 40,
        flex: 1,
    },
    labelMarcar: {
        fontSize: 16,
        color: white,
        fontWeight: "bold",
        marginTop: 6
    },
    inputContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    dateText: {
        color: white,
        fontSize: 18,
        marginLeft: 4,
    },
    dateInput: {
        borderWidth: 0,
        alignItems: "flex-start",

    },
})

// TELA DE PERGUNTAS
export const stylesPerguntas = StyleSheet.create({
    card: {
        backgroundColor: dark,
        borderColor: 'transparent',
        borderRadius: 1,
        margin: 0,
        marginTop: 0,
        padding: 8
    },
    perguntaTitulo: {
        color: white,
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 0,
        paddingBottom: 4,
    },
    containerRespostas: {
        backgroundColor: lightdark,
        alignItems: 'flex-start'
    },
    containerCheckbox: {
        backgroundColor: 'transparent',
        padding: 0,
        borderColor: 'transparent'
    },
})