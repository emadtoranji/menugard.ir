import Image from 'next/image';

export default function StoreIntro({ name, logoUrl }) {
  if (!name) name = '...';

  return (
    <div className='flex items-center gap-2 mb-3 mx-2 md:mx-4 lg:mx-8 xl:mx-12 2xl:mx-16'>
      <Image
        className='rounded'
        src={logoUrl}
        alt={`${name} Logo`}
        width={75}
        height={75}
        style={{ objectFit: 'contain' }}
      />
      <h1>{name}</h1>
    </div>
  );
}
