import QRCode from 'qrcode';

export const generateQRDataURL = async (resourceId) => {
  const encoded = `${window.location.origin}/toggle/${resourceId}`;
  return QRCode.toDataURL(encoded, {
    margin: 2,
    width: 512,
  });
};
