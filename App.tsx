import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import AppContainer from "./src/navigation/stack-navigators/appContainer";
import { notifcationServices } from "./src/service/common/fcmToken";

const App = () => {
  useEffect(() => {
    notifcationServices();
  }, []);

  return <AppContainer></AppContainer>;
};

export default App;

const styles = StyleSheet.create({});
