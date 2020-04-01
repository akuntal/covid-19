import { useState, useEffect } from "react"
import { AsyncStorage, Alert } from "react-native";
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';
const GEO_LOCATION_KEY = 'GEO_LOCATIONS';

const delay = 5000;

export const useGeolocation = () => {
    const [location, setLocation] = useState([]);

    useEffect(() => {
        backgroundLocation();
        initStorageLocation();

        setTimerForGeolocationUpdate();

        // let timer = setTimeout(async function updateLocations() {
        //     // const locations = await AsyncStorage.getItem(GEO_LOCATION_KEY);
        //     // const arr_locations = JSON.parse(locations);
        //     // setLocation(arr_locations);
        //     // const t = timer+1;
        //     // setTimer(t);
        //     backgroundLocation()
        //     timer = setTimeout(updateLocations, delay)
        // }, delay)
    }, [])

    useEffect(() => {

        TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
            if (error) {
                // Error occurred - check `error.message` for more details.
                Alert.alert(error.message);
                return;
            }
            if (data) {
                const { locations } = data;

                const arr = [...locations, ...location];
                // Alert.alert(arr.length.toString() + "  " + location.length.toString() + "  " + locations.length.toString() + " " + setLocation.toString())

                setLocation([...locations, ...location]);

                // setLocation(JSON.stringify(locations))

                setTimeout(() => {
                    backgroundLocation();
                }, delay)
                // do something with the locations captured in the background
            }
        });
    }, [])

    return [location]
}

const setTimerForGeolocationUpdate = () => {

    let timerId = setTimeout(async function request() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async ({ coords: { altitude, longitude, latitude } }) => {
                const locations = JSON.parse(await AsyncStorage.getItem(GEO_LOCATION_KEY));

                const str = JSON.stringify([{ altitude, longitude, latitude }, ...locations]);
                await AsyncStorage.setItem(GEO_LOCATION_KEY, str);
            }, error => {
                Alert.alert(error.message);
            });
        } else {
            // setLocation(['geolocation not supported!!!']);
        }
        timerId = setTimeout(request, delay);

    }, delay);
}

export const clearCache = async () => {
    await AsyncStorage.setItem(GEO_LOCATION_KEY, JSON.stringify([]));
    initStorageLocation();
}

const initStorageLocation = async () => {
    const locations = await AsyncStorage.getItem(GEO_LOCATION_KEY);
    if (!locations) {
        await AsyncStorage.setItem(GEO_LOCATION_KEY, JSON.stringify([]));
    }
}

const backgroundLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status === 'granted') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
        });
    }
};

