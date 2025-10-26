"use client";

import Image from "next/image";

const ExploreButton = () => {
  return (
    <button
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={() => console.log("CLICKED")}
    >
      <a href="#events">
        Explore Events
        <Image
          src="/icons/arrow-down.svg"
          alt="Arrow Down"
          width={24}
          height={24}
          className="inline-block ml-2"
        />
      </a>
    </button>
  );
};

export default ExploreButton;
