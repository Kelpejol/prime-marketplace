"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
  onOpen?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionlabel: string | undefined;
  disabled?: boolean;
  secondaryActions?: () => void;
  secondaryActionLabel?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionlabel,
  disabled,
  secondaryActions,
  secondaryActionLabel,
}: ModalProps) {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
   
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [ onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    onSubmit();
  }, [disabled, onSubmit]);

  if (!isOpen) {
    return null;
  }



  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70 p-4">
      <div className="relative w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-md mx-auto my-6">
        <div className="translate h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-center p-4 sm:p-6 rounded-t justify-center relative border-b-[1px]">
            <button
              onClick={handleClose}
              className="p-1 border-0 hover:opacity-70 transition absolute left-3 sm:left-6"
            >
              <IoMdClose size={18} />
            </button>
            <div className="text-base sm:text-lg font-semibold">{title}</div>
          </div>
          <div className="relative p-4 sm:p-6 flex-auto overflow-y-auto">{body}</div>
          <div className="flex gap-2 p-4">
            <div className="flex  gap-2 w-full justify-end">
              {secondaryActions && secondaryActionLabel && (
                <Button
                  size="small"
                  color="primary"
                  actionLabel={secondaryActionLabel}
                  action={secondaryActions}
                />
              )}
              {actionlabel && (
                <Button
                  size="small"
                  color="primary"
                  actionLabel={actionlabel}
                  action={handleSubmit}
                  disabled={disabled}
                />
              )}
            </div>
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}