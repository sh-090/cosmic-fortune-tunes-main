
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Image as ImageIcon } from 'lucide-react';

interface FortuneCardProps {
  fortune: string;
  spaceData?: any;
}

const FortuneCard = ({ fortune, spaceData }: FortuneCardProps) => {
  return (
    <Card className="cosmic-glow bg-gradient-to-br from-card to-card/80 border-primary/20 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {spaceData?.url && spaceData?.media_type === 'image' && (
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={spaceData.url} 
                alt={spaceData.title}
                className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          )}

          <div className="space-y-4">
            {spaceData?.title && (
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  {spaceData.title}
                </Badge>
                {spaceData?.date && (
                  <Badge variant="outline" className="border-primary/30">
                    <Calendar className="w-3 h-3 mr-1" />
                    {spaceData.date}
                  </Badge>
                )}
              </div>
            )}

            <div className="relative">
              <p className="text-lg leading-relaxed text-foreground font-medium px-4 py-6 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-primary/10">
                {fortune}
              </p>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full star-twinkle" />
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-accent rounded-full star-twinkle" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FortuneCard;
