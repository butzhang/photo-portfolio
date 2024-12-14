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
      <section className="w-full relative">
        {/* No need for extra px here, the layout container sets the max width */}
        <CarouselClient images={imageDimensions}/>
      </section>

  );
}
