import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectOrigin, setOrigin } from "../slices/navSlice";
import * as Location from "expo-location";

const data = [
  {
    id: "123",
    title: "Get a ride",
    image: "https://links.papareact.com/3pn",
    screen: "MapScreen",
  },
  {
    id: "456",
    title: "Order Food",
    image: "https://links.papareact.com/28w",
    screen: "EatsScreen",
  },
];

export const NavOptions = ({ isEmpty }) => {
  const [location, setLocation] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            if (isEmpty) {
              dispatch(
                setOrigin({
                  location: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                  },
                  description: "Your Location",
                })
              );
            }
            navigation.navigate("MapScreen");
          }}
          style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 m-2 w-40`}
          // disabled={!origin}
        >
          <View
          // style={tw`${!origin && "opacity-20"}`}
          >
            <Image
              style={{
                width: 120,
                height: 120,
                resizeMode: "contain",
              }}
              source={{ uri: item.image }}
            />
            <Text style={tw`mt-2 text-lg font-bold`}>{item.title}</Text>
            <Icon
              style={tw`p-2 bg-black rounded-full w-10 mt-4`}
              name="arrowright"
              color="white"
              type="antdesign"
            />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({});
