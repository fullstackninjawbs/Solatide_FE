// The server only accepts payment-setting changes (checkout mode, bank / PayID details) from a
// super admin (Server/src/config/roles.ts → ACCESS.settingsPayment). Used to show those cards view-only.
export const canEditPaymentSettings = () => {
  try {
    return JSON.parse(localStorage.getItem('adminUser') || '{}').role === 'super_admin';
  } catch {
    return false;
  }
};
