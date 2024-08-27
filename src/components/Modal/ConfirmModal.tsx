import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

interface ConfirmModalProps {
  size?:
    | 'md'
    | 'xs'
    | 'sm'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full'
    | undefined;
  comfirmTitle: string;
  comfirmMessage: string;
  okTitle: string;
  backdrop?: 'transparent' | 'opaque' | 'blur' | undefined;
  modalPlacement?:
    | 'center'
    | 'top-center'
    | 'top'
    | 'bottom'
    | 'bottom-center'
    | 'auto'
    | undefined;
  isOpen: boolean;
  cancelBtnColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
  okBtnColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
  contentSlot?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmModal(props: ConfirmModalProps) {
  const {
    size,
    comfirmTitle,
    comfirmMessage,
    okTitle,
    backdrop,
    modalPlacement,
    isOpen,
    cancelBtnColor,
    okBtnColor,
    contentSlot,
    onClose,
    onConfirm,
  } = props;

  return (
    <Modal
      size={size ?? 'md'}
      backdrop={backdrop}
      placement={modalPlacement ?? 'center'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col items-center gap-1">
          {comfirmTitle}
        </ModalHeader>
        <ModalBody>
          <p>{comfirmMessage}</p>
          <div>{contentSlot}</div>
        </ModalBody>
        <ModalFooter>
          <Button
            color={cancelBtnColor ?? 'default'}
            variant="flat"
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button color={okBtnColor ?? 'danger'} onPress={onConfirm}>
            {okTitle}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmModal;
