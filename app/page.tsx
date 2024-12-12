import Image from "next/image";
import fs from "fs";
import path from "path";
import sizeOf from "image-size";

export default function Page() {
  const images = [
    {
      path: "/photos/home.jpg",
      title: null,
    },
    {
      path: "/photos/home2.jpg",
      title: null,
    },
  ];

  // Determine dimensions for each image
  const imageDimensions = images.map((img) => {
    const filePath = path.join(process.cwd(), "public", img.path.replace(/^\//, ""));
    const { width, height } = sizeOf(filePath);
    return {
      src: img.path,
      width,
      height,
      title: img.title
    };
  });

  return (
    <section className="w-full flex flex-col items-center px-4 md:px-8 lg:px-12">
      <div className="grid gap-10 w-full max-w-5xl">
        {imageDimensions.map(({ src, width, height, title }, idx) => (
          <div key={idx} className="w-full flex flex-col items-center">
            {/* If you want to display the title above the image */}
            {title && <p className="text-sm font-light mb-1 max-w-md text-center leading-relaxed">{title}</p>}
            <Image
              src={src}
              alt={title || `Portfolio image ${idx + 1}`}
              width={width}
              height={height}
              className="max-w-full h-auto hover:opacity-90 transition-opacity"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
