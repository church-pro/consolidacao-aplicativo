import { StyleSheet, Platform } from 'react-native';
import { lightdark, gray, white, gold, dark, primary, black } from '../helpers/colors';

// GLOBAL
export const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    containerInput: {
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: gray,
        borderRadius: 6,
        marginTop: 5,
    },
    input: {
        color: white,
        marginLeft: 6,
    },
    inputContainerStyle: {
        borderWidth: 0,
        borderColor: 'transparent'
    },
    label: {
        marginTop: 5,
        color: white
    },

    titleList: {
        textAlign: 'center',
        color: '#AAA',
        padding: 10,
    },
})

// TELA DE PROSPECTO
export const stylesProspecto = StyleSheet.create({
    containerCard: {
        backgroundColor: 'transparent',
        borderColor: gray,
        borderRadius: 6,
        padding: 0,
        margin: 8,
        flexDirection: 'column',
    },
    containerProspecto: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginHorizontal: 20,
        justifyContent: 'space-between',
        // flexWrap: 'wrap',
        alignItems: 'center'
    },
    text: {
        color: white,
        fontWeight: 'bold'
    },
    containerName: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'flex-start',
    },
    containerActions: {
        // backgroundColor: primary,
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerBadge: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    badge: {
        borderWidth: 0,
        paddingVertical: 2
    },
    textBadge: {
        color: white,
        fontSize: 12,
        fontWeight: 'bold'
    },
    containerBadgeIcons: {
        // backgroundColor: '#333',
        marginRight: 10,
        padding: 4,
        borderRadius: 5,
    }
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
    button: {
        backgroundColor: 'transparent',
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
        paddingTop: 10
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
        padding: 12,
        borderBottomWidth: 1,
        borderColor: gray,
        backgroundColor: 'transparent'
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerIcon: {
        justifyContent: 'center'
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
        padding: 5,
        borderColor: 'transparent'
    },
})

//SIDE MENU
export const stylesSideMenu = StyleSheet.create({
    containerImg: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgLogo: {
        height: 35,
        width: 205,
    },
    button: {
        marginVertical: 10,
        backgroundColor: 'transparent'
    },
    textMenu: {
        color: white,
        fontSize: 26,
        fontWeight: '200',
    },
})