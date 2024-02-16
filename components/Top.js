import { Pressable, StyleSheet, Text, View, StatusBar } from 'react-native';
import { AppContext } from '../hooks/AppContext';
import { useContext, useReducer } from 'react';

export default function Top(props) {
    const { spanishWord } = useContext(AppContext);
    
    return (
        <View style={styles.top}>
            <Text style={[props.theme, styles.title]}>{spanishWord}</Text>                       
        </View>
    )
}

const styles = StyleSheet.create({
    top: {
        flex: 1.2,
        marginTop: StatusBar.currentHeight || 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: "center",       
    },
    title: {
        position: 'absolute',
        bottom: 10,
        fontSize: 24,
    },
});