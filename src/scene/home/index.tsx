import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "../../utils/colors/colors";
import HomeScreenIcon from "../../assets/svgs/HomeScreenIcon";
import Dimensions from "../../utils/dimension/dimensions";
import CustomText from "../../components/atoms/CustomText";
import { Image } from "react-native-animatable";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Ionicons"; // For the location icon
import StarRating from "react-native-star-rating"; // For star ratings
import { fontScaleNormalize } from "../../utils/functions/commanFunctions";
import { Fonts } from "../../utils/fonts/fonts";
import ProductCard from "../../components/molecules/ProductCard";
import { getAllProductData, gettype, onEndReached } from "../../service/home";
import { CurrentErrorContext } from "../../context/error_message_context";
import { UserDataContext } from "../../context/user_context";
import SearchBar from "../../components/molecules/SearchBar";
import { useDebouncedEffect } from "../../utils/functions/useDebounceEffect";
import ListEmptyPlaylist from "../../components/molecules/ListEmptyPlaylist";
import { Dropdown } from "react-native-element-dropdown";

const HomeScreen = (props: any) => {
  const [loading, setLoading] = useState(false);
  const { apicall, setapicall } = useContext(UserDataContext);
  const [selectedType, setSelectedType] = useState();
  const [searchObject, setSearchObject] = useState<any>({
    page: 1,
    q: "",
    type: "",
  });
  // console.log(searchObject);
  const [totalPages, setTotalPages] = useState(0);
  async function getMyPlaylistDataApi(searchObject: any) {
    getAllProductData(setLoading, searchObject, setCardData, ErrorContext);
  }
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    if (searchObject.page > 1) {
      // console.log("calling");
      getMyPlaylistDataApi(searchObject);
    }
  }, [searchObject.page]);

  function searchOnEndReached() {
    onEndReached(searchObject.page, totalPages, setSearchObject);
  }

  useDebouncedEffect(
    (searchQuery: string) => {
      let obj = { ...searchObject };
      obj.search = searchObject.q;
      // console.log("caling 22");
      getMyPlaylistDataApi(obj);
      setSearchObject((prevState: any) => ({
        ...prevState,
        q: searchObject.q,
        page: 1,
        type: searchObject.type,
      }));
    },
    [searchObject.q, searchObject.type],
    1000
  );

  useEffect(() => {
    getMyPlaylistDataApi(searchObject);
  }, [apicall]);

  const ErrorContext = useContext(CurrentErrorContext);

  const handleWhatsAppRedirect = (item: any) => {
    const productName = item.name; // Get the product name
    const message = `Hello, can I get more information on your product ${productName}?`;
    // const phoneNumber = item.mobileNumber; // Ensure this is in the correct format (with country code)
    const phoneNumber = `'+' + ${item.countrycode} + ${item.mobileNumber}`;
    if (phoneNumber) {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      Linking.openURL(url).catch((err) =>
        console.error("Error opening WhatsApp", err)
      );
    } else {
      console.log("No mobile number available");
    }
  };
  const [typeData, settypeData] = useState([]);

  async function getMyPlaylistDataApi2() {
    gettype(setLoading, settypeData, ErrorContext);
  }

  useEffect(() => {
    getMyPlaylistDataApi2();
    setapicall(false);
  }, []);

  return (
    <View style={styles.mainView}>
      <View style={styles.innerContainer}>
        <Pressable style={styles.innerContainer}>
          <HomeScreenIcon />
          <CustomText style={styles.text1}> GiveAway</CustomText>
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <SearchBar
          placeholderText="What do you want to find???"
          onChangeText={(text: string) => {
            setSearchObject((prevState: any) => ({
              ...prevState,
              q: text,
            }));
          }}
          onCrossIconPress={() => {
            setSearchObject(() => ({
              page: 1,
              q: "",
            }));
          }}
          placeHolderTextColor={Colors.grey}
          textInputStyle={{
            height: 20,
            borderRadius: 8,
            paddingHorizontal: 12,
            color: "#FFF",
            fontSize: 16,
          }}
          mainStyleView={{ backgroundColor: Colors.Black_10 }}
        />

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={styles.itemTextStyle}
          containerStyle={styles.dropdownContainer}
          iconStyle={styles.iconStyle}
          data={typeData}
          labelField="name"
          valueField="id"
          placeholder="Select item type"
          value={searchObject.type} // Show selected name
          onChange={(item: any) => {
            setSearchObject((prevState: any) => ({
              ...prevState,
              type: item?.id,
            }));
          }} // Update selectedType with the correct ID
        />
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.White} />
        </View>
      ) : (
        <KeyboardAwareScrollView
          style={{
            flex: 1,
            backgroundColor: "black",
            padding: Dimensions.WP_3,
          }}
        >
          <FlatList
            data={cardData}
            bounces={false}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                onWhatsAppPress={() => handleWhatsAppRedirect(item)}
                onPressItem={() =>
                  props.navigation.navigate("ProductDetailsScreen", { item })
                }
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatlistStyle}
            onEndReachedThreshold={0.7}
            onEndReached={searchOnEndReached}
            ListEmptyComponent={ListEmptyPlaylist}
          />
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.Black,
    paddingTop: Dimensions.HP_4,
  },
  innerContainer: {
    marginTop: Dimensions.HP_1_5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Dimensions.HP_1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.Black,
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginVertical: Dimensions.HP_2,
    borderRadius: 10,
    backgroundColor: Colors.Black_10,
    borderColor: Colors.White,
    borderWidth: 1,
    overflow: "hidden", // To ensure image stays within the card
  },
  imageStyle: {
    width: "100%", // Full width horizontally
    height: 150, // Adjust height based on design
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textInput: {
    height: 50,
    backgroundColor: "#222", // Match dropdown background
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#555", // Subtle border like dropdown
    color: "#FFF", // White text
    fontSize: 16,
  },
  inputContainer: {
    // marginHorizontal: Dimensions.WP_3,
    padding: Dimensions.HP_2,
  },
  textFirstContainer: {
    padding: Dimensions.HP_2,
  },
  text1: {
    color: Colors.White,
    fontSize: fontScaleNormalize(20),
    fontFamily: Fonts.Bold,
  },
  text2: {
    color: Colors.White,
    fontSize: fontScaleNormalize(14),
    fontFamily: Fonts.Regular,
    marginTop: Dimensions.HP_1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Dimensions.HP_1,
  },
  locationText: {
    color: Colors.White,
    fontSize: fontScaleNormalize(14),
    marginLeft: 5,
  },
  starRatingStyle: {
    marginTop: Dimensions.HP_1,
    alignSelf: "flex-start",
  },
  buttonStyle: {
    backgroundColor: Colors.Black,
    marginTop: Dimensions.HP_2,
    paddingVertical: Dimensions.HP_1_5,
    paddingHorizontal: Dimensions.WP_5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.Green,
  },
  textStyle: {
    color: Colors.White,
    fontSize: fontScaleNormalize(14),
    fontWeight: "600",
    fontFamily: Fonts.Medium,
    textAlign: "center",
  },
  flatlistStyle: {
    // paddingBottom: Dimensions.HP_9,
  },
  dropdown: {
    marginTop: 20,
    height: 50,
    backgroundColor: "#222", // Match text input
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#555",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#AAA", // Light grey placeholder text
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#FFF", // White selected text
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "#FFF",
    backgroundColor: "#333",
    borderRadius: 8,
  },
  itemTextStyle: {
    fontSize: 16,
    color: "#FFF",
  },
  dropdownContainer: {
    backgroundColor: "#222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: "#FFF",
  },
});
