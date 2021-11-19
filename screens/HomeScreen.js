import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import { NavOptions } from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import { NavFavourites } from "../components/NavFavourites";

function useHookWithRefCallbackCheckIfEmptyInput() {
  const ref = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const setRef = useCallback((node) => {
    if (ref.current) {
      if (ref.current?.getAddressText()) {
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
      }
      // Make sure to cleanup any events/references added to the last instance
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
    }

    // Save a reference to the node
    ref.current = node;
  }, []);

  return [setRef, isEmpty];
}

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const [ref, isEmpty] = useHookWithRefCallbackCheckIfEmptyInput();

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
          source={{ uri: "https://links.papareact.com/gzs" }}
        />
        <GooglePlacesAutocomplete
          ref={ref}
          styles={{
            container: { flex: 0 },
            textInput: { fontSize: 18 },
          }}
          minLength={2}
          onPress={(data, details = null) => {
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );
            dispatch(setDestination(null));
          }}
          fetchDetails={true}
          returnKeyType={"search"}
          enablePoweredByContainer={false}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "en",
          }}
          placeholder="Where From?"
          debounce={400}
          nearbyPlacesAPI="GooglePlacesSearch"
        />
        <NavOptions isEmpty={isEmpty} />
        <NavFavourites />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
