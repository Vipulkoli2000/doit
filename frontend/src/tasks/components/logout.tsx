import { Alert } from "react-native";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
const Logout = (props) => {
  const isFocused = useIsFocused(); // ----- edit
  const Logout1 = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () =>
          props.navigation.navigate(
            "Tabs",

            {
              screen: "HomeScreen",
            }
          ),
      },
      { text: "Yes", onPress: () => props.navigation.navigate("Login") },
    ]);
  };
  useEffect(() => {
    Logout1();
  }, [isFocused]); // ----- edit
};
export default Logout;
