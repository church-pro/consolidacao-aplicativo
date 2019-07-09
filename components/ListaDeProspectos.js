import React from 'react';
import {
	Text,
	View,
	FlatList,
	RefreshControl,
	NetInfo,
	Alert
} from 'react-native';
import Prospecto from '../components/Prospecto'
import {
	sincronizarNaAPI,
	recuperarHistoricoNaoSincronizado,
	limparHistoricos,
} from '../helpers/api'

class ListaDeProspectos extends React.Component {

	state = {
		refreshing: false,
		sincronizando: false,
	}

	_handleRefresh = () => {
		this.setState({refreshing: true})
		this.props.navigation.navigate('Sincronizacao', {tela: 'Prospectos'})
	}

	_keyExtractor = (item, index) => item.id;

	_renderItem = ({ item }) => (
		<Prospecto
			key={item.id}
			prospecto={item}
			navigation={this.props.navigation}
		/>
	)

	render() {
		const { title, prospectos, navigation } = this.props
		return (
			<View style={{ flex: 1 }}>
				<Text style={{ textAlign: 'center', color: '#AAA', padding: 10, }}>{title}</Text>
				{
					prospectos &&
					<FlatList
						data={prospectos}
						renderItem={this._renderItem}
						keyExtractor={this._keyExtractor}
						navigation={navigation}
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this._handleRefresh}
							/>
						}
						removeClippedSubviews={false}
					/>
				}
			</View>
		)
	}

}

export default (ListaDeProspectos)
