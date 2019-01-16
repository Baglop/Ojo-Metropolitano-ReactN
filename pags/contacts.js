import React from "react";
import { View, Text, FlatList,ScrollView } from "react-native";
import GroupList from "./groupList";
import ContactList from "./contactsList"

export default class ContactScreen extends React.Component {
  render() {
    return (
      <ScrollView style={{ flex: 1}} showsVerticalScrollIndicator = {false}>
        <GroupList />
        <ContactList />
      </ScrollView>
    );
  }
}
