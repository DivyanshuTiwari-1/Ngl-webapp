'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/message.json";
import ThemeToggle from "@/components/Themetoggle";

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md">
     
        <section className="text-center mb-6 md:text-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Mystery Message</h1>

          <p>Explore Mystery Message - Where your identity remains a secret.</p>
        </section>
        <div className="absolute bottom-4 right-4">
        <ThemeToggle />
      </div>
        <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="border border-gray-200 shadow-md rounded-lg">
                    <CardHeader className="border-b p-4 rounded-t-lg">
                      <h2 className="text-lg font-semibold">
                        {message.title}
                      </h2>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-4">
                      <span className="text-2xl font-medium">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Home;

