import React from 'react';
import { black, lightdark, gray, dark, primary, white } from '../helpers/colors';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView,
	NetInfo,
	Alert
} from 'react-native';
import { LinearGradient } from 'expo'
import { stylesImportar } from '../components/Styles'
import { Header, Title, Left, Body, Right } from 'native-base'
import arrow from '../assets/images/arrow-back.png'

class AtualizacoesScreen extends React.Component {

	static navigationOptions = {
		headerTintColor: white,
		header: null,
		gesturesEnabled: false,
	}

	render() {

		const container = {
			padding: 10,
			borderWidth: 1,
			borderColor: gray,
			borderRadius: 6,
			marginTop: 10
		}

		const items = [
			{
				titulo: '05/09/2019',
				subTitulos: [
					{
						titulo: 'Clubes',
						items: [
							'Opções de alterar Nome/Remover',
							'Bloqueiar/Desbloquear um participante',
						]
					},
					{
						titulo: 'Notificações',
						items: [
							'Lembrete de ações',
						]
					},
				]
			},
			{
				titulo: '28/08/2019',
				subTitulos: [
					{
						titulo: 'Conquitas',
						items: [
							'Ganho de conquistas por ações concluídas',
						]
					},
					{
						titulo: 'Configurações',
						items: [
							'Opções de alterar Nome/Email/Senha',
							'Opção de Deslogar',
						]
					},
					{
						titulo: 'Clubes',
						items: [
							'Remover participante do clube',
						]
					}
				]
			},
			{
				titulo: '20/08/2019',
				subTitulos: [
					{
						titulo: 'Aba de Pessoas',
						items: [
							'Importar/Cadastro de Pessoas',
							'Acompanhamento',
						]
					},
					{
						titulo: 'Aba de Perfil',
						items: [
							'Dados de Progresso',
						]
					},
					{
						titulo: 'Aba de Clubes',
						items: [
							'Criar/Participar',
						]
					},
					{
						titulo: 'Pontos',
						items: [
							'Ganho de pontos por ações concluídas',
						]
					}
				]
			}
		]

		return (
			<LinearGradient style={{ flex: 1, paddingBottom: 10 }} colors={[black, dark, lightdark, '#343434']}>
				<Header style={[stylesImportar.header, { backgroundColor: dark }]} iosBarStyle="light-content">
					<Left>
						<TouchableOpacity
							hitSlop={{ right: 15, bottom: 10, top: 10, left: 10 }}
							style={stylesImportar.containerIcon}
							onPress={() => this.props.navigation.goBack()}>
							{
								Platform.OS === "ios" ?
								<Icon type="font-awesome" name={"angle-left"}
									color={white} size={36}
								/>
								:
								<Image source={arrow} style={{ height: 16, width: 16, marginHorizontal: 5 }} />
							}
						</TouchableOpacity>
					</Left>
					<Body>
						<Title style={stylesImportar.headerTitle}>
							Atualizações
						</Title>
					</Body>
					<Right>
					</Right>
				</Header>

				<ScrollView style={{ paddingHorizontal: 20 }}>
					{
						items.map(item => 
							<View 
								key={item.titulo}
								style={container}>
								<Text 
									style={{
										color: white,
										fontWeight: 'bold',
									}}>
									# {item.titulo}
								</Text>
								{
									item.subTitulos.map(subTitulo =>
										<View
										key={`${item.titulo}${subTitulo.titulo}`}>
											<Text 
												style={{
													color: white,
													marginLeft: 5,
												}}>
												* {subTitulo.titulo}
											</Text>
											{
												subTitulo.items.map(itemSub =>
													<Text 
														key={itemSub}
														style={{
															color: white,
															marginLeft: 15,
														}}>
														{itemSub}
													</Text>
												)
											}
										</View>
									)
								}
							</View>
						)
					}
				</ScrollView>
			</LinearGradient>
		)
	}
}

export default AtualizacoesScreen
