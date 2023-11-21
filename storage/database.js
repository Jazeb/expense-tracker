import AsyncStorage from "@react-native-async-storage/async-storage";
import { allCategories } from "../constants";

const getData = (key) =>
  new Promise(async (resolve, reject) =>
    AsyncStorage.getItem(key)
      .then((data) => resolve(data ? JSON.parse(data) : null))
      .catch((err) => reject(err))
  );

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    return await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getAllCategories = () =>
  new Promise(
    // (resolve) => resolve(allCategories)
    getData("categories")
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  );

export const getSelectedCategories = () =>
  new Promise((resolve, reject) =>
    getData("selectedCategories")
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  );

export const updateSelectedCategories = async (data) => {
  const key = "selectedCategories";
  const _selectedCategories = await getData(key);

  if (_selectedCategories && _selectedCategories.length) {
    _selectedCategories.push(data);

    return _selectedCategories && (await storeData(key, _selectedCategories));
  } else {
    const categories = new Array(data);

    return await storeData(key, categories);
  }
};

export const deleteData = (key) =>
  new Promise((resolve, reject) =>
    AsyncStorage.removeItem(key)
      .then((data) => resolve(data ? JSON.parse(data) : null))
      .catch((err) => reject(err))
  );

export const initializeCategories = async () => {
  console.log("Categories added ================");
  return await storeData("categories", allCategories);
};

export const addExpense = async (input) => {
  const key = new Date().toLocaleString("en-us", {
    month: "numeric",
    year: "numeric",
  });

  const currentExpenses = await getData(key);
  if (currentExpenses) {
    currentExpenses.push(input);
    return await storeData(key, currentExpenses);
  } else {
    return await storeData(key, new Array(input));
  }
};

export const getExpenses = (key) =>
  new Promise((resolve, reject) =>
    AsyncStorage.getItem(key)
      .then((data) => resolve(data ? JSON.parse(data) : null))
      .catch((err) => reject(err))
  );

export const getExpenseByCategory = async (categoryId) => {
  const _currentMonthExpenses = await getExpenses("11/2023"); // current month
  const categories = _currentMonthExpenses.filter((item) => item.categoryId == categoryId);

  console.log({ categoryId, _currentMonthExpenses, categories });

  const totalSpent = categories.reduce((sum, c) => sum + +c.spent, 0);
  console.log({ totalSpent });
  return totalSpent;
};

export const addNewCategory = async (category) => {
  const allCategories = await getAllCategories();
  allCategories.push(category);

  const key = "categories";
  return await AsyncStorage.setItem(key, allCategories);
};
