import Image from "next/image";

interface Props {
  image: string;
}

export default function BookMockup({ image }: Props) {
  return (
    <div className="relative aspect-square w-full overflow-hidden border-b-2 border-secondary bg-secondary">
      <Image
        src={image}
        alt="Ebook cover"
        fill
        sizes="(min-width: 1024px) 260px, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    </div>
  );
}
