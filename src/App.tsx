import { Layout } from './components/layout/Layout';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { TipsScreen } from './screens/TipsScreen';
import { QuestionsScreen } from './screens/QuestionsScreen';
import { UploadScreen } from './screens/UploadScreen';
import { AvatarScreen } from './screens/AvatarScreen';
import { GalleryScreen } from './screens/GalleryScreen';
import { ContactsScreen } from './screens/ContactsScreen';
import { useAppStore } from './store/useAppStore';

function App() {
  const { screen } = useAppStore();

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen />;
      case 'game':
        return <GameScreen />;
      case 'tips':
        return <TipsScreen />;
      case 'questions':
        return <QuestionsScreen />;
      case 'upload':
        return <UploadScreen />;
      case 'avatar':
        return <AvatarScreen />;
      case 'gallery':
        return <GalleryScreen />;
      case 'contacts':
        return <ContactsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <Layout>
      {renderScreen()}
    </Layout>
  );
}

export default App;
