import { useState, useEffect } from "react"
import { AsyncStorage, Alert } from "react-native";
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';
const GEO_LOCATION_KEY = 'GEO_LOCATION_3';

const delay = 5000;



export const useGeolocation = () => {

    const [geolocations, setGeolocation] = useState([]);

    // set first initial cached locations
    useEffect(() => {
        const setup = async () => {
            const initial_cached_locations = await AsyncStorage.getItem(GEO_LOCATION_KEY);
            if (initial_cached_locations) {
                setGeolocation(JSON.parse(initial_cached_locations));
            } else {
                await AsyncStorage.setItem(GEO_LOCATION_KEY, JSON.stringify([]));
            }
        }
        setup();
        backgroundLocation();
    }, [])

    useEffect(() => {
        TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
            if (error) {
                // Error occurred - check `error.message` for more details.
                Alert.alert(error.message);
                return;
            }
            if (data) {
                const { locations } = data;

                const cached_locations = JSON.parse(await AsyncStorage.getItem(GEO_LOCATION_KEY));

                const concated_locations = [...locations, ...cached_locations];

                await AsyncStorage.setItem(GEO_LOCATION_KEY, JSON.stringify(concated_locations));

                setGeolocation(concated_locations);

                // setTimeout(() => {
                //     backgroundLocation();
                // }, delay)
                // do something with the locations captured in the background
            }
        });
    }, [])

    return [geolocations]
}

const backgroundLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status === 'granted') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: delay,
            foregroundService: {
                notificationTitle: 'Covid19',
                notificationBody: 'Running!!'
            },
            pausesUpdatesAutomatically: false
        });
    }
};


export const clearCache = async () => {
    await AsyncStorage.setItem(GEO_LOCATION_KEY, JSON.stringify([]));
}


