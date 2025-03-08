import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Platform,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "../../utils/colors/colors";
import Dimensions from "../../utils/dimension/dimensions";
import { fontScaleNormalize } from "../../utils/functions/commanFunctions";
import CustomText from "../../components/atoms/CustomText";
import { AsyncKey, Storage } from "../../utils/storage/storage";
import { CurrentErrorContext } from "../../context/error_message_context";
import { Fonts } from "../../utils/fonts/fonts";
import HeaderBar from "../../components/molecules/HeaderBar";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import CustomButton from "../../components/atoms/CustomButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  addProducts,
  gettype,
  uploadImage,
  uploadimage,
} from "../../service/home";
import { UserDataContext } from "../../context/user_context";

import SingleImagePicker from "../../components/molecules/SingleImagePicker";
import { Image } from "react-native-image-crop-picker";
import Picker from "react-native-picker-select";
import { Dropdown } from "react-native-element-dropdown";

const AddProductScreen = (props: any) => {
  const [loading, setLoading] = useState(false);
  const ErrorContext = useContext(CurrentErrorContext);
  const { apicall, setapicall } = useContext(UserDataContext);
  var userData: any = Storage.getString(AsyncKey.UserData);
  userData = JSON.parse(userData);
  const handleSubmit = () => {
    createProductAPI();
  };
  const [image, setImage] = useState<Image>();
  const [selectedType, setSelectedType] = useState();
  // console.log(selectedType);
  const [addproduct, setaddproduct] = useState({
    name: "",
    description: "",
    location: "",
    rating: "",
  });

  const [create, setcreate] = useState();

  useEffect(() => {
    // console.log("create", create);
    //@ts-ignore
    if (create?.statusCode == 200) {
      setapicall(true);
      props?.navigation?.navigate("PlayListStack", {
        screen: "ProductTabScreen",
      });
      addproduct.name = "";
      addproduct.description = "";
      addproduct.location = "";
      addproduct.rating = "";
    }
  }, [create]);

  async function createProductAPI() {
    // console.log("image------", image);
    let array = [];

    // console.log("selectedType", selectedType);
    let obj = {
      ...addproduct,
      type: selectedType,
      user_id: userData?.userId,
    };
    console.log(obj);
    await addProducts(obj, setLoading, setcreate, ErrorContext);
  }
  const [typeData, settypeData] = useState([]);

  async function getMyPlaylistDataApi() {
    gettype(setLoading, settypeData, ErrorContext);
  }

  useEffect(() => {
    getMyPlaylistDataApi();
    setapicall(false);
  }, []);

  const onChangeImage = (image: Image) => {
    setImage(image);
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.Black }}>
      <HeaderBar
        onPressBack={() => {
          props?.navigation?.navigate("Profile");
        }}
        screenName={"Add Product"}
      />
      <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "black" }}>
        <SingleImagePicker
          onChangeImage={onChangeImage}
          editImage={undefined}
        />
        {/* Product Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Product Name</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.White}
            placeholder="Enter Product Name"
            value={addproduct?.name}
            onChangeText={(text) => {
              if (text.length <= 30) {
                setaddproduct({ ...addproduct, name: text });
              }
            }}
          />
        </View>

        {/* Product Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Product Description</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.White}
            placeholder="Enter Product Description"
            // value={productDescription}
            // onChangeText={setProductDescription}
            value={addproduct?.description}
            onChangeText={(text) => {
              if (text.length <= 30) {
                setaddproduct({ ...addproduct, description: text });
              }
            }}
          />
        </View>

        <View style={{}}>
          <Text style={styles.title}>Select an Option</Text>
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
            placeholder="Select item"
            value={selectedType} // Show selected name
            onChange={(item) => setSelectedType(item.id)} // Update selectedType with the correct ID
          />
        </View>

        {/* User Location Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.title}>User Location</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.White}
            placeholder="Enter User Location"
            // value={userLocation}
            // onChangeText={setUserLocation}
            value={addproduct?.location}
            onChangeText={(text) => {
              if (text.length <= 30) {
                setaddproduct({ ...addproduct, location: text });
              }
            }}
          />
        </View>

        {/* Product Rating Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Product Rating</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.White}
            placeholder="Enter Product Rating (1-5)"
            // value={productRating}
            // onChangeText={setProductRating}
            keyboardType="numeric"
            value={addproduct?.rating}
            onChangeText={(text) => {
              if (text.length <= 30) {
                setaddproduct({ ...addproduct, rating: text });
              }
            }}
          />
        </View>
        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleSubmit}>
            <CustomText
              style={{
                color: Colors.Green,
                fontSize: fontScaleNormalize(14),
                fontFamily: Fonts.Medium,
                alignSelf: "center",
              }}
            >
              Add Product
            </CustomText>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: Colors.White,
    fontFamily: Fonts.Medium,
    marginVertical: Dimensions.HP_1,
  },
  button: {
    backgroundColor: Colors.Black,
    borderWidth: 1,
    borderColor: Colors.Green,
    paddingVertical: Dimensions.HP_1_5,
    paddingHorizontal: Dimensions.WP_5,
    borderRadius: 20,
    width: Dimensions.WP_80,
    alignSelf: "center",
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
    // margin: Dimensions.WP_3,
  },
  buttonContainer: {
    margin: Dimensions.WP_3,
    marginTop: 20,
  },
  dropdown: {
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
