export default function Layout(props: {
  children: React.ReactNode;
  slots: React.ReactNode;
}) {
  return (
    <>
      {props.children}
      {props.slots}
    </>
  );
}
