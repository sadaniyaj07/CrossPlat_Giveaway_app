import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "../../utils/colors/colors";
import SearchBar from "../../components/molecules/SearchBar";
import ShimmerPlaceHolderListView from "../../components/molecules/ShimmerPlaceHolderListView";
import PlaylistSonglistingShimmer from "../../components/molecules/playlistSongListingShimmer";
import Dimensions from "../../utils/dimension/dimensions";
import deviceInfoModule from "react-native-device-info";
import { Images } from "../../utils/imageSource/imageSource";
import * as Animatable from "react-native-animatable";
import { CurrentErrorContext } from "../../context/error_message_context";
import { fontScaleNormalize } from "../../utils/functions/commanFunctions";
import {
  getAllProductData,
  getAllusers,
  onEndReached,
} from "../../service/home";
import { useDebouncedEffect } from "../../utils/functions/useDebounceEffect";
import AnimatedLottieView from "lottie-react-native";
import { UserDataContext } from "../../context/user_context";

const SearchSellerScreen = (props: any) => {
  let hasNotch = deviceInfoModule.hasNotch();
  const { apicall, setapicall } = useContext(UserDataContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [artist, setArtistData] = useState<[]>([]);
  const [songData, setSongData] = useState<[]>([]);
  const [albumData, setAlbumData] = useState<[]>([]);
  const [searchObject, setSearchObject] = useState<any>({
    page: 1,
    q: "",
  });
  const [totalPages, setTotalPages] = useState(0);
  const ErrorContext = useContext(CurrentErrorContext);
  const [cardData, setCardData] = useState([]);
  console.log(cardData);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Flag to check if it's the first load

  async function getMyPlaylistDataApi(searchObject: any) {
    getAllusers(setLoading, searchObject, setCardData, ErrorContext);
  }

  useEffect(() => {
    if (searchObject.page > 1) {
      getMyPlaylistDataApi(searchObject);
    }
  }, [searchObject.page]);

  function searchOnEndReached() {
    onEndReached(searchObject.page, totalPages, setSearchObject);
  }

  useDebouncedEffect(
    (searchQuery: string) => {
      let obj = { ...searchObject };
      obj.q = searchObject.q; // Use the updated search query
      getMyPlaylistDataApi(obj);
      setSearchObject((prevState: any) => ({
        ...prevState,
        q: searchObject.q,
        page: 1,
      }));
    },
    [searchObject.q],
    1000 // Debounce for 1000 milliseconds
  );

  useEffect(() => {
    if (!isFirstLoad) {
      getMyPlaylistDataApi(searchObject);
    } else {
      setIsFirstLoad(false); // Set the flag to false after the first load
    }
  }, [apicall]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.name}>{item.fullName}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.phone}>{item.mobileNumber}</Text>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Black,
        paddingHorizontal: 20,
        paddingBottom: Dimensions.HP_1,
      }}
    >
      <View
        style={[
          styles.secondContainer,
          {
            paddingTop:
              Platform.OS === "ios"
                ? hasNotch
                  ? Dimensions.HP_15
                  : Dimensions.HP_10
                : Dimensions.HP_5,
          },
        ]}
      >
        <SearchBar
          placeholderText="Find Seller Near You?"
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
            backgroundColor: Colors.Black_10,
            fontSize: fontScaleNormalize(15),
            color: Colors.White,
            marginLeft: 10,
            width: "82%",
          }}
          mainStyleView={{ backgroundColor: Colors.Black_10 }}
        />
      </View>
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flexDirection: "row" }}>
            <ShimmerPlaceHolderListView
              flatlistStyle={{
                marginBottom: Dimensions.HP_2_1,
              }}
              ContainerStyle={{ marginEnd: 0, marginRight: 0 }}
              totalNumber={14}
              horizontal={false}
              renderItem={() => <PlaylistSonglistingShimmer />}
            />
          </View>
        ) : (
          <>
            {cardData.length === 0 ? (
              <View style={{ flex: 1 }}>
                <AnimatedLottieView
                  autoPlay
                  autoSize
                  source={Images.Guitar}
                  style={{ alignSelf: "center" }}
                />
                <Animatable.Text
                  animation="swing"
                  style={{
                    color: Colors.White,
                    alignSelf: "center",
                    textAlign: "center",
                    fontSize: 25,
                    marginTop: 25,
                  }}
                  iterationCount={5}
                >
                  No data available.
                </Animatable.Text>
              </View>
            ) : (
              <ScrollView style={{ flex: 1 }}>
                <FlatList
                  data={cardData}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id} // Assuming each user has a unique ID
                  contentContainerStyle={styles.listContainer}
                />
              </ScrollView>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SearchSellerScreen;

const styles = StyleSheet.create({
  secondContainer: {},
  firstContainer: {},
  flatlistStyle: { flex: 1 },
  textStyle: {
    textAlign: "center",
    fontSize: fontScaleNormalize(12),
    fontWeight: "600",
  },
  textBoldStyle: {
    fontSize: fontScaleNormalize(22),
    fontWeight: "800",
  },
  textViewStyle: {
    backgroundColor: Colors.Black_10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  listContainer: {
    marginTop: 10,
    // paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: Colors.Black_10,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    marginVertical: 2,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.White,
  },
  email: {
    marginVertical: 2,
    fontSize: 16,
    color: Colors.grey,
  },
  phone: {
    marginVertical: 2,
    fontSize: 16,
    color: Colors.grey,
  },
});
