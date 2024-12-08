import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrandMasterAchievementEffect } from '../../../../shared/components';

const GrandFinale = () => {
  console.log('Rendering GrandFinale component');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('GrandFinale mounted, applying styles');
    // Force full-screen black background
    document.documentElement.style.backgroundColor = '#000';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000';
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    return () => {
      console.log('GrandFinale unmounting, cleaning up styles');
      // Reset styles when component unmounts
      document.documentElement.style.backgroundColor = '';
      document.documentElement.style.overflow = '';
      document.body.style.backgroundColor = '';
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, []);

  const handleComplete = () => {
    console.log('GrandFinale complete, navigating back to achievements');
    navigate('/dashboard/achievements', { replace: true });
  };

  return (
    <div className="fixed inset-0 bg-black">
      <GrandMasterAchievementEffect 
        isVisible={true}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default GrandFinale; 