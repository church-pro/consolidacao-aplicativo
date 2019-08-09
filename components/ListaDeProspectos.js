import React from 'react';
import {
	Text,
	View,
	FlatList,
	RefreshControl,
	NetInfo,
	Alert,
	TouchableOpacity,
} from 'react-native';
import Prospecto from '../components/Prospecto'
import {
	sincronizarNaAPI,
	recuperarHistoricoNaoSincronizado,
	limparHistoricos,
} from '../helpers/api'
import { styles } from './Styles';
import { primary } from '../helpers/colors';

class ListaDeProspectos extends React.Component {

	state = {
		refreshing: false,
		sincronizando: false,
	}

	_handleRefresh = () => {
		this.setState({ refreshing: true })
		this.props.navigation.navigate('Sincronizacao', { tela: 'Principal' })
	}

	_keyExtractor = (item, index) => item._id;

	_renderItem = ({ item }) => (
		<Prospecto
			key={item._id}
			prospecto={item}
			navigation={this.props.navigation}
		/>
	)

	render() {
		const { title, prospectos, navigation } = this.props
		return (
			<View style={{ flex: 1 }}>
				{
					prospectos &&
					<FlatList
						data={prospectos}
						renderItem={this._renderItem}
						keyExtractor={this._keyExtractor}
						navigation={navigation}
						removeClippedSubviews={false}
					/>
				}
			</View>
		)
	}

}

export default (ListaDeProspectos)
