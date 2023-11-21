import { Text, Image, View, StyleSheet, Pressable, ScrollView, TouchableOpacity, Alert } from "react-native";
import { getAllCategories, getSelectedCategories } from "../../storage/database";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import globalStyle from "../../styles";
import { useNavigation } from "@react-navigation/native";
const addExpenseImage = require("assets/plus.png");
import { BottomSheetModalProvider, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";

// const AddNewCategory = () => {
//   const bottomSheetRef = useRef(null);
//   const snapPoints = useMemo(() => ["25%", "50%"], []);

//   const handleSheetChanges = useCallback((index) => {
//     console.log("handleSheetChanges", index);
//   }, []);

//   // bottomSheetRef.current.close();

//   return (
//     <View style={styles.container}>
//       <BottomSheet
//         ref={bottomSheetRef}
//         index={1}
//         enablePanDownToClose={true}
//         snapPoints={snapPoints}
//         onChange={handleSheetChanges}
//       >
//         <View style={styles.contentContainer}>
//           <Text>Awesome 🎉</Text>
//         </View>
//       </BottomSheet>
//     </View>
//   );
// };

const CategoryItems = ({ category }) => {
  const navigation = useNavigation();
  const onCategorySelected = (category) => navigation.navigate("AddNewBudgetScreen", { selectedCategory: category });

  return (
    <Pressable onPress={() => onCategorySelected(category)}>
      <View style={styles.categoryItems}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          {/* <Image source={require(category.icon)} /> */}
          <Text style={styles.categoryItemFont}>{category.title}</Text>
        </View>
        <Image style={styles.plusBtn} source={addExpenseImage} />
      </View>
    </Pressable>
  );
};
const SelectCategoryScreen = ({}) => {
  const [categories, setCategories] = useState([]);
  const [addNewCategory, setAddNewCategory] = useState(false);

  const fetchCategories = async () => {
    const _allCategories = await getAllCategories();

    const _selectedCategories = await getSelectedCategories();
    if (!_selectedCategories) setCategories(_allCategories);
    else {
      const _selectCategoryIds = _selectedCategories.map((c) => c.id);
      const _unselectedCategories = _allCategories.filter((c) => !_selectCategoryIds.includes(c.id));
      setCategories(_unselectedCategories);
    }
  };

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const onAddNewCategoryPress = () => {
    // const addNewCategory();
  };
  return (
    <>
      <View style={globalStyle.container}>
        <View style={globalStyle.topHeader}>
          <Text style={globalStyle.topHeaderFont}>Add New Budget</Text>
        </View>

        <View style={styles.title}>
          <Text style={{ fontSize: 18 }}>select category</Text>

          <Pressable style={styles.pressable} onPress={() => setAddNewCategory(true)}>
            <Image style={{ width: 20, height: 20 }} source={require("../../assets/plus_white.png")}></Image>
            <Text style={{ color: "#FFF", fontWeight: "600" }}>Add New Category</Text>
          </Pressable>
        </View>

        {/* category items */}
        <ScrollView style={{ flex: 1, flexDirection: "column" }}>
          {(categories || []).map((category) => (
            <CategoryItems category={category} />
          ))}
        </ScrollView>
      </View>

      {addNewCategory && (
        <>
          <TouchableOpacity style={styles.bottomsheet_touchable} onPress={() => setAddNewCategory(false)} />
          <BottomSheet ref={bottomSheetRef} index={1} enablePanDownToClose={true} snapPoints={snapPoints}>
            <View style={styles.contentContainer}>
              <Text>Enter Category</Text>
              <TextInput style={styles.new_category_font}></TextInput>

              <Text style={{ marginTop: 40 }}>Enter Sub Category</Text>
              <TextInput style={styles.new_category_font}></TextInput>
              <Pressable
                // disabled={disableAddButton}
                onPress={onAddNewCategoryPress}
                style={{ backgroundColor: "#38E4C4", ...styles.add_newcategory_btn }}
              >
                <Text style={{ fontSize: 20, fontWeight: "700" }}>Add</Text>
              </Pressable>
              {/* <TextInput style={{ marginTop: 30 }} placeholder="Enter SubCategory"></TextInput> */}
              {/* <Text>Category 🎉</Text>
              <TouchableOpacity onPress={() => setAddNewCategory(false)}>
                <Text>Submit</Text>
              </TouchableOpacity> */}
            </View>
          </BottomSheet>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  bottomsheet_touchable: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#00000099" },
  contentContainer: {
    flex: 1,
    marginLeft: 20,
    paddingVertical: 30,
    flexDirection: "column",
    // justifyContent: "",
    // alignItems: "flex-start",
  },
  plusBtn: {
    width: 50,
    height: 50,
  },
  categoryItemFont: {
    fontSize: 18,
    fontWeight: 400,
    color: "#4F4F4F",
    marginLeft: 13,
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: 160,
    height: 28,
    backgroundColor: "#38E4C4",
  },
  title: {
    paddingBottom: 20,
    flexDirection: "row",
    marginTop: 26,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  categoryItems: {
    padding: 10,
    marginBottom: 7,
    borderWidth: 2,
    borderRadius: 5,
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderColor: "#DBDBDB",

    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "93%",
    height: 65,
  },
  new_category_font: {
    marginTop: 10,
    borderColor: "#FFF",
    width: "90%",
    height: 50,
    backgroundColor: "#eee",
    fontSize: 16,
    borderRadius: 10,
  },
  add_newcategory_btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 46,
    marginTop: 25,
    borderRadius: 24,
  },
});

export default SelectCategoryScreen;
