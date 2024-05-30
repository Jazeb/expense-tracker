import { useFocusEffect } from "@react-navigation/native";
import { Text, Image, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { getExpenses } from "../../storage/database";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { allCategories } from "../../constants";
import globalStyles from "../../styles";
import { currentMonth, formatCurrency } from "../../shared";

const ExpenseScreen = ({ navigation }) => {
  const [recentExpenses, setRecentExpenses] = useState([]);

  const _fetchRecentExpenses = async () => {
    try {
      const currentMonthExpenses = await getExpenses("11/2023");
      if (currentMonthExpenses) {
        return setRecentExpenses(currentMonthExpenses);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("In callback");
      let isActive = true;
      isActive && _fetchRecentExpenses();
      return () => (isActive = false);
    }, [])
  );

  const onAddExpensePress = () => navigation.navigate("addNewExpenseScreen");

  return (
    <>
      <View style={globalStyles.container}>
        <View style={globalStyles.topHeader}>
          <Text style={globalStyles.topHeaderFont}>Add Expense</Text>
        </View>

        <View style={styles.title}>
          <Text style={styles.titleFont}>Expenses</Text>

          <Pressable style={styles.pressable} onPress={onAddExpensePress}>
            <Image style={{ width: 20, height: 20 }} source={require("../../assets/plus_white.png")}></Image>
            <Text style={{ paddingLeft: 10, color: "#FFF", fontWeight: "700" }}>Add Expense</Text>
          </Pressable>
        </View>

        <Text
          style={{
            marginLeft: 20,
            marginTop: 20,
            paddingBottom: 10,
            fontSize: 16,
          }}
        >
          {currentMonth} transactions
        </Text>

        <ScrollView>
          {recentExpenses?.map((expense) => {
            const category = allCategories.filter((c) => c.id == expense.categoryId);
            console.log({ category, expense });

            const subcategory = category[0]?.subcategories.filter((c) => c.id == expense.tag);

            return (
              <View style={styles.recent_expenses}>
                <View style={{ flexDirection: "row" }}>
                  <Image style={styles.image_style} source={require("../../assets/food.png")}></Image>
                  <View style={{ flexDirection: "column", paddingLeft: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: "400" }}>{category[0].title}</Text>
                    <Text style={{ fontSize: 12, fontWeight: "300" }}>{subcategory[0].title}</Text>

                    {expense.notes && <Text style={{ fontSize: 12, fontWeight: "100" }}>{expense.notes}</Text>}

                    <Text style={{ fontSize: 12, fontWeight: "100" }}>{dayjs(expense.date).format("DD-ddd-MMM")}</Text>
                  </View>
                </View>
                <Text style={styles.transactions}>{formatCurrency(expense.spent)}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: 140,
    height: 25,
    backgroundColor: "#38E4C4",
  },
  transactions: {
    fontSize: 16,
    color: "#38E4C4",
    fontWeight: "500",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  recent_expenses: {
    padding: 10,
    marginBottom: 6,
    borderWidth: 2,
    borderRadius: 10,
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderColor: "#DBDBDB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    width: "93%",
  },
  title: {
    flexDirection: "row",
    width: "90%",
    paddingTop: 25,
    alignItems: "center",
    alignSelf: "flex-start",
    justifyContent: "space-between",
  },
  titleFont: {
    fontSize: 30,
    fontWeight: "500",
    paddingLeft: 20,
  },
  image_style: {
    alignSelf: "center",
  },
});

export default ExpenseScreen;
