/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import * as cfdjs from 'react-native-cfd';
import * as cfddlcjs from 'react-native-cfddlc';

function MessagesToMessagesList(input: string[][]): cfddlcjs.Messages[] {
  return input.map(x => {
    return {
      messages: x,
    };
  });
}

async function CreateKeyPair() {
  const reqJson = {
    wif: false,
    network: 'mainnet',
    isCompressed: false,
  };

  let response = await cfdjs.CreateKeyPair(reqJson);

  console.log(response);
  return response;
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [result, setResult] = React.useState<string | undefined>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onCreate = async () => {
    let messages = [
      ['1', '0'],
      ['0', '1'],
    ];
    let messagesList = MessagesToMessagesList(messages);
    console.log(messagesList);

    let cetSignRequest = {
      messagesList: messagesList,
      cetsHex: [
        '0200000001caf898f4f82e91cc4769bd2e421e2ba257db446f734d29911c57ed579306c6d60000000000ffffffff01d007000000000000160014921aff64e57d014455144949be573ccf9e2ab0ab00000000',
        '0200000001caf898f4f82e91cc4769bd2e421e2ba257db446f734d29911c57ed579306c6d60000000000ffffffff01d0070000000000001600144da2ed8775deb1b68323f07ed9e7fd716be11aa600000000',
      ],
      privkey: 'L3CnSQ17XosDw9NqtcqUMtLWNVsWiV7wiJoda77vukQ1pkT34Nf6',
      fundTxId:
        'd6c6069357ed571c91294d736f44db57a22b1e422ebd6947cc912ef8f498f8ca',
      localFundPubkey:
        '03a1e0a48f62065f043d71ac1565861ca49ecf0a4b9858a227a2453bfa7a319855',
      remoteFundPubkey:
        '035482f5bf4ab770f9f88c6db13406a9c624aae1adff4b031f7fa1addb966f83ee',
      fundInputAmount: 2340,
      oraclePubkey:
        'c0e5f78856b7bf127520e2f8e7fce39059b3c53ec46231d86080707474191cc6',
      oracleRValues: [
        'baaceeb520e93907cc19c28d8b3c5f9d0899d0908a560dbce9bebc7a2c9771cb',
      ],
    };
    console.log('cetsignreq: ', JSON.stringify(cetSignRequest));

    try {
      let cetSignatures = await cfddlcjs.CreateCetAdaptorSignatures(
        cetSignRequest,
      );
      console.log('cetsigs: ', cetSignatures);
      setResult(JSON.stringify(cetSignatures));
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const onPress = async () => {
    try {
      const response = await CreateKeyPair();
      setResult(JSON.stringify(response));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="CreateKeyPair" color="#841584" onPress={onPress} />
          <Button
            title="CreateCetAdaptorSignatures"
            color="#841584"
            onPress={onCreate}
          />
          <Text>{result}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
