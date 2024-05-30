import { useState, useRef, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, Pressable } from "react-native";
import { newSelectedCategory } from "../../storage/database";
import globalStyles from "../../styles";

const SelectCategoryScreen = ({ navigation, route }) => {
  const { selectedCategory } = route.params;
  const [budgetAmount, setBudgetAmont] = useState(0);

  const addBudget = async () => {
    selectedCategory.budgetAmount = budgetAmount;
    await newSelectedCategory(selectedCategory);
    navigation.popToTop();
  };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topHeader}>
        <Text style={globalStyles.topHeaderFont}>{selectedCategory.title}</Text>
      </View>

      <View style={{ flexDirection: "row", alignSelf: "center", paddingTop: 20 }}>
        <Text style={{ fontSize: 16, color: "#5C5959" }}>average expense per month for November</Text>
      </View>

      {/* budget input */}
      <View style={globalStyles.amount_view_style}>
        <Text style={globalStyles.rs}>Rs</Text>
        <TextInput
          ref={inputRef}
          onChangeText={(amount) => setBudgetAmont(amount)}
          style={globalStyles.input}
          keyboardType="numeric"
        />
      </View>

      <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end" }}>
        <Pressable
          disabled={!+budgetAmount}
          onPress={addBudget}
          style={{ ...styles.pressable, backgroundColor: +budgetAmount ? "#38E4C4" : "grey" }}
        >
          <Text style={{ alignContent: "center", color: "#000", fontSize: 24 }}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // input_style: {
  //   paddingTop: 10,
  //   width: "70%",
  //   alignSelf: "center",
  //   borderBottomColor: "#4D8067",
  //   borderBottomWidth: 3,
  //   flexDirection: "row",
  //   borderStyle: "solid",
  //   justifyContent: "center",
  //   borderBottomWidth: 5,
  // },
  input_font: {
    fontSize: 64,
    color: "#4D8067",
    fontWeight: "700",
  },
  pressable: {
    width: "90%",
    height: 66,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    marginBottom: 30,
    borderRadius: 8,
  },
});

export default SelectCategoryScreen;
