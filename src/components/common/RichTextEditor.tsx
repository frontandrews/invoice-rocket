import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const registerQuill = async () => {
  const { Quill } = await (await import('react-quill')).default;
};

interface RichTextEditorProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  isError?: boolean;
}

const RichTextEditor = ({
  value,
  setValue,
  placeholder,
  isError,
}: RichTextEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  // Make sure to only register Quill on the client side after component is mounted
  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      registerQuill();
    }
  }, [isMounted]);

  // Don't render the component server-side
  if (!isMounted) return null;

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      placeholder={placeholder}
    />
  );
};

export default RichTextEditor;
