import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  items: Array<{
    type: string;
    title: string;
    date: string;
    image: string;
    description: string;
  }>;
}

export function ImageGallery({ items }: ImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div 
                className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden"
                onClick={() => setCurrentImage(index)}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                />
                <Badge 
                  className="absolute top-2 left-2" 
                  variant={
                    item.type === 'award' ? 'default' :
                    item.type === 'speaking' ? 'secondary' :
                    'outline'
                  }
                >
                  {item.type}
                </Badge>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">{item.date}</p>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog 
        open={currentImage !== null} 
        onOpenChange={() => setCurrentImage(null)}
      >
        <DialogContent className="max-w-4xl">
          {currentImage !== null && (
            <div className="relative">
              <img 
                src={items[currentImage].image}
                alt={items[currentImage].title}
                className="w-full h-auto"
              />
              <div className="absolute top-4 left-4">
                <Badge>
                  {items[currentImage].type}
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">
                  {items[currentImage].title}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {items[currentImage].date}
                </p>
                <p className="text-muted-foreground">
                  {items[currentImage].description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}