interface HeadingProps {
  title: string;
  children?: JSX.Element | JSX.Element[];
}

const Heading = ({ title, children }: HeadingProps) => {
  return (
    <div className="flex justify-between pt-6 pb-2">
      <div className="self-center">
        <h1 className="font-medium text-lg">{title}</h1>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Heading;
