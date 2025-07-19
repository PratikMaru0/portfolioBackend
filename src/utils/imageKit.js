import ImageKit from "imagekit";

const getImageKitInstance = () =>
  new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_END_POINT,
  });

export default getImageKitInstance;
