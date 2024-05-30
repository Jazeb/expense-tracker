import { Text, View, StyleSheet, Image, Pressable, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import BottomSheet from "@gorhom/bottom-sheet";

import { updateBudgetAmount, getSelectedCategories, storeData } from "../../storage/database";
import globalStyles from "../../styles";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { currentMonth, formatCurrency } from "../../shared";

import checkedButton from "../../assets/checked.png";
import editButton from "../../assets/edit-category.png";
import deleteButton from "../../assets/delete.png";

const income = 100000;

const budgetPercent = (budget, income) => {
  if (!budget) return 0;
  const amnt = (budget / income) * 100;
  return +(amnt / 100).toFixed(1);
};

// const editSelectedCategory = () => {
// const snapPoints = useMemo(() => ["25%"], []);
// const bottomSheetRef = useRef(null);

//   return (
//     <>
//       <BottomSheet
//         ref={bottomSheetRef}
//         index={0}
//         enablePanDownToClose={true}
//         snapPoints={snapPoints}
//       >
//         <View>
//           <Text>Jazeb</Text>
//         </View>
//       </BottomSheet>
//     </>
//   );
// };

const CategoryItem = ({ setSelectedCategories, setEditingCategoryId, category, setopenBottomSheet }) => {
  const deleteFromList = async (categoryId) => {
    const selectedCategories = await getSelectedCategories();
    const filteredCategories = selectedCategories.filter((c) => c.id !== categoryId);
    await storeData("selectedCategories", filteredCategories);
    return setSelectedCategories(filteredCategories);
  };

  const updateEditedCategories = async () => {
    console.log("##################################");
    console.log("##################################");
    console.log("##################################");
    const categories = await getSelectedCategories();
    console.log("setting catrgories", categories);
    categories && setSelectedCategories(categories);
  };

  const onDeleteCategory = (categoryId) =>
    Alert.alert("Deleting Category", "Do you want to delete this category?", [
      { text: "No" },
      { text: "Yes", onPress: () => deleteFromList(categoryId) },
    ]);

  return (
    <View style={styles.categoryItems}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image style={styles.checkedBtn} source={checkedButton} />
        <View style={{ flexDirection: "column", alignSelf: "flex-start", marginLeft: 12 }}>
          <Text style={styles.categoryItemFont}>{category.title}</Text>
          <Text style={{ fontSize: 12, marginTop: 4 }}>{formatCurrency(category.budgetAmount)} per month</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        {/* edit button */}
        <Pressable
          onPress={() => {
            setopenBottomSheet(true);
            setEditingCategoryId(category.id);
          }}
        >
          <Image style={styles.editDelBtn} source={editButton} />
        </Pressable>

        {/* delete button */}
        <Pressable onPress={() => onDeleteCategory(category.id)}>
          <Image style={styles.editDelBtn} source={deleteButton} />
        </Pressable>
      </View>
    </View>
  );
};

const EditCategory = ({ selectedCategories, setSelectedCategories, editingCategoryId, setopenBottomSheet }) => {
  console.log("on top ...", { editingCategoryId });
  const snapPoints = useMemo(() => ["25%"], []);
  const bottomSheetRef = useRef(null);

  // const [selectedCategories, setSelectedCategories] = useState([]);
  const [newBudgetAmount, setNewBudgetAmount] = useState({ id: "", budgetAmount: 0 });

  const _fetchSelectdCategories = async () => {
    const _selectedCategories = await getSelectedCategories();
    _selectedCategories && setSelectedCategories(_selectedCategories);
  };

  const onEditedBudget = async () => {
    if (newBudgetAmount.id) {
      await updateBudgetAmount(newBudgetAmount);
      const res = await getSelectedCategories();
      res && setSelectedCategories(res);
    }
    return setopenBottomSheet(false);
  };

  useEffect(() => {
    _fetchSelectdCategories();
  }, []);

  const category = selectedCategories.find((c) => c.id === editingCategoryId);
  console.log("Got it here ......", category);
  if (!category) return <></>;

  return (
    <>
      <TouchableOpacity style={styles.bottomsheet_touchable} onPress={() => setopenBottomSheet(false)} />

      <BottomSheet ref={bottomSheetRef} index={0} enablePanDownToClose={true} snapPoints={snapPoints}>
        <View style={styles.contentContainer}>
          <TextInput
            onChangeText={(newBudgetAmount) => setNewBudgetAmount({ id: category.id, budgetAmount: newBudgetAmount })}
            style={styles.edit_budget_font}
            value={newBudgetAmount.budgetAmount}
            defaultValue={category.budgetAmount}
          ></TextInput>
          <Pressable onPress={onEditedBudget} style={styles.edit_budget_done}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Update Budget</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </>
  );
};

const BudgetScreen = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [totalBudgetAmount, setBudgetAmount] = useState(0);
  const [openBottomSheet, setopenBottomSheet] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      console.log("in use focus effect");
      const _fetchSelectdCategories = async () => {
        const _selectedCategories = await getSelectedCategories();
        if (_selectedCategories) {
          const _totalBudgetAmount = _selectedCategories.reduce((sum, c) => +sum + +c.budgetAmount, 0);

          setSelectedCategories(_selectedCategories);
          setBudgetAmount(_totalBudgetAmount);
        }
      };

      _fetchSelectdCategories();
    }, [])
  );

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
        <Text style={{ fontSize: 30, fontWeight: "500", paddingLeft: 20 }}>Budget</Text>
        <Text style={{ marginTop: 10, color: "#191819", fontSize: 16 }}>{currentMonth}</Text>

        <Pressable style={styles.pressable} onPress={() => navigation.navigate("SelectCategoryScreen")}>
          <Image style={{ width: 20, height: 20 }} source={require("../../assets/plus_white.png")}></Image>
          <Text style={{ paddingLeft: 6, color: "#FFF", fontWeight: "700" }}>Add Budget</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={{ alignSelf: "flex-end", marginRight: 25, fontSize: 12 }}>
          {formatCurrency(income - totalBudgetAmount)}
        </Text>
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
          {formatCurrency(totalBudgetAmount)} of {formatCurrency(income)}
        </Text>
      </View>

      {/* category items */}
      <ScrollView style={{ marginTop: 15 }}>
        {(selectedCategories || []).map((_category) => (
          <CategoryItem
            key={_category.id}
            setSelectedCategories={setSelectedCategories}
            setEditingCategoryId={setEditingCategoryId}
            category={_category}
            setopenBottomSheet={setopenBottomSheet}
          />
        ))}
      </ScrollView>

      {openBottomSheet && (
        <EditCategory
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          editingCategoryId={editingCategoryId}
          setopenBottomSheet={setopenBottomSheet}
        />
      )}
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
    fontSize: 14,
    fontWeight: "500",
    color: "#4F4F4F",
    // marginLeft: 12,
    // alignSelf: "flex-start",
  },
  categoryItems: {
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 10,
    shadowOffset: {
      width: 3,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderColor: "#DBDBDB",

    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    height: 80,
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
  editDelBtn: { width: 20, height: 20, alignSelf: "center" },
  edit_budget_font: {
    marginTop: 8,
    borderColor: "#FFF",
    width: "90%",
    height: 50,
    backgroundColor: "#eee",
    fontSize: 16,
    borderRadius: 10,
    paddingLeft: 10,
  },
  edit_budget_done: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 46,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#38E4C4",
  },
  contentContainer: {
    flex: 1,
    marginLeft: 20,
    paddingVertical: 20,
    flexDirection: "column",
    // justifyContent: "",
    // alignItems: "flex-start",
  },
  bottomsheet_touchable: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#00000099" },
});

export default BudgetScreen;
