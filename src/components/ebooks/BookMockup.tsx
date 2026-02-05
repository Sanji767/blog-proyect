interface Props {
  image: string;
}

export default function BookMockup({ image }: Props) {
  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-[1.5rem] shadow-sm">
      <img
        src={image}
        alt="Ebook cover"
        className="w-full h-full object-cover"
      />
    </div>
  );
}