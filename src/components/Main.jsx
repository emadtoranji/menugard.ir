export default function Main({ children, customClass }) {
  return (
    <main
      className={`w-full min-h-full flex-1 m-0 p-0 ${customClass ? customClass : ''}`}
    >
      {children}
    </main>
  );
}
