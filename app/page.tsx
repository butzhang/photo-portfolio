import Image from "next/image";
import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import CarouselClient from "./components/CarouselClient";

export default function Page() {
  const images = [
    { path: "/photos/home.jpg", title: null },
    { path: "/photos/home2.jpg", title: null },
  ];

  const imageDimensions = images.map((img) => {
    const filePath = path.join(process.cwd(), "public", img.path.replace(/^\//, ""));
    const { width, height } = sizeOf(filePath);
    return {
      src: img.path,
      width,
      height,
      title: img.title,
    };
  });

  return (
    <section className="w-full flex flex-col items-center px-4 md:px-8 lg:px-12 relative">
      <CarouselClient images={imageDimensions} />
    </section>
  );
}
