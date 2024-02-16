import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { ContextProvider } from './hooks/AppContext';


import Top from './components/Top';
import Middle from './components/Middle';
import Bottom from './components/Bottom';
import Results from './components/Results';

export default function App() {
  const [show, setShow] = useState(false);
  let colorScheme = useColorScheme();
  const containerBkgColor = (colorScheme === 'dark') ? { backgroundColor: 'black' } : { backgroundColor: '#fff' };
  const textThemeColor = (colorScheme === 'dark') ? { color: 'skyblue' } : { color: 'black' };

  const showResults = () => {
    setShow(true);
  }

  const action = () => {
    setShow(false);
  }

  return (
    <ContextProvider>
      
      <View style={[styles.container, containerBkgColor]}>

        {/* TOP */}
        {!show && <Top theme={textThemeColor} />}

        {/* MIDDLE */}
       {!show && <Middle theme={textThemeColor} />}

        {/* BOTTOM */}
        {!show && <Bottom theme={textThemeColor} parentCall={showResults} />}

        {show && <Results theme={textThemeColor} parentCall={action} />}

        <StatusBar style="auto" hidden={false} />
      </View>

    </ContextProvider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
