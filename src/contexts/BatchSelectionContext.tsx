import React, { createContext, useContext, useState, ReactNode } from "react";

interface BatchSelectionContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const BatchSelectionContext = createContext<BatchSelectionContextType | undefined>(undefined);

export function BatchSelectionProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <BatchSelectionContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </BatchSelectionContext.Provider>
  );
}

export function useBatchSelection() {
  const context = useContext(BatchSelectionContext);
  if (context === undefined) {
    throw new Error("useBatchSelection must be used within a BatchSelectionProvider");
  }
  return context;
}
