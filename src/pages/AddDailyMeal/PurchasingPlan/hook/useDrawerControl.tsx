import { useState } from "react";

export const useDrawerControl = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return { open, showDrawer, onClose };
};
