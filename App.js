import React from "react";
import { StyleSheet, Text, View, ScrollView, Button, Alert } from "react-native";
import { useGeolocation, clearCache } from "./useGeoLocation";

export default function App() {
  const [geolocations] = useGeolocation();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            clearCache();
          }}
          title="Clear Locations"
          padding="10px"
        />
        <Button
          onPress={() => {
            Alert.alert('Data uploaded!!!');
          }}
          title="Upload"
          padding="10px"
        />
      </View>
      <View>
        <Text>{geolocations.length}</Text>
      </View>
      <View style={{ height: 500 }}>
        <ScrollView>
          {geolocations.map(({ timestamp, coords: { altitude, longitude, latitude } }, index) => (
            <Text key={`key-${index}`}>
              timestamp:{timestamp} altitude:{altitude} longitude:{longitude} latitude:{latitude}
            </Text>
          ))}
          {/* <Text>
              {geolocations}
            </Text> */}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-around"
  }
});
