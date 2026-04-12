import {
  ModalOverlay as RACModalOverlay,
  ModalOverlayProps,
  Modal as RACModal,
  Dialog,
  DialogTrigger,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import 'assets/style/style.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { ReactNode } from 'react';

const ModalOverlay = (props: ModalOverlayProps) => {
  return (
    <RACModalOverlay
      {...props}
      className={({ isEntering, isExiting }: ModalOverlayProps) =>
        twMerge(
          clsx(
            'fixed top-0 left-0 w-screen bg-black/50 flex items-center justify-center z-50 h-[var(--visual-viewport-height)]',
            {
              'animate-modal-fade': isEntering,
              'animate-[modal-fade_150ms_reverse_ease-in]': isExiting,
            },
          ),
        )
      }
    />
  );
};

export const Modal = (props: ModalOverlayProps) => {
  return (
    <ModalOverlay {...props}>
      <RACModal
        {...props}
        className={({ isEntering }) =>
          twMerge(
            clsx(
              'min-w-[400px] rounded-2xl bg-white  forced-colors:bg-[Canvas] text-left align-middle text-slate-700 shadow-2xl border border-black/10',
              {
                'animate-modal-zoom': props.isEntering ?? isEntering,
              },
            ),
            props.className as string,
          )
        }
      />
    </ModalOverlay>
  );
};

export const ConfirmationModal = (props: {
  title?: string;
  htmlMessage?: string;
  iconHtml?: string;
  showConfirmButton?: boolean;
  isOpen?: boolean;
  handler: () => void;
  children?: ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
}) => {
  const {
    title = 'Are you certain about removing this?',
    htmlMessage,
    iconHtml,
    showConfirmButton = true,
    isOpen = false,
    handler,
    children,
    onOpenChange,
  } = props;

  if (!children) {
    return (
      <Modal isEntering={false} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ConfirmationDialog
          title={title}
          htmlMessage={htmlMessage}
          iconHtml={iconHtml}
          showConfirmButton={showConfirmButton}
          handler={handler}
        />
      </Modal>
    );
  }

  return (
    <DialogTrigger>
      {children}
      <Modal isEntering={false}>
        <ConfirmationDialog
          title={title}
          htmlMessage={htmlMessage}
          iconHtml={iconHtml}
          showConfirmButton={showConfirmButton}
          handler={handler}
        />
      </Modal>
    </DialogTrigger>
  );
};

const ConfirmationDialog = (props: {
  title: string;
  htmlMessage: string;
  iconHtml: string;
  showConfirmButton?: boolean;
  handler: () => void;
}) => {
  const { title, htmlMessage, iconHtml, showConfirmButton, handler } = props;

  return (
    <Dialog>
      {({ close }) => (
        <div className="swal2-container swal2-center" aria-hidden="true">
          <div
            className="swal2-popup custom-popup"
            aria-labelledby="swal2-title"
            aria-describedby="swal2-html-container"
            tabIndex={-1}
            role="dialog"
            aria-live="assertive"
            aria-modal="true"
            style={{ display: 'grid' }}
          >
            <div
              className="swal2-icon custom-icon swal2-icon-show"
              style={{ display: 'flex' }}
            >
              <div className="swal2-icon-content">
                {iconHtml ?? <img src="/app-warning.png" />}
              </div>
            </div>
            <h2
              className="swal2-title custom-title"
              id="swal2-title"
              style={{ display: 'block' }}
            >
              {title}
            </h2>
            {htmlMessage && (
              <div
                className="swal2-html-container"
                id="swal2-html-container"
                style={{ display: 'block' }}
                dangerouslySetInnerHTML={{ __html: htmlMessage }}
              ></div>
            )}
            <div
              className="swal2-actions custom-button"
              style={{ display: 'flex' }}
            >
              <button
                type="button"
                className="swal2-confirm swal2-styled"
                style={{
                  display: !showConfirmButton ? 'none' : 'inline-block',
                }}
                onClick={handler}
              >
                OK
              </button>
              <button
                type="button"
                className="swal2-cancel swal2-styled"
                style={{ display: 'inline-block' }}
                onClick={close}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};
