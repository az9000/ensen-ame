import { StyleSheet, View, Text, Pressable, Image, Alert, BackHandler } from 'react-native';
import { AppContext } from '../hooks/AppContext';
import { useContext, memo, useState, useEffect } from 'react';

export default function Results(props) {
    const { refresh, size, score } = useContext(AppContext);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        setPercentage((score / size) * 100);
    }, [score])

    const restart = () => {
        props.parentCall();
        refresh();
    }

    const exit = () => {
        Alert.alert(
            'Exit App',
            'Do you want to exit?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }

    return (
        <View style={[styles.container, props.theme]}>
            <Text style={[props.theme, styles.title]}>Score: {score}/{size}</Text>
            {percentage >= 70 && <Image source={require('../assets/happy.gif')} />}
            {percentage < 70 && <Image source={require('../assets/sad.gif')} />}
            <Pressable><Text style={[props.theme, { margin: 20 }]} onPress={restart}>Restart</Text></Pressable>
            <Pressable><Text style={[props.theme, { margin: 20 }]} onPress={exit}>Exit</Text></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        margin: 20,
    },
});