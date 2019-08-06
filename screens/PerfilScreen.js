import React from 'react';
import { FlatList } from 'react-native'
import Loading from '../components/Loading';
import { black, white, lightdark, dark, gray } from '../helpers/colors';
import {
	View,
	Text,
} from 'react-native';
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'

class PerfilScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
	}

	render() {
		const {
			usuario
		} = this.props
		let keys = Object.keys(usuario);


		return (
			<LinearGradient style={{ flex: 1 }} colors={[black, dark, lightdark, '#343434']}>

				<View style={{}}>
					<Text style={{ color: white, textAlign: "right" }}> Progresso </Text>
				</View>

				<View style={{ alignItems: 'center' }}>
					<View style={{ height: 60, width: 60, borderWidth: 1, borderColor: gray, borderRadius: 60 / 2, alignItems: "center", justifyContent: "center" }}>
						<Text style={{ color: white }}>Avatar</Text>
					</View>
				</View>

				<View style={{ marginTop: 10, padding: 10 }}>

					{/* LAYOUT 1 */}
					{/* <View style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 10 }}>
						<Text style={{ color: white, flexWrap: "wrap", paddingBottom: 5, fontWeight: 'bold' }}> Nome </Text>
						<Text style={{ color: white, flexWrap: "wrap" }}> testando </Text>
					</View>
					<View style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 10 }}>
						<Text style={{ color: white, flexWrap: "wrap", paddingBottom: 5, fontWeight: 'bold' }}> Email </Text>
						<Text style={{ color: white, flexWrap: "wrap" }}> testando </Text>
					</View>
					<View style={{ padding: 5, borderWidth: 1, borderColor: gray, borderRadius: 6, marginTop: 10 }}>
						<Text style={{ color: white, flexWrap: "wrap", paddingBottom: 5, fontWeight: 'bold' }}> Patente </Text>
						<Text style={{ color: white, flexWrap: "wrap" }}> rei </Text>
					</View> */}


					{/* LAYOUT 2 */}
					<View style={{ borderWidth: 1, borderColor: gray, flexDirection: 'row' }}>
						<View style={{ flex: 1, borderRightWidth: 1, borderRightColor: gray }}>
							<View style={{ borderBottomWidth: 1, borderBottomColor: gray, padding: 5, }}>
								<Text style={{ color: white, flexWrap: "wrap", paddingBottom: 5, fontWeight: 'bold' }}> Nome </Text>
							</View>
							<View style={{ padding: 5 }}>
								<Text style={{ color: white, flexWrap: "wrap" }}> Teste </Text>
							</View>
						</View>

						<View style={{ flex: 1 }}>
							<View style={{ borderBottomWidth: 1, borderBottomColor: gray, padding: 5, }}>
								<Text style={{ color: white, flexWrap: "wrap", paddingBottom: 5, fontWeight: 'bold' }}> Email </Text>
							</View>
							<View style={{ padding: 5 }}>
								<Text style={{ color: white, }}> email@email.com </Text>
							</View>
						</View>
					</View>

					<View style={{ borderWidth: 1, borderColor: gray, flexDirection: 'row', marginTop: 10 }}>
						<View style={{ flex: 1, borderRightWidth: 1, borderRightColor: gray }}>
							<View style={{ borderBottomWidth: 1, borderBottomColor: gray, padding: 5, }}>
								<Text style={{ color: white, flexWrap: "wrap", paddingBottom: 5, fontWeight: 'bold' }}> Patente </Text>
							</View>
							<View style={{ padding: 5 }}>
								<Text style={{ color: white, flexWrap: "wrap" }}> Judson </Text>
							</View>
						</View>

						<View style={{ flex: 1 }}>
							<View style={{ borderBottomWidth: 1, borderBottomColor: gray, padding: 5, }}>
								<Text style={{ color: white, flexWrap: "wrap", paddingBottom: 5, fontWeight: 'bold' }}> Nucleo </Text>
							</View>
							<View style={{ padding: 5 }}>
								<Text style={{ color: white, flexWrap: "wrap" }}> teste </Text>
							</View>
						</View>
					</View>

				</View>

				{/* 
				{
					keys.map(item => (

						<View>
							<Text style={{ color: white }}> {item} </Text>
							<Text style={{ color: white }}> {usuario[item]} </Text>
						</View>
					))
				} */}

			</LinearGradient>
		)
	}
}

const mapStateToProps = ({ usuario }) => { return { usuario } }

export default connect(mapStateToProps, null)(PerfilScreen)
