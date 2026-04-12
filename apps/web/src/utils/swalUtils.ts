import Swal from 'sweetalert2';
import 'assets/style/style.css';

export async function confirmWithSwal(
  message: string,
  title: string = 'Are you certain about removing this?',
  iconHtml: string = '<img src="/app-warning.png" />', // Use relative path to the public folder
): Promise<void> {
  const result = await Swal.fire({
    title: title,
    html: message,
    iconHtml: iconHtml, // Use custom HTML for icon
    showCancelButton: true,
    allowEscapeKey: true,
    allowOutsideClick: false,
    customClass: {
      popup: 'custom-popup',
      icon: 'custom-icon',
      title: 'custom-title',
      actions: 'custom-button',
    },
    focusCancel: true,
  });
  if (result.isConfirmed) {
    return;
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    return await Promise.reject();
  }
}
