import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MaxApi from '@momo-platform/max-api';

const App = () => {
  return (
    <View
      style={{
        height: 400,
        justifyContent: 'center',
        backgroundColor: '#2f2f2f',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          // MaxApi.showAlert('Title', 'mess', [], (index) => {});
        }}>
        <Text>show</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
