import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as Progress from "react-native-progress";

import { getSelectedCategories } from "../../storage/database";
import globalStyles from "../../styles";
import { ScrollView } from "react-native-gesture-handler";

const currentMonth = new Date().toLocaleString("en-us", {
  month: "short",
  year: "numeric",
});

const income = 80000;

const budgetPercent = (budget, income) => {
  if (!budget) return 0;
  const amnt = (budget / income) * 100;
  return +(amnt / 100).toFixed(1);
};
// const progressBarPercent = +(budget / 100).toFixed(1);

const BudgetScreen = ({ navigation }) => {
  const editBudget = () => alert("Alert");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [totalBudgetAmount, setBudgetAmount] = useState(0);

  useFocusEffect(() => {
    const fetchSelectdCategories = async () => {
      try {
        const _selectedCategories = await getSelectedCategories();
        const _totalBudgetAmount = _selectedCategories.reduce((sum, c) => +sum + +c.budgetAmount, 0);

        setSelectedCategories(_selectedCategories);
        setBudgetAmount(_totalBudgetAmount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSelectdCategories();
  });

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topHeader}>
        <Text style={globalStyles.topHeaderFont}>Set Monthly Goal</Text>
      </View>

      {/* create budget screen */}
      {/* <Pressable style={styles.createBudgetBtnView} onPress={() => navigation.navigate("SelectCategoryScreen")}>
        <Text style={{ fontSize: 22, fontWeight: "500" }}>Create New Budget</Text>
      </Pressable> */}

      <View
        style={{
          flexDirection: "row",
          width: "90%",
          paddingTop: 25,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "500",
            paddingLeft: 20,
          }}
        >
          Budget
        </Text>
        <Text
          style={{
            // marginLeft: 10,
            marginTop: 10,
            color: "#191819",
            fontSize: 16,
          }}
        >
          {currentMonth}
        </Text>

        <Pressable style={styles.pressable} onPress={() => navigation.navigate("SelectCategoryScreen")}>
          <Image style={{ width: 20, height: 20 }} source={require("../../assets/plus_white.png")}></Image>
          <Text style={{ paddingLeft: 6, color: "#FFF", fontWeight: "700" }}>Add Budget</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={{ alignSelf: "flex-end", marginRight: 25, fontSize: 12 }}>{income - totalBudgetAmount}</Text>
        <Progress.Bar
          width={350}
          height={15}
          color="#38E4C4"
          style={styles.total_budget}
          progress={budgetPercent(totalBudgetAmount, income)}
        />
        <Text
          style={{
            fontSize: 11,
            marginLeft: 30,
            alignSelf: "flex-start",
            marginTop: 3,
            color: "#000",
          }}
        >
          {totalBudgetAmount} of {income}
        </Text>
      </View>

      <ScrollView style={{ marginTop: 15 }}>
        {(selectedCategories || []).map((_category) => {
          return (
            <View style={styles.categoryItems}>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <Image style={styles.checkedBtn} source={require("../../assets/checked.png")} />
                <Text style={styles.categoryItemFont}>{_category.title}</Text>
                <Text style={{ marginLeft: 13, fontSize: 12, alignSelf: "center" }}>
                  Rs {_category.budgetAmount} per month
                </Text>
              </View>
              <Pressable onPress={editBudget}>
                <Image style={styles.plusBtn} source={require("../../assets/edit-category.png")} />
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  rectangle: {
    height: "25%",
    backgroundColor: "#38E4C4",
  },
  total_budget: {
    alignSelf: "flex-start",
    marginLeft: 20,
    // marginTop: 30,
    color: "#E2E2E2",
    borderRadius: 12,
  },
  createBudgetBtnView: {
    borderRadius: 10,
    backgroundColor: "#38E4C4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    marginTop: 15,
    height: 60,
  },
  checkedBtn: {
    width: 35,
    height: 35,
    alignSelf: "center",
  },
  categoryItemFont: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4F4F4F",
    marginLeft: 12,
    alignSelf: "center",
  },
  categoryItems: {
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 10,
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderColor: "#DBDBDB",

    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    height: 60,
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: 120,
    height: 25,
    backgroundColor: "#38E4C4",
  },
});

export default BudgetScreen;
