import { createStackNavigator, createAppContainer } from 'react-navigation'
import Player from './Player'
import TrackList from './TrackList'

const RootStack = createStackNavigator(
    {
        TrackList: { screen: TrackList },
        Player: { screen: Player },
    },
    {
        initialRouteName:"TrackList"
    }
)

const App = createAppContainer(RootStack);

export default App;