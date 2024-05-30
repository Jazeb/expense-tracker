import { StyleSheet, View, Text, TextInput, ScrollView, Pressable } from "react-native";

import globalStyles from "../../styles";
import { currentMonth } from "../../shared";
import { incomeSource } from "../../constants";

const IncomeScreen = ({ navigation }) => {
  const income = 10000;
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topHeader}>
        <Text style={globalStyles.topHeaderFont}>Add Income</Text>
      </View>

      <Text style={{ marginLeft: 20, marginTop: 20, paddingBottom: 10, fontSize: 14, fontWeight: "400" }}>
        add income for the month of {currentMonth}
      </Text>
      <Text style={{ marginLeft: 20, marginTop: 20, fontSize: 16 }}>Source</Text>
      <View style={{ ...styles.shortcutBtnViews, marginTop: 10 }}>
        <ScrollView style={{ height: 40 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          {(incomeSource || []).map((item) => {
            // const color = item.id === selectedCategory ? "#38E4C4" : "#EEE";
            const color = "#EEE";
            return (
              <Pressable
                key={item.id}
                // onPress={() => onCategoryPress(item.id)}
                style={{ ...styles.catgoryBtn, backgroundColor: color }}
              >
                <Text>{item.title}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <Text style={{ marginLeft: 20, marginTop: 20, paddingBottom: 10, fontSize: 16 }}>Add Income</Text>
      <TextInput style={styles.new_category_font}></TextInput>

      {/* <Pressable
        disabled={disableAddButton}
        onPress={onAddExpensePress}
        style={{
          backgroundColor: !disableAddButton ? "#38E4C4" : "gray",
          ...styles.add_btn,
        }}
      >
        <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "700" }}>Add</Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  catgoryBtn: {
    height: 35,
    // minWidth: 40,
    // marginTop: 10,
    // marginLeft: 10,
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 3, height: 2 },
    // width: 70,
    paddingHorizontal: 10,
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  shortcutBtnViews: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingLeft: 20,
    justifyContent: "flex-start",
  },
  new_category_font: {
    marginTop: 8,
    borderColor: "#FFF",
    width: "90%",
    height: 50,
    backgroundColor: "#eee",
    fontSize: 16,
    borderRadius: 10,
    paddingLeft: 10,
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
});

export default IncomeScreen;
