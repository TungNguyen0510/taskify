import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';

interface ConfirmModalProps {
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
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmModal(props: ConfirmModalProps) {
  const {
    comfirmTitle,
    comfirmMessage,
    okTitle,
    backdrop,
    modalPlacement,
    isOpen,
    cancelBtnColor,
    okBtnColor,
    onClose,
    onConfirm,
  } = props;

  const t = useTranslations('ConfirmModal');

  return (
    <Modal
      backdrop={backdrop}
      placement={modalPlacement ?? 'center'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {comfirmTitle}
        </ModalHeader>
        <ModalBody>
          <p>{comfirmMessage}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color={cancelBtnColor ?? 'default'}
            variant="flat"
            onPress={onClose}
          >
            {t('cancel')}
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
