import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeartIcon } from "@heroicons/react/24/outline";

// Import CSS for react-toastify if needed

const style = {
  wrapper: `bg-[#273359] flex-auto w-[14rem] h-[22rem] my-5 mx-5 rounded-2xl overflow-hidden relative group shadow-xl`,
  imgContainer: `relative h-2/3 w-full overflow-hidden flex justify-center items-center`,
  designImg: `w-full h-full object-cover transition-transform duration-300 ease-in-out`,
  details: `p-3`,
  info: `flex justify-between drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm`,
  assetName: `font-light text-sm mt-1`,
  likes: `text-[#8a939b] flex items-center w-full justify-start font-normal mt-1`,
  likeIcon: `text-md w-4 mr-2`,
  orderTab: `absolute bottom-0 left-0 right-0 top-auto bg-[#202225] py-5 px-2 rounded-b-2xl transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out flex flex-col justify-center items-center`,
  sizeLabel: `mr-2 self-center`,
  sizeWrapper: `flex items-center justify-center mb-5`,
  sizeSelect: `inline-block blue-glassmorphism py-1 px-3 rounded text-center cursor-pointer`,
  orderButton: `bg-blue-500 text-white py-2 px-4 rounded w-full text-lg font-medium cursor-pointer`,
  modal: `fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-10 shadow-xl`,
  modalContent: `blue-glassmorphism rounded-3xl shadow-md shadow-secondary border border-base-300 max-w-lg w-full p-6 relative`,
  closeModalButton: `blue-glassmorphism p-2 rounded-full absolute top-4 right-2 mt-2 mr-2`,
  addressInput: `input input-ghost h-[2.2rem] min-h-[2.2rem] p-2 border w-full font-medium placeholder:text-accent/50 text-gray-400 blue-glassmorphism rounded-sm text-accent mb-2`,
  addressHeader: `mt-1 mb-4 text-lg`,
  confirmOrderButton: `bg-blue-500 text-white py-2 px-4 rounded w-full cursor-pointer`,
};

const DesignCard = ({ designItem, title }) => {
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    stateProvinceRegion: "",
    postalCode: "",
    country: "",
  });

  const router = useRouter();

  const toggleModal = () => setShowModal(!showModal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleConfirmOrder = () => {
    // Implement order confirmation logic
    router.push("/orders");
  };

  return (
    <div className={style.wrapper}>
      <div className={style.imgContainer}>
        <Image
          src={designItem.image}
          alt={designItem.name}
          layout="fill"
          objectFit="cover"
          className={style.designImg}
        />
      </div>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.infoLeft}>
            <div className={style.collectionName}>{title}</div>
            <div className={style.likes}>
              <HeartIcon className={style.likeIcon} />
              {designItem.likes}
            </div>
            <div className={style.assetName}>{designItem.name}</div>
          </div>
        </div>
      </div>
      <div className={style.orderTab}>
        <div className={style.sizeWrapper}>
          <label className={style.sizeLabel}>Size:</label>
          <select className={style.sizeSelect}>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
        <button className={style.orderButton} onClick={toggleModal}>
          Order Now
        </button>
      </div>
      {showModal && (
        <div className={style.modal} onClick={toggleModal}>
          <div
            className={style.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={style.closeModalButton} onClick={toggleModal}>
              X
            </button>
            <div className={style.addressHeader}>
              Fill in Your Shipping Address
            </div>
            <input
              className={style.addressInput}
              placeholder="Full Name"
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
            />
            <input
              className={style.addressInput}
              placeholder="Street Address Line 1"
              name="streetAddress1"
              value={address.streetAddress1}
              onChange={handleChange}
            />
            <input
              className={style.addressInput}
              placeholder="Street Address Line 2"
              name="streetAddress2"
              value={address.streetAddress2}
              onChange={handleChange}
            />
            <input
              className={style.addressInput}
              placeholder="City"
              name="city"
              value={address.city}
              onChange={handleChange}
            />
            <input
              className={style.addressInput}
              placeholder="State/Province/Region"
              name="stateProvinceRegion"
              value={address.stateProvinceRegion}
              onChange={handleChange}
            />
            <input
              className={style.addressInput}
              placeholder="Postal Code"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
            />
            <input
              className={style.addressInput}
              placeholder="Country"
              name="country"
              value={address.country}
              onChange={handleChange}
            />
            <button
              className={style.confirmOrderButton}
              onClick={handleConfirmOrder}
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignCard;
