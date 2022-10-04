import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/core";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components/native";
import LinearGradient from "react-native-linear-gradient";

const axios = require("axios");

// Lorwyn and Eldritch Moon are a little buggy, eldritch because of two piece cards
// Running into error with older sets where prices aren't available for some cards which throws error when trying to display prices
export default function Booster() {
  const {
    params: { setName, setCode, cardCount, setBlock, scryfallUri },
  } = useRoute();
  const navigation = useNavigation();
  const goToSetDetails = ({ setName, setCode, cardCount, setBlock, scryfallUri }) =>
    navigation.navigate("Set Details", { setName, setCode, cardCount, setBlock, scryfallUri });
  const renderCards = async () => {
    const fetchedSet = await axios.get(
      `https://api.scryfall.com/cards/search?include_extras=true&include_variations=true&order=set&q=e%3A${setCode}&unique=prints`,
    );
    const allCardsData = fetchedSet.data;
    const { data: cardData, has_more, next_page: getMoreCardsURL } = allCardsData;
    let allCards = [];
    allCards = [...allCards, ...cardData];

    if (has_more) {
      const getMoreCards = await axios.get(getMoreCardsURL);
      const moreCardsResult = getMoreCards.data;
      const { data: moreCards } = moreCardsResult;
      allCards = [...allCards, ...moreCards];
    }
    setCards(allCards);
  };

  const [cards, setCards] = useState(0);

  useEffect(() => {
    renderCards();
  }, []);

  const sortCards = (cards) => {
    const commonResult = cards?.filter(
      (card) => card.rarity === "common" && card.type_line.includes("Basic Land") === false && card.booster === true,
    );
    const uncommonResult = cards?.filter((card) => card.rarity === "uncommon" && card.booster === true);
    const rareResult = cards?.filter((card) => card.rarity === "rare" && card.booster === true);
    const mythicResult = cards?.filter((card) => card.rarity === "mythic" && card.booster === true);
    const basicResult = cards?.filter((card) => card.type_line?.includes("Basic Land") === true);

    return { commonResult, uncommonResult, rareResult, mythicResult, basicResult };
  };

  const [booster, setBooster] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  // const [flipFace, setFlipFace] = useState(false);

  useEffect(() => {
    if (cards.length > 0) {
      const sortedCards = sortCards(cards);
      const { commonResult, uncommonResult, rareResult, mythicResult, basicResult } = sortedCards;
      const fullPack = generateBooster({ commonResult, uncommonResult, rareResult, mythicResult, basicResult });
      setBooster(fullPack.fullPack);
      setTotalPrice(fullPack.packValue);
    }
  }, [cards]);

  const refreshPage = () => {
    const sortedCards = sortCards(cards);
    const { commonResult, uncommonResult, rareResult, mythicResult, basicResult } = sortedCards;
    const fullPack = generateBooster({ commonResult, uncommonResult, rareResult, mythicResult, basicResult });
    setBooster(fullPack.fullPack);
    setTotalPrice(fullPack.packValue);
  };

  const generateBooster = ({ commonResult, uncommonResult, rareResult, mythicResult, basicResult }) => {
    let fullPack = [];
    let packPrice = [];
    for (let i = 0; i < 10; i++) {
      const value = Math?.floor(Math?.random() * commonResult.length);
      // console.log('commonResult.length: ', commonResult.length);
      let storedCommon = commonResult[value];
      fullPack = [...fullPack, storedCommon];
      packPrice = [...packPrice, parseFloat(storedCommon?.prices.usd ?? 0.0)];
      commonResult?.splice(value, 1);
    }
    for (let i = 0; i < 3; i++) {
      const value = Math?.floor(Math?.random() * uncommonResult.length);
      let storedUncommon = uncommonResult[value];
      fullPack = [...fullPack, storedUncommon];
      packPrice = [...packPrice, parseFloat(storedUncommon?.prices.usd ?? 0.0)];
      uncommonResult?.splice(value, 1);
    }
    const mythicChance = Math?.floor(Math?.random() * 6);

    if (mythicChance === 5) {
      const value = Math?.floor(Math?.random() * mythicResult.length);
      let storedMythic = mythicResult[value];
      fullPack = [...fullPack, storedMythic];
      packPrice = [...packPrice, parseFloat(storedMythic?.prices.usd ?? 0.0)];
    } else {
      const value = Math?.floor(Math?.random() * rareResult.length);
      let storedRare = rareResult[value];
      fullPack = [...fullPack, storedRare];
      packPrice = [...packPrice, parseFloat(storedRare?.prices.usd ?? 0.0)];
    }
    if (basicResult.length >= 1) {
      const value = Math?.floor(Math?.random() * basicResult.length);
      let storedBasic = basicResult[value];
      fullPack = [...fullPack, storedBasic];
      packPrice = [...packPrice, parseFloat(storedBasic?.prices.usd ?? 0.0)];
    }

    // packPrice = packPrice + parseInt(storedBasic.prices.usd);
    let packValue = 0;
    for (let i = 0; i < packPrice.length; i++) {
      packValue += packPrice[i];
    }
    packValue = packValue.toFixed(2);
    console.log(fullPack);
    console.log("packValue: ", packValue);
    return { fullPack, packValue };
  };

  const CardNameText = styled(Text)``;
  const ScreenContainer = styled(SafeAreaView)`
    flex: ${(props) => props.theme.screenContainer.flex};
    align-items: ${(props) => props.theme.screenContainer.alignItems};
    align-content: ${(props) => props.theme.screenContainer.alignContent};
    background-color: ${(props) => props.theme.screenContainer.backgroundColor};
  `;
  const DetailsCard = styled(View)`
    width: ${(props) => props.theme.detailsCard.width};
    height: ${(props) => props.theme.detailsCard.height};
    background-color: ${(props) => props.theme.detailsCard.backgroundColor};
    // align-items: ${(props) => props.theme.detailsCard.alignItems};
    // align-content: ${(props) => props.theme.detailsCard.alignContent};
    // justify-content: ${(props) => props.theme.detailsCard.justifyContent};
  `;

  const isMobile = Platform.OS === "ios";

  const renderItem = ({ item }) => {
    return <BoosterCard item={item} />;
  };

  return isMobile ? (
    <ScreenContainer>
      <DetailsCard>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.touchableText}>{setName}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "hsl(180, 60%, 95%)", fontSize: 20 }}>Total pack value:</Text>
          <Text style={styles.totalPrice}>{totalPrice}</Text>
        </View>
      </DetailsCard>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={booster}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        numColumns={1}
        style={styles.flatList}
      />
      <TouchableOpacity style={styles.touchable} onPress={refreshPage}>
        <Text>Generate New Booster</Text>
      </TouchableOpacity>
    </ScreenContainer>
  ) : (
    <ScreenContainer>
      <DetailsCard>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.touchableText}>{setName}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "hsl(180, 60%, 95%)", fontSize: 20 }}>Total pack value:</Text>
          <Text style={styles.totalPrice}>{totalPrice}</Text>
        </View>
      </DetailsCard>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={booster}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        numColumns={3}
        style={styles.flatList}
      />
      <TouchableOpacity style={styles.touchable} onPress={refreshPage}>
        <Text style={{ alignSelf: "center" }}>Generate New Booster</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
