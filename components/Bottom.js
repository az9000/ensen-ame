import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppContext } from '../hooks/AppContext';
import { useContext, memo, useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTimeout from '../hooks/useTimeout';
import * as Progress from 'react-native-progress';


export default memo(function Bottom(props) {
    const [count, setCount] = useState(1)
    const [showResults, setShowResults] = useState(false);
    const { clear, reset } = useTimeout(() => setCount(0), 120000)
    const { index, size, increment, decrement, refresh, ask } = useContext(AppContext);

    const newData = () => {
        refresh();
        setCount(1);
    }

    const results = () => {
        setShowResults(true);
        props.parentCall();
    }

    return (
        <View style={styles.container}>
            {!ask && <View style={[props.theme, , styles.bottom]}>
                <Pressable
                    style={({ pressed }) => [
                        pressed ? { opacity: 0.9 } : { opacity: index !== 0 ? 1 : 0.3 },
                        styles.button
                    ]}
                    onPress={decrement} disabled={index === 0}>
                    <Ionicons name="chevron-back" size={32} color={props.theme.color} />
                    <Text style={[props.theme, styles.buttonText]}>Previous</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [
                    pressed ? { opacity: 0.9 } : { opacity: count === 0 ? 1 : 0.3 },
                    styles.button
                ]}
                    onPress={newData} disabled={count > 0}>
                    <Ionicons name="refresh" size={32} color={props.theme.color} />
                    <Text style={[props.theme, styles.buttonText]}>Refresh</Text>
                </Pressable>
                <Pressable style={[styles.button]}
                    onPress={(index === size - 1) ? results : increment}>
                    <Ionicons name="chevron-forward" size={32} color={props.theme.color} />
                    <Text style={[props.theme, styles.buttonText]}>Next</Text>
                </Pressable>
            </View>}
            {!ask && <View style={[props.theme, styles.bargraph]}>
                <Progress.Bar progress={index / (process.env.EXPO_PUBLIC_API_LIMIT - 1)} width={200} />
            </View>}
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: "center",
    },
    bottom: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
    },
    bargraph: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '33.3%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 10,
    }
});