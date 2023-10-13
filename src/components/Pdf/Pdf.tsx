import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { Row } from "./Row";
import { AssetType } from "../../api/useAssetStore";

export const PDF = ({ assets, startDate, endDate, types }) => {
  Font.register({
    family: "Roboto",
    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
  });
  const styles = StyleSheet.create({
    page: {
      margin: 10,
      marginTop: 20,
      flexDirection: "column",
      backgroundColor: "white",

      fontSize: 11,
      fontFamily: "Roboto",
    },
    date: {
      marginLeft: "75%",
      marginBottom: 10,
    },
    caption: {
      textAlign: "center",
      marginBottom: 10,
    },
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
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.date}>
          Дата звіту {format(Date.now(), "MM/dd/yyyy")}
        </Text>
        <Text style={styles.caption}>
          Список матеріальних активів за період з{" "}
          {format(new Date(startDate), "MM/dd/yyyy")} по{" "}
          {format(new Date(endDate), "MM/dd/yyyy")}
        </Text>
        <View style={styles.section}>
          <Text style={styles.item}>№ п/п</Text>
          <Text style={styles.item}>Інвентарний номер (id)</Text>
          <Text style={styles.item}>Найменування матеріального активу</Text>
          <Text style={styles.item}>Вид активу</Text>
          <Text style={styles.item}>Вартість балансова</Text>
          <Text style={styles.item}>Дата введення в експлуатацію</Text>
          <Text style={styles.item}>Термін служби</Text>
          <Text style={styles.item}>Фактичний термін работи</Text>
        </View>
        {assets.map((item: AssetType, ind: number) => {
          return (
            <Row asset={item} ind={ind} types={types} key={item._id}/>
          );
        })}
      </Page>
    </Document>
  );
};