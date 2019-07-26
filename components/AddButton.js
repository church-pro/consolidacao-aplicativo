import React from 'react';
import { TouchableOpacity, Animated, Easing, View, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';

import { primary } from '../helpers/colors';
import { Icon } from 'react-native-elements';

class AddButton extends React.Component {

    render() {


        return (
            <View>
                <View
                    style={[style.bigBubble,]}
                >
                    <TouchableOpacity
                        hitSlop={{
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        }}
                        onPress={() => this.props.navigation.navigate('ImportarProspectos')}
                    >
                        <View

                        >
                            <Icon
                                name="plus"
                                size={35}
                                color="#FFF"
                                type="font-awesome"
                            />
                        </View>
                    </TouchableOpacity>
                </View>


            </View>
        );
    }
}

const style = StyleSheet.create({
    bigBubble: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primary,
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        top: -30,
    },
    smallBubble: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primary,
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
    },
});

export default withNavigation(AddButton);