import React from 'react';
import { View} from 'react-native';
import Hamburger from 'react-native-animated-hamburger';

const Header = ({ menuVisible, toggleMenu }) => {
    return (
        <View style={{ marginRight: 10 }}>
            <Hamburger
                active={menuVisible}
                type="spinCross"
                onPress={toggleMenu}
                color="#fff"
                style={{ width: 25, height: 25 }}
            />
        </View>
    );
};

export default Header;
