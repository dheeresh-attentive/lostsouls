import { useState, useMemo, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useTheme } from "next-themes";

import { NFTContext } from "../context/NFTContext";
import { Button, Input, Loader } from "../components";
import images from "../assets";
const CreateNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
    price: "",
  });
  const { theme } = useTheme();
  const { uploadToIPFS, createNFT, isLoadingNFT } = useContext(NFTContext);
  const router = useRouter();
  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]);
    setFileUrl(url);
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 10 * 1024 * 1024,
  });
  const fileStyle = useMemo(
    () =>
      `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-lg border-dashed
      ${isDragActive && "border-file-active"}
      ${isDragAccept && "border-file-accept"}
      ${isDragReject && "border-file-reject"}
      `,
    [isDragActive, isDragAccept, isDragReject]
  );

  if (isLoadingNFT) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold xs:ml-0">
          create new NFT
        </h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            upload File
          </p>
          <div className="mt-4 cursor-pointer">
            <div {...getRootProps()} className={`hvr-glow ${fileStyle}`}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPG, PNG, JPEG, GIF, SVG, WEBP. Max 10MB.
                </p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    alt="upload"
                    width={100}
                    height={100}
                    className={theme === "light" ? "filter invert" : ""}
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  drag and drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  or browse media on your device
                </p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <img src={fileUrl} alt="asset_file" />
                </div>
              </aside>
            )}
          </div>
        </div>
        <Input
          inputType="input"
          title="name"
          placeholder="NFT name"
          handleClick={(e) =>
            setFormInput({ ...formInput, name: e.target.value })
          }
        />
        <Input
          inputType="textarea"
          title="description"
          placeholder="NFT description"
          handleClick={(e) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        />
        <Input
          inputType="number"
          title="price"
          placeholder="NFT price"
          handleClick={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        />
        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="create NFT"
            classStyles="rounded-xl"
            handleClick={() => createNFT(formInput, fileUrl, router)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
