import { useState } from "react";

function useModal(initialVisibility = false) {
  const [isVisible, setIsVisible] = useState(initialVisibility);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  return {
    isVisible,
    show,
    hide,
  };
}

export default useModal;
