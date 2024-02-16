import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { AppContext } from '../hooks/AppContext';
import { useContext, useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';


const Item = ({ title, example, theme }) => (
    <View style={styles.item}>
        <Text style={[theme, styles.title]}>{title}</Text>
        <Text style={[theme, styles.example]}>{example}</Text>
    </View>
);

export default function Middle(props) {
    const { index, translations, quiz, ask, word_id, addId, removeId } = useContext(AppContext);   
    const timerRef = useRef(0);

    useEffect(() => {        
        quiz(true);
        timerRef.current = setTimeout(() => {
            quiz(false);
        }, 8000);

        return () => {
            clearTimeout(timerRef.current);
        }

    }, [index])
    

    const yes = () => {
        quiz(false);
        removeId(word_id);
    }

    const no = () => {
        quiz(false);
        addId(word_id);
    }

    return (
        <>
            {!ask && <View style={[props.theme, styles.middle]}>
                <FlatList
                    ItemSeparatorComponent={
                        <View
                            style={styles.separator}
                        />
                    }
                    data={translations}
                    renderItem={({ item }) => <Item title={item.translation} example={item.example.replace((/\\/g, "\\\\"))} theme={props.theme} />}
                    keyExtractor={(item, index) => 'key_' + index}
                />
            </View>}
            {ask && <View style={[props.theme, styles.middle]}>
                <Text style={[props.theme, styles.title, { margin: 10, width: '100%', textAlign: 'center', fontSize: 24, }]}>¿Lo sabes?</Text>
                <View style={[props.theme, styles.title, { margin: 10, width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: "row" }]}>
                    <Pressable style={styles.button} onPress={yes} >
                        <Ionicons name="happy" size={32} color={props.theme.color} />
                        <Text style={[props.theme, styles.buttonText]}>Sí</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={no}>
                        <Ionicons name="sad" size={32} color={props.theme.color} />
                        <Text style={[props.theme, styles.buttonText]}>No</Text>
                    </Pressable>
                </View>

            </View>}
        </>
    )
}
const styles = StyleSheet.create({
    middle: {
        flex: 5.5,
        width: '100%',
        alignItems: 'center',
        justifyContent: "center",
        borderStyle: 'solid',
        borderWidth: 1,
        flexDirection: 'column',
    },
    item: {
        flexDirection: 'column',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
    },
    example: {
        fontSize: 12,
    },
    separator: {
        backgroundColor: 'lightgrey',
        height: 1,
        marginLeft: 50,
        marginRight: 50,
    },
    button: {
        width: '50%',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderWidth: 0,
        borderColor: 'yellow',
    },
    buttonText: {
        fontSize: 10,
    }
});