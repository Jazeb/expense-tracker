import { Text, View, StyleSheet, Pressable } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

import { allCategories } from "../../constants";
import * as storage from "../../storage/database";
import globalStyles from "../../styles";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  week: {
    dow: 0, // Sunday
  },
});

const AddNewExpenseScreen = ({ navigation }) => {
  const today = dayjs();

  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onCategoryPress = (id) => {
    const _category = allCategories.find((c) => c.id == id);
    setSelectedCategory(id);

    if (_category?.subcategories.length) {
      setSelectedSubCategories(_category.subcategories);
    } else setSelectedSubCategories([]);
  };

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);

  const [selectedTag, setTag] = useState(null);

  const [selectedDay, setDay] = useState(today);
  const onDayPress = (index) => setDay(index);

  const startOfWeek = dayjs().startOf("week");
  const daysOfWeek = Array.from({ length: 7 }, (_, index) => startOfWeek.add(index, "day"));

  const [notes, setNotes] = useState(null);
  // const onDayPress = (notes) => setNotes(notes);

  const disableAddButton = !selectedPrice || !selectedCategory;

  const _fetchSelectedCategories = async () => {
    const _selectedCategories = await storage.getSelectedCategories();
    if (_selectedCategories) setSelectedCategories(_selectedCategories);
  };

  const onAddExpensePress = async () => {
    const input = {
      categoryId: selectedCategory,
      spent: selectedPrice,
      notes: notes,
      tag: selectedTag,
      date: selectedDay, // daysOfWeek starts from 0
    };

    await storage.addExpense(input);
    await storage.getExpenses("11/2023");

    return navigation.navigate("Expense");
  };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    _fetchSelectedCategories();
  }, []);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topHeader}>
        {/* <Pressable style={{}} onPress={() => alert("ALERT")}>
          <Image style={{ width: 30, height: 30 }} source={require("assets/back.png")}></Image>
        </Pressable> */}
        <Text style={{ ...globalStyles.topHeaderFont }}>Add New Expense</Text>
      </View>

      {/* expense input */}
      <View style={globalStyles.amount_view_style}>
        <Text style={globalStyles.rs}>PKR</Text>
        <TextInput
          ref={inputRef}
          style={globalStyles.input}
          keyboardType="numeric"
          onChangeText={(amount) => setSelectedPrice(+amount)}
        ></TextInput>
      </View>

      {/* category buttons */}
      <Text style={{ ...styles.category_view }}>select category</Text>
      <View style={{ ...styles.shortcutBtnViews, marginTop: 10 }}>
        <ScrollView style={{ height: 40 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          {(selectedCategories || []).map((item) => {
            const color = item.id === selectedCategory ? "#38E4C4" : "#EEE";
            return (
              <Pressable
                key={item.id}
                onPress={() => onCategoryPress(item.id)}
                style={{ ...styles.catgoryBtn, backgroundColor: color }}
              >
                <Text>{item.title}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* sub category */}
      <Text style={styles.category_view}>select subcategory</Text>
      <View style={{ ...styles.shortcutBtnViews, paddingTop: 10 }}>
        <ScrollView style={{ height: 40 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          {(selectedSubCategories ?? []).map((tag) => {
            return (
              <Pressable
                onPress={() => setTag(tag.id)}
                style={[styles.catgoryBtn, { backgroundColor: tag.id === selectedTag ? "#38E4C4" : "#eee" }]}
              >
                <Text style={{ padding: 9, marginLeft: 6 }}>{tag.title}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ marginTop: 20, paddingLeft: 20, flexDirection: "column", alignSelf: "flex-start" }}>
        <Text>Notes</Text>
        <TextInput onChangeText={(notes) => setNotes(notes)} style={styles.comment_input_text}></TextInput>
      </View>

      {/* day selection */}
      <View style={{ paddingLeft: 15, paddingTop: 20 }}>
        <Text style={{ paddingTop: 10 }}>select day</Text>
      </View>

      <View style={styles.day}>
        {daysOfWeek.map((day) => {
          const dayFormated = day.format("ddd");
          const selectedDayFormatted = dayjs(selectedDay).format("ddd");
          return (
            <Pressable key={day} onPress={() => onDayPress(day)}>
              <Text
                style={{
                  color: selectedDayFormatted == dayFormated ? "#38E4C4" : "#313131",
                  fontSize: 20,
                  marginLeft: 10,
                  fontWeight: "400",
                }}
              >
                {dayFormated}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ paddingTop: 20, flexDirection: "row", justifyContent: "center" }}>
        <Pressable
          disabled={disableAddButton}
          onPress={onAddExpensePress}
          style={{
            backgroundColor: !disableAddButton ? "#38E4C4" : "gray",
            ...styles.add_btn,
          }}
        >
          <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "700" }}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  headerView: {
    padding: 80,
    flexDirection: "row",
    justifyContent: "center",
  },
  headerFont: {
    fontSize: 24,
  },
  shortcutBtnViews: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingLeft: 20,
    justifyContent: "flex-start",
  },
  category_view: {
    fontSize: 16,
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 20,
  },
  comment_input_text: {
    marginTop: 5,
    height: 50,
    width: 340,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
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
  day: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10,
  },
  input: {
    marginLeft: 10,
    borderBottomWidth: 3,
    alignItems: "center",
    fontSize: 64,
    fontWeight: 800,
    color: "#4D8067",
  },
  add_btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 46,

    borderRadius: 24,
  },
});

export default AddNewExpenseScreen;
