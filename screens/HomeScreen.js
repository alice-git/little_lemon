import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories } from '../database';
import { getIsOnboarded } from '../utils/storage';

const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu-items-by-category.json';

// Mapeo de imágenes por ID
const imageMap = {
  1: require('../assets/1.png'),
  2: require('../assets/2.png'),
  3: require('../assets/3.png'),
  4: require('../assets/4.png'),
  5: require('../assets/5.png'),
  6: require('../assets/6.png'),
  7: require('../assets/7.png'),
  8: require('../assets/8.png'),
  9: require('../assets/9.png'),
  10: require('../assets/10.png'),
  11: require('../assets/11.png'),
  12: require('../assets/12.png')
};

const getImageSource = (id) => {
  return imageMap[id] || require('../assets/HeroImage.png');
};

const HomeScreen = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Appetizers', 'Salads', 'Beverages'];

  useEffect(() => {
    const checkAccess = async () => {
      const onboarded = await getIsOnboarded();
      if (!onboarded) {
        navigation.replace('Onboarding');
      }
    };
    checkAccess();
  }, []);

  useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        return true;
      });
  
      return () => backHandler.remove();
    }, []);

  const fetchData = async () => {
    const response = await fetch(API_URL);
    const json = await response.json();
    const menuItems = json.menu.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category.title,
      description: item.description,
    }));
    return menuItems;
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let items = await getMenuItems();
        if (!items.length) {
          items = await fetchData();
          await saveMenuItems(items);
        }
        setMenuItems(items);
        setFilteredItems(items);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);

  useEffect(() => {
    let filtered = menuItems;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchText.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  }, [searchText, selectedCategory, menuItems]);

  const MenuItemCard = ({ id, title, price, description }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>
          {description || 'Delicious Mediterranean dish prepared with fresh ingredients'}
        </Text>
        <Text style={styles.menuItemPrice}>${price}</Text>
      </View>
      <View style={styles.menuItemImage}>        
        <Image
          source={getImageSource(id)}
          style={styles.itemImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/HeaderLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={require('../assets/profile-icon.png')}
              style={styles.profileIcon}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
            <Text style={styles.restaurantName}>Little Lemon</Text>
            <View style={styles.rowStyle}>
                <View style={styles.heroContent}>                    
                    <Text style={styles.location}>Chicago</Text>
                    <Text style={styles.description}>
                    We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                    </Text>
                </View>
                <View style={styles.heroImageContainer}>
                    <Image 
                    source={require('../assets/HeroImage.png')} 
                    style={styles.heroImage} 
                    resizeMode="cover"
                    />
                </View>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for menu items..."
                    placeholderTextColor="#999999"
                    value={searchText}
                    onChangeText={setSearchText}
                    />
            </View>
        </View>
        
        {/* Menu Breakdown Section */}
        <View style={styles.menuBreakdown}>
          <Text style={styles.orderTitle}>ORDER FOR DELIVERY!</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Food Menu List */}
        <View style={styles.foodMenuList}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MenuItemCard
                id={item.id}
                title={item.title}
                price={item.price}
                description={item.description}
              />
            )}
            scrollEnabled={false}
            contentContainerStyle={styles.menuListContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  logo: {
    width: 150,
    height: 50,
  },
  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#495E57',
  },
  searchContainer: {
    marginTop: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  menuBreakdown: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495E57',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: '#EDEFEE',
  },
  categoryButtonActive: {
    backgroundColor: '#F4CE14',
  },
  categoryText: {
    fontSize: 16,
    color: '#495E57',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#495E57',
    fontWeight: 'bold',
  },
  foodMenuList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  menuListContainer: {
    paddingBottom: 40,
  },
  menuItemCard: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  menuItemInfo: {
    flex: 2,
    paddingRight: 12,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495E57',
  },
  menuItemImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#EDEFEE',
  },
  heroSection: {
    backgroundColor: '#495E57',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  rowStyle: {
    flexDirection: 'row',
  },
  heroContent: {
    flex: 2, 
    paddingRight: 12,
  },
  restaurantName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F4CE14',
    marginBottom: 4,
  },
  location: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#EDEFEE',
    lineHeight: 20,
  },
  heroImageContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#F4CE14',
  },
});

export default HomeScreen;