'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} = React;

var FS = require("react-native-fs")

var Oracle = React.createClass({

  getInitialState() {
    return {
      ingredients: null,
      soup_text: null,
      local: true
    };
  },

  toggleMenu() {
    this.props.menu.openMenu();
  },

  updateSoup() {

    this.setState({ingredients:null});

    fetch('http://noodler-app.com/random_soup.json')
        .then((response) => response.json())
        .then((data) => {
          this.setState({ingredients: data.ingredients,
                         grid_ingredients: data.grid_ingredients,
                         soup_text: data.text})
        }).done();
  },

  updateRemoteSoup() {
    this.updateSoup()
    this.setState({local: false})
  },

  updateLocalSoup() {
    this.updateSoup()
    this.setState({local: true})
  },

  componentWillMount() {

  },

  componentDidMount() {
    FS.readDir('/images', FS.MainBundle).then((res) => {
      this.setState({imagePath: res[0].path.split("/").slice(0, 9).join("/")})
      this.updateSoup();
    })


  },

  renderIngredient(ingredient) {
    if (this.state.local) {
      var path = this.state.imagePath+"/images/"+ingredient.id+"-oracle.png"
    } else {
      var path = 'http://noodler-app.com/'+ingredient.oracle_png_url
    }
    return <Image source={{uri: path}} style={styles.ingredient_image} />;
  },

  navigateToCookSoup() {
    this.props.navigator.replace({id: 'cook_soup', ingredients: this.state.ingredients, grid_ingredients: this.state.grid_ingredients});
  },

  render() {
    var content;
    if (!this.state.ingredients) {
      content = <ActivityIndicatorIOS style={{alignSelf: 'center', marginTop: 100}} size="large" />;
    } else {
      content = this.state.ingredients.map((ingredient) => { return this.renderIngredient(ingredient)});
    }
    return (
      <View style={styles.container}>
        <View style={styles.soup_container}>
          {content}
              {this.renderIngredient({oracle_png_url: "/media/W1siZiIsIjIwMTUvMDMvMTMvODZraXJ6cDBtdF9jaG9wc3RpY2tzX3NoYWRvd19vbGQucGRmIl0sWyJwIiwiY29udmVydCIsIi1xdWFsaXR5IDkwIC1kZXB0aCA4IC1zdHJpcCAtcmVzaXplIDUwMHgiLHsiZm9ybWF0IjoicG5nIiwiaW5pdGlhbF9hcmdzIjoiLWRlbnNpdHkgMTcwIn1dXQ"})}

        </View>
        <Text style={styles.soup_text}>
          {this.state.soup_text}
        </Text>
        <View style={styles.button_container}>
          <TouchableOpacity onPress={this.updateLocalSoup}>
              <Text style={styles.refresh_button}>New local soup</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.updateRemoteSoup}>
              <Text style={styles.refresh_button}>new remote soup</Text>
          </TouchableOpacity>
        </View>
        <Text>Drawings by michelehumes.com</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
  },
  soup_container: {
    position: 'relative',
    width: 250,
    height: 250,
  },
  soup_text: {
    fontSize: 20,
    paddingLeft: 30,
    paddingRight: 30,
    color: '#222',
    paddingBottom: 20,
    fontFamily: "Iowan Old Style",
    lineHeight: 32
  },

  ingredient_image: {
    position: 'absolute',
    width: 250,
    height: 250,
    backgroundColor: 'transparent'
  },
  button_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 20
  },
  refresh_button: {
    padding: 10,
    fontSize: 15,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10
  },
  cook_button: {
    marginRight: 40,
    width: 50,
    height: 50
  }
});
AppRegistry.registerComponent('ImageMemoryTest', () => Oracle);

module.exports = Oracle;
