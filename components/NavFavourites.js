import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import {
  selectDestination,
  selectOrigin,
  setDestination,
  setOrigin,
  setTravelTimeInformation,
} from "../slices/navSlice";
import { GOOGLE_MAPS_API_KEY } from "@env";

export const NavFavourites = ({ isDestination }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const redOrigin = useSelector(selectOrigin);

  const data = [
    {
      id: "123",
      icon: "home",
      location: "home",
      destination:
        "Pheasant Ridge Apartments, Colima Road, Rowland Heights, CA, USA",
      coordinate: {
        lat: 33.9899971,
        lng: -117.9178061,
      },
    },
    {
      id: "234",
      icon: "briefcase",
      location: "work",
      destination: "Tropical Flooring, Garvey Avenue, El Monte, CA, USA",
      coordinate: {
        lat: 34.0631294,
        lng: -118.0141525,
      },
    },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => (
        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
      )}
      renderItem={({ item: { icon, location, destination, coordinate } }) => (
        <TouchableOpacity
          style={tw`flex-row items-center p-5`}
          onPress={() => {
            if (isDestination) {
              dispatch(
                setDestination({
                  location: coordinate,
                  description: destination,
                })
              );

              const getTravelTime = async () => {
                const res = await fetch(
                  `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${redOrigin.description}&destinations=${destination}&key=${GOOGLE_MAPS_API_KEY}`
                );
                const resJson = await res.json();
                dispatch(setTravelTimeInformation(resJson.rows[0].elements[0]));
                navigation.navigate("RideOptionsCard");
              };

              getTravelTime();
            } else {
              dispatch(
                setOrigin({
                  location: coordinate,
                  description: destination,
                })
              );
              navigation.navigate("MapScreen");
            }
          }}
        >
          <Icon
            name={icon}
            type="ionicon"
            color="white"
            size={18}
            style={tw`mr-4 rounded-full bg-gray-300 p-3`}
          />
          <View>
            <Text style={tw`font-semibold text-lg`}>{location}</Text>
            <Text style={tw`text-gray-500`}>{destination}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({});
