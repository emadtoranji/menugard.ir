import Link from 'next/link';

export default async function Index({ params }) {
  const { lng } = await params;

  const sections = [
    {
      title: 'Manage Users',
      path: `/${lng}/admin/manage-users`,
    },
  ];

  return (
    <>
      <div className='container'>
        <div className='flex gap-3'>
          {sections.map((section, index) => {
            {
              if (!section?.title || !section?.path) {
                return null;
              }
              return (
                <Link key={index} href={section.path}>
                  <button className='btn btn-success btn-lg'>
                    {section.title}
                  </button>
                </Link>
              );
            }
          })}
        </div>
      </div>
    </>
  );
}
