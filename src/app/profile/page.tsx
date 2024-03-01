import Image from "next/image";
import React from "react";

const Profile = () => {
  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold">Profile</h1>
      <div className="mt-4 flex flex-col items-center">
        <div className="w-24 mask mask-squircle">
          <Image
            alt="Profile Photo"
            className="w-24 mask mask-squircle mt-4"
            width={96}
            height={96}
            src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          />
        </div>
        <h2 className="mt-4 text-xl font-bold">John Doe</h2>
      </div>

      <div className="mt-4 flex flex-col items-center w-full px-8 gap-4">
        <label className="input input-bordered flex items-center gap-2 w-full">
          Email
          <input type="text" className="grow" placeholder="daisy@site.com" />
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full">
          Name
          <input type="text" className="grow" placeholder="John Doe" />
        </label>

        <button className="btn btn-primary w-full mx-12">Save</button>
      </div>
    </main>
  );
};

export default Profile;
