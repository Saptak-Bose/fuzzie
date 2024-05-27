"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Props = {
  children: Readonly<React.ReactNode>;
};

export type ModalData = {};

type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (
    modal: Readonly<React.ReactNode>,
    fetchData?: () => Promise<any>
  ) => void;
  setClose: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (
    modal: Readonly<React.ReactNode>,
    fetchData?: () => Promise<any>
  ) => {},
  setClose: () => {},
});

export default function ModalProvider({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] =
    useState<Readonly<React.ReactNode>>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (
    modal: Readonly<React.ReactNode>,
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) } || {});
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  if (!isMounted) null;

  return (
    <ModalContext.Provider value={{ data, isOpen, setClose, setOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider.");
  return context;
};
