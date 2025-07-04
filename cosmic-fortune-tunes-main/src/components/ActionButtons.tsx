
import { Button } from '@/components/ui/button';
import { RefreshCw, Share2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  onNewFortune: () => void;
  spaceData?: any;
  fortune: string;
}

const ActionButtons = ({ onNewFortune, spaceData, fortune }: ActionButtonsProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareText = `🌌 My Cosmic Fortune: "${fortune}" 🎵\n\nGenerated by Cosmic Fortune Tunes!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Cosmic Fortune',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(`🌌 My Cosmic Fortune: "${fortune}" 🎵\n\nGenerated by Cosmic Fortune Tunes!`);
    toast({
      title: "Fortune copied!",
      description: "Your cosmic fortune has been copied to clipboard.",
    });
  };

  const handleSaveFortune = () => {
    const fortuneData = {
      fortune,
      timestamp: new Date().toISOString(),
      spaceImage: spaceData?.url,
      spaceTitle: spaceData?.title,
      date: spaceData?.date
    };

    const dataStr = JSON.stringify(fortuneData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cosmic-fortune-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Fortune saved!",
      description: "Your cosmic fortune has been downloaded.",
    });
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button
        onClick={onNewFortune}
        variant="outline"
        size="lg"
        className="border-primary/30 hover:border-primary hover:bg-primary/10"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        New Fortune
      </Button>
      
      <Button
        onClick={handleShare}
        variant="outline"
        size="lg"
        className="border-accent/30 hover:border-accent hover:bg-accent/10"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Fortune
      </Button>
      
      <Button
        onClick={handleSaveFortune}
        variant="outline"
        size="lg"
        className="border-secondary/30 hover:border-secondary hover:bg-secondary/10"
      >
        <Download className="w-4 h-4 mr-2" />
        Save Fortune
      </Button>
    </div>
  );
};

export default ActionButtons;
