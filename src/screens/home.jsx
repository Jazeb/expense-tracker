import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Text, Image, View, StyleSheet, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import * as Progress from "react-native-progress";

import incomeImage from "assets/income.png";
import expenseImage from "assets/expense.png";
import addExpenseBtn from "assets/addExpenseBtn.png";

import { getSelectedCategories, getExpenses } from "../../storage/database";
import globalStyles from "../../styles.js";
import { allCategories, periods } from "../../constants";

import { currentMonth, formatCurrency } from "../../shared";

const Periods = () => {
  const [selectedPeriod, setPeriod] = useState();
  const onPressPeriod = (id) => setPeriod(id);

  return (
    <View style={styles.period_view}>
      {periods.map((p) => {
        return (
          <Pressable
            onPress={() => onPressPeriod(p.id)}
            style={[
              styles.period,
              {
                backgroundColor: p.id == selectedPeriod ? "#38E4C4" : "#FFF",
              },
            ]}
          >
            <Text style={styles.period_font}>{p.title}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const Budget = () => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-start", marginLeft: 20, marginTop: 10 }}>
      <Text
        style={{
          marginTop: 13,
          color: "#191819",
          fontSize: 28,
          fontWeight: "700",
        }}
      >
        Budget
      </Text>
      <Text
        style={{
          marginLeft: 10,
          marginTop: 25,
          color: "#191819",
          fontSize: 16,
        }}
      >
        {currentMonth}
      </Text>
    </View>
  );
};

const TotalExpenseByCategory = ({ c, progress }) => {
  console.log("QQQASSSSSSSSSSSSSSSSSSSSSSSSSSSSS");

  return (
    <View style={styles.transactions_history}>
      <Image source={incomeImage} style={{ width: 50, height: 50 }} />
      <View style={{ marginTop: 5, width: "75%" }}>
        <View
          style={{
            marginLeft: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>{c.title}</Text>
          <Text
            style={{
              color: "#38E4C4",
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            {formatCurrency(c.budgetAmount)}
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginLeft: 10 }}>
          <Progress.Bar
            width={270}
            height={10}
            color="#38E4C4"
            style={styles.transaction_progressbar}
            progress={progress}
          />
        </View>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const addExpense = () => navigation.navigate("addNewExpenseScreen");
  const isFocused = useIsFocused();

  const [budgetedAmount, setBudgetedAmount] = useState(0);
  const [recentTxnCategories, setRecentTxnCategories] = useState([]);
  const [currentMonthExpense, setCurrentMonthExpenses] = useState(0);
  const [expenseByCategory, setExpenseByCategory] = useState([]);

  const income = 130000;

  // const [remainingAmount, setRemainingAmount] = useState(0);
  // const _setRemaingAmount = async () => {
  //   const _selectedCategories = await getSelectedCategories();

  //   if (_selectedCategories) {
  //     const _budgetedAmount = _selectedCategories.reduce((sum, c) => sum + +c.budgetAmount, 0);
  //     return setRemainingAmount(_budgetedAmount - currentMonthExpense);
  //   }
  // };

  const _setBudgetedAmount = async () => {
    const _selectedCategories = await getSelectedCategories();

    if (_selectedCategories) {
      const _budgetedAmount = _selectedCategories.reduce((sum, c) => sum + +c.budgetAmount, 0);
      return setBudgetedAmount(_budgetedAmount);
    }
  };

  const _recentTxnCategories = async () => {
    const _selectedCategories = await getSelectedCategories();

    if (_selectedCategories) {
      console.log("yes found categories");
      setRecentTxnCategories(_selectedCategories);
    }
  };

  const _setCurrentMonthExpenses = async () => {
    const _currentMonthExpenses = await getExpenses("11/2023"); // current month
    if (_currentMonthExpenses) {
      const total = _currentMonthExpenses.reduce((sum, exp) => sum + +exp.spent, 0);
      setCurrentMonthExpenses(total);
    }
  };

  const _setCategoryExpenses = async () => {
    const _currentMonthExpenses = await getExpenses("11/2023"); // current month

    if (_currentMonthExpenses) {
      const expenseByCategory = new Array();
      for (const _category of allCategories) {
        const current = _currentMonthExpenses.filter((e) => e.categoryId == _category.id);

        if (!current.length) continue;

        const totalSpent = current.reduce((sum, c) => sum + +c.spent, 0);

        expenseByCategory.push({ totalSpent, categoryId: _category.id });
      }

      setExpenseByCategory(expenseByCategory);
    }
  };

  useFocusEffect(() => {
    // _setRemaingAmount();
    _setBudgetedAmount();
    _setCurrentMonthExpenses();
  });

  useEffect(() => {
    if (isFocused) {
      _setCategoryExpenses();
      _recentTxnCategories();
    }
  }, [isFocused]);

  const calculatePercent = (category, expense) => {
    if (!category) return 0;
    return +(((category.totalSpent / expense) * 100) / 100).toFixed(1);
  };

  const calculateTotalSpentPercent = () => {
    if (!currentMonthExpense || !budgetedAmount) return 0;
    return +(((currentMonthExpense / budgetedAmount) * 100) / 100).toFixed(1);
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topHeader}></View>

      {/* income expense info */}
      <View style={styles.income_expense}>
        <View style={styles.income_expense_layout}>
          {/* income view */}

          <Image source={incomeImage} style={styles.income_expense_layout.image} />

          <View>
            <Text style={styles.income_expense_font}>Income</Text>
            <Text
              style={{
                marginTop: 5,
                color: "#191819",
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              {formatCurrency(income)}
            </Text>
          </View>

          {/* expense view */}

          <Image source={expenseImage} style={styles.income_expense_layout.image} />

          {/* text view */}
          <View>
            <Text style={styles.income_expense_font}>Expense</Text>
            <Text
              style={{
                marginTop: 5,
                color: budgetedAmount >= income ? "red" : "#191819",
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              {formatCurrency(budgetedAmount)}
            </Text>
          </View>
        </View>
      </View>

      {/* budget */}
      <Budget />

      <View>
        <Progress.Bar
          width={340}
          height={15}
          color="#38E4C4"
          style={styles.total_expense_bar}
          progress={calculateTotalSpentPercent()}
          // progress={(currentMonthExpense / budgetedAmount) * 100}
        />
        <Text
          style={{
            fontSize: 11,
            alignSelf: "center",
            marginTop: 3,
            color: "#000",
          }}
        >
          {formatCurrency(currentMonthExpense)} of {formatCurrency(budgetedAmount)} spent
        </Text>
      </View>

      {/* <RemainingAmount /> */}
      {/* <View
        style={{
          flexDirection: "row",
          width: "94%",
          justifyContent: "flex-end",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            marginTop: 3,
            color: "#000",
          }}
        >
          remaining Rs {remainingAmount}
        </Text>
      </View> */}

      {/* render periods */}
      {/* <Periods /> */}

      {/* recent transactions */}
      <Text style={{ marginLeft: 25, paddingTop: 30, paddingBottom: 20 }}>recent spendings by category</Text>

      {/* expense progress bar */}
      {console.log("#############")}

      <View style={{ flex: 1, position: "relative" }}>
        <ScrollView>
          {recentTxnCategories?.map((c) => {
            const _expenseByCategory = expenseByCategory.find((el) => el.categoryId == c.id);

            const progress = calculatePercent(_expenseByCategory, c.budgetAmount);

            return <TotalExpenseByCategory c={c} progress={progress} />;
          })}
        </ScrollView>
        <Pressable style={{ borderRadius: 50, position: "absolute", bottom: 0, right: 10 }} onPress={addExpense}>
          <Image style={{ width: 60, height: 60 }} source={addExpenseBtn} />
        </Pressable>
      </View>

      {/* add new expense */}
      <View style={styles.addExpenseBtn}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  addExpenseBtn: {
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  transactions_history: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingTop: 10,
  },
  total_expense_bar: {
    alignSelf: "center",
    marginTop: 10,
    color: "#E2E2E2",
    borderRadius: 12,
  },
  transaction_progressbar: {
    alignSelf: "center",
    marginTop: 8,
    color: "#E2E2E2",
    borderRadius: 12,
  },
  period_view: {
    flexDirection: "row",
    alignSelf: "center",
    // backgroundColor: "#E2E2E2",
    marginTop: 20,
    width: "90%",
    height: 39,
    borderRadius: 25,
  },
  period: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    width: "33.5%",
    height: 39,
  },
  period_font: {
    fontSize: 16,
    color: "#191819",
    justifyContent: "center",
  },
  income_expense_layout: {
    flexDirection: "row",
    alignItems: "center",
    image: { width: 40, height: 40, margin: 10 },
  },
  income_expense_font: {
    fontSize: 18,
    fontWeight: "700",
    color: "#38E4C4",
  },
  progressBar: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 15,
    height: 20,
    width: "90%",
    color: "#E2E2E2",
    backgroundColor: "#E2E2E2",
    borderRadius: 12,
  },
  income_expense: {
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FFF",
    width: "90%",
    alignSelf: "center",
    height: "15%",
    // alignSelf: "center",
    marginTop: -55,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 3, height: 1 },
    shadowOpacity: 3.2,
    shadowRadius: 3,
  },
});

export default HomeScreen;
