import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    label: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 20,
    },
    info: {
        fontSize: 20,
        color: 'lightgray',
        marginLeft: 40,
    },
    children: {
        margin: 2,
        marginLeft: 20,
    },
})

export default class Accordion extends React.Component {
    constructor() {
        super()
        this.state = {
            isOpen: false,
            icon: 'angle-up',
        }
    }

    changeIcon(icon) {
        if (icon === 'angle-up') {
            this.setState({
                icon: 'angle-down',
            })
        } else {
            this.setState({
                icon: 'angle-up',
            })
        }
    }

    render() {
        const { children, label, info } = this.props
        const { isOpen, icon } = this.state

        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ isOpen: !isOpen })
                        this.changeIcon(icon)
                    }}
                    style={styles.container}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={styles.label}>{label}</Text>

                        <FontAwesome
                            name={icon}
                            size={30}
                            style={{ marginRight: 15, color: 'white' }}
                        />
                    </View>
                    <Text style={styles.info}>{info}</Text>
                </TouchableOpacity>
                {isOpen && <View style={styles.children}>{children}</View>}
            </View>
        )
    }
}
