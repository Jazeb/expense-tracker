import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topHeader: {
    height: "25%",
    backgroundColor: "#38E4C4",
  },
  topHeaderFont: {
    paddingTop: 150,
    fontSize: 24,
    color: "#FFF",
    fontWeight: "500",
    marginLeft: 28,
    flexDirection: "row",
  },
  input: {
    marginLeft: 10,
    // borderBottomWidth: 3,
    // alignItems: "center",
    fontSize: 50,
    fontWeight: "600",
    color: "#4D8067",
  },
  amount_view_style: {
    paddingTop: 10,
    width: "70%",
    alignSelf: "center",
    borderBottomColor: "#4D8067",
    borderBottomWidth: 3,
    flexDirection: "row",
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 5,
  },

  rs: { fontSize: 50, color: "#4D8067", fontWeight: "700" },
});

export default globalStyles;
