import { View, StyleSheet, Text } from "@react-pdf/renderer";
import { differenceInCalendarDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { Type } from "../../api/useTypeStore";

export const Row = ({ asset, ind, types }) => {
  const [assetType, setAssetType] = useState("");

  const styles = StyleSheet.create({
    section: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "96%",
      height: "7.5%",
      padding: 0,

      fontSize: 9,
      border: "1px solid black",
    },
    item: {
      width: "12.5%",

      textAlign: "center",
      paddingTop: 5,
      borderRight: "1px solid black",
    },
  });

  useEffect(() => {
    types.forEach((type: Type) => {
      if (type._id === asset.type) setAssetType(type.name);
    });
  }, [types, asset.type]);

  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.item}>{ind + 1}</Text>
      <Text style={styles.item}>{asset.id}</Text>
      <Text style={styles.item}>{asset.name}</Text>
      <Text style={styles.item}>{assetType}</Text>
      <Text style={styles.item}>{asset.cost}</Text>
      <Text style={styles.item}>
        {format(new Date(asset.commissioningDate), "MM/dd/yyyy")}
      </Text>
      <Text style={styles.item}>{asset.serviceTerm}</Text>
      <Text style={styles.item}>
        {differenceInCalendarDays(
          Date.now(),
          new Date(asset.commissioningDate)
        )}
      </Text>
    </View>
  );
};