const BoosterCard = ({ item }) => {
  const isMobile = Platform.OS === "ios";

  const CardImage = styled(Image)`
    display: ${(props) => props.theme.cardImageStyle.display};
    padding-vertical: ${(props) => props.theme.cardImageStyle.paddingVertical};
    margin-vertical: ${(props) => props.theme.cardImageStyle.marginVertical};
    margin-horizontal: ${(props) => props.theme.cardImageStyle.marginHorizontal};
    height: ${(props) => props.theme.cardImageStyle.height};
    width: ${(props) => props.theme.cardImageStyle.width};
  `;

  const CardContainer = styled(View)`
    display: ${(props) => props.theme.cardContainer.display};
    align-items: ${(props) => props.theme.cardContainer.alignItems};
    align-content: ${(props) => props.theme.cardContainer.alignContent};
    text-align: ${(props) => props.theme.cardContainer.textAlign};
    width: ${(props) => props.theme.cardContainer.width};
    padding-vertical: ${(props) => props.theme.cardContainer.paddingVertical};
    margin-vertical: ${(props) => props.theme.cardContainer.marginVertical};
    margin-horizontal: ${(props) => props.theme.cardContainer.marginHorizontal};
    background-color: ${(props) => props.theme.cardContainer.backgroundColor};
    border: ${(props) => props.theme.cardContainer.border};
    border-radius: ${(props) => props.theme.cardContainer.borderRadius};
  `;

  const CardPrice = styled(Text)`
    margin-bottom: ${(props) => props.theme.cardPrice.marginBottom};
    text-align: ${(props) => props.theme.cardPrice.textAlign};
    color: ${(props) => props.theme.cardPrice.color};
  `;

  const [flipFace, setFlipFace] = useState(false);

  const getCardArtURI = ({ item }) => {
    const hasTwoFaces = item?.card_faces?.[0].image_uris;
    const hasCardFaces = item?.card_faces;

    if (hasTwoFaces) {
      const {
        0: { image_uris: { normal: faceOneUri = "" } = {} } = {},
        1: { image_uris: { normal: faceTwoUri = "" } = {} } = {},
      } = hasCardFaces;
      return { faceOneUri, faceTwoUri };
    } else {
      const { image_uris } = item;
      const { normal = "" } = image_uris ?? {};
      return { faceOneUri: normal };
    }
  };

  const getTitleStyle = (rarity = "") => {
    const titleColor = rarity === "rare" ? "#ad7f45" : rarity === "mythic" ? "#a61903" : "black";
    const titleStyle = { ...StyleSheet.flatten(styles.titleText), color: titleColor };

    return titleStyle;
  };
  const titleStyle = getTitleStyle(item?.rarity);

  const getMobileTextStyle = (rarity = "") => {
    const titleColor = rarity === "rare" ? "#ad7f45" : rarity === "mythic" ? "#a61903" : "black";
    const titleStyle = { ...StyleSheet.flatten(styles.mobileText), color: titleColor };

    return titleStyle;
  };
  const mobileTextStyle = getMobileTextStyle(item?.rarity);

  const { faceOneUri, faceTwoUri } = getCardArtURI({ item });

  if (faceTwoUri) {
    return (
      <CardContainer>
        <TouchableOpacity onPress={() => Linking.openURL(item.scryfall_uri)}>
          <Text style={isMobile ? mobileTextStyle : titleStyle}>
            {flipFace === true ? item.card_faces[1].name : item.card_faces[0].name}
          </Text>
          <CardPrice>Price: ${item.prices.usd}</CardPrice>
        </TouchableOpacity>
        {/* <CardContainer> */}
        <CardImage source={flipFace === false ? { uri: faceOneUri } : { uri: faceTwoUri }} />
        {/* </CardContainer> */}
        <TouchableOpacity onPress={() => (flipFace === false ? setFlipFace(true) : setFlipFace(false))}>
          <Text>Flip Me</Text>
        </TouchableOpacity>
      </CardContainer>
    );
  } else {
    return (
      <CardContainer>
        <TouchableOpacity onPress={() => Linking.openURL(item.scryfall_uri)}>
          <Text style={isMobile ? mobileTextStyle : titleStyle}>{item.name}</Text>
          <CardPrice>Price: ${item.prices.usd}</CardPrice>
        </TouchableOpacity>
        <CardImage source={{ uri: faceOneUri }} />
      </CardContainer>
    );
  }
};

const styles = StyleSheet.create({
  booster: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    width: "33%",
    paddingVertical: "3px",
    marginVertical: "5px",
    marginHorizontal: "4px",
  },
  container: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
  },
  flatList: {
    // border: "3px solid red",
    // width: "100%",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    width: "100%",
  },
  mobileText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    width: "95%",
  },
  touchable: {
    width: "12%",
    fontSize: 20,
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderWidth: 3,
    borderColor: "hsl(180, 60%, 25%)",
    borderRadius: 7,
  },
  rareTitleColor: {
    color: "#ad7f45",
  },
  mythicTitleColor: {
    color: "#a61903",
  },
  price: {
    marginBottom: 2,
    textAlign: "center",
  },
  touchableText: {
    color: "hsl(180, 60%, 95%)",
    alignSelf: "center",
  },
  totalPrice: {
    color: "hsl(180, 60%, 95%)",
  },
  image: {
    display: "flex",
    alignItems: "center",
    placeContent: "center",
    textAlign: "center",
    width: "100%",
    paddingVertical: 3,
    marginVertical: 5,
    marginHorizontal: 5,
    height: 300,
    width: 225,
  },
});
