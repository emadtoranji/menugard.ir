export function TopUpDescription({ t }) {
  const depositRules = t('dashboard.finance.deposit-rules', {
    returnObjects: true,
  });

  return (
    <div className='p-3'>
      <h4>{t('dashboard.finance.deposit-rules-title')}</h4>
      <ul className='list-group list-group-flush p-0 h7 text-justify'>
        {depositRules.map((rule, index) => {
          return (
            <li key={index} className='list-group-item'>
              {rule}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
