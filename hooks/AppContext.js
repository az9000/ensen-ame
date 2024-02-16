import React, { createContext, useState, useReducer, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json())

const defaultValue = {
    spanishWord: 'Hola',
    translations: [],
    size: process.env.EXPO_PUBLIC_API_LIMIT,
    index: 0,
    word_id: 0,
    ask: false,
    score: 0,
}

const LIMIT = process.env.EXPO_PUBLIC_API_LIMIT;

export const AppContext = createContext(defaultValue);

const reducer = (state, action) => {
    switch (action.type) {
        case 'setObject': {
            return {
                ...state,
                index: action.payload.index,
                spanishWord: action.payload.spanishWord,
                translations: action.payload.translations,
                word_id: action.payload.word_id,
                score: action.payload.score,
                ask: action.payload.ask,
            }
        }
        case 'increment': {
            return {
                ...state,
                index: state.index + 1,
                spanishWord: action.payload.spanishWord,
                translations: action.payload.translations,
                word_id: action.payload.word_id,
            }
        }
        case 'decrement': {
            return {
                ...state,
                index: state.index - 1,
                spanishWord: action.payload.spanishWord,
                translations: action.payload.translations,
                word_id: action.payload.word_id,
            }
        }
        case 'ask': {
            return {
                ...state,
                ask: action.payload.ask
            }
        }
        case 'score': {
            return {
                ...state,
                score: action.payload.score,
            }
        }
    }
}

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);
    const { data, error, isLoading } = useSWR(process.env.EXPO_PUBLIC_API_URL + LIMIT, fetcher);
    const [dictionary, setDictionary] = useState(data);
    const [serverError, setServerError] = useState(false);
    const [count, setCount] = useState(0);
    let intervalRef = useRef();

    if (data && !dictionary) {
        setDictionary(data.data);
    }

    const increaseCount = () => setCount((prev) => prev + 1);

    useEffect(() => {
        intervalRef.current = setInterval(increaseCount, 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    if (count > 5) {
        setServerError(true);
        setCount(0);
    }

    useEffect(() => {
        if (dictionary) {
            console.log('dictionary:', dictionary);
            dispatch({
                type: "setObject",
                payload: {
                    index: 0,
                    spanishWord: dictionary[0].spanishWord,
                    translations: dictionary[0].translations,
                    word_id: dictionary[0].id,
                    score: 0,
                    ask: true,
                }
            });
        }
    }, [dictionary]);

    const value = {
        ...state,
        getObject: () => {
            dispatch({
                type: 'setObject',
                payload: {
                    spanishWord: dictionary[state.index].spanishWord,
                    translations: dictionary[state.index].translations,
                    word_id: dictionary[state.index].id,
                }
            })
        },
        increment: () => {
            dispatch({
                type: "increment",
                payload: {
                    spanishWord: dictionary[state.index + 1].spanishWord,
                    translations: dictionary[state.index + 1].translations,
                    word_id: dictionary[state.index + 1].id,
                }
            });
        },
        decrement: () => {
            dispatch({
                type: "decrement",
                payload: {
                    spanishWord: dictionary[state.index - 1].spanishWord,
                    translations: dictionary[state.index - 1].translations,
                    word_id: dictionary[state.index - 1].id,
                }
            });
        },
        addId: async (id) => {
            if (id === 0) {
                return;
            }
            console.log('no idea about ', id)
            const url = process.env.EXPO_PUBLIC_API_POST_URL;
            const formBody = Object.keys({ word_id: id }).map(key => encodeURIComponent(key) + '=' + encodeURIComponent({ word_id: id }[key])).join('&');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: formBody
            };
            const data = await fetch(url, requestOptions)
                .then(r => r.json());
            console.log('addId:', data);
        },
        removeId: async (id) => {
            console.log('I know ', id)
            dispatch({
                type: 'score',
                payload: {
                    score: state.score + 1
                }
            })
            const url = process.env.EXPO_PUBLIC_API_DELETE_URL + id
            const data = await fetch(url, { method: 'DELETE' })
                .then(r => r.json());
            console.log('removeId:', data);
        },
        quiz: (status) => {
            dispatch({
                type: 'ask',
                payload: {
                    ask: status
                }
            })
        },
        refresh: async () => {
            console.log('refresh')
            mutate(process.env.EXPO_PUBLIC_API_URL + LIMIT).then(res => {
                // console.log('res:', res)
                setDictionary(res.data);
            })
        },
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <Text style={{ fontSize: 22, margin: 10 }}>Loading ...</Text>
                {serverError &&  <Text style={{ fontSize: 9, fontStyle: 'italic' }}>Taking too long? Looks like a Server issue!</Text>}
                {serverError &&  <Text style={{ fontSize: 8, fontStyle: 'italic' }}>Please try again later!</Text>}
                {serverError &&  <Text style={{ fontSize: 7, fontStyle: 'italic' }}>Sorry!</Text>}
            </View>
        )
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
