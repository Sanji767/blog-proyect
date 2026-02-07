import Image from "next/image";

interface Props {
  image: string;
}

export default function BookMockup({ image }: Props) {
  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-[1.5rem] shadow-sm">
      <Image
        src={image}
        alt="Ebook cover"
        fill
        sizes="(min-width: 1024px) 260px, 50vw"
        className="object-cover"
      />
    </div>
  );
}
