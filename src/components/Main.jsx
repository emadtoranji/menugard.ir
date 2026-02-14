export default function Main({ children, customClass, hasMinHFull = true }) {
  return (
    <main
      className={`w-full ${hasMinHFull ? 'min-h-full' : ''} flex-1 ${customClass ? customClass : 'pt-5 mb-5 mx-0 px-0'}`}
    >
      {children}
    </main>
  );
}
