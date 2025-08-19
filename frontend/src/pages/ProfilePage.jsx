import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { CameraIcon, MapPinIcon, ShipWheelIcon, HomeIcon } from "lucide-react";

const Field = ({ label, value }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text font-medium text-base-content/90">{label}</span>
    </label>
    <input
      type="text"
      value={value || "—"}
      readOnly
      className="input input-bordered w-full bg-base-200 text-base-content"
    />
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const fullName = authUser?.fullName || "";
  const bio = authUser?.bio || "";
  const nativeLanguage = authUser?.nativeLanguage || "";
  const learningLanguage = authUser?.learningLanguage || "";
  const location = authUser?.location || "";
  const profilePic = authUser?.profilePic || "";

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-3xl font-extrabold text-center mb-2">Your Profile</h1>
          <p className="text-center text-base-content/70 mb-6">View your details or update them anytime.</p>

          <div className="space-y-6">
            {/* PROFILE PIC */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
            </div>

            {/* FULL NAME */}
            <Field label="Full Name" value={fullName} />

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/90">Bio</span>
              </label>
              <textarea
                value={bio}
                readOnly
                className="textarea textarea-bordered h-24 bg-base-200 text-base-content resize-none"
                placeholder="No bio yet"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Native Language" value={nativeLanguage} />
              <Field label="Learning Language" value={learningLanguage} />
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/90">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  value={location}
                  readOnly
                  className="input input-bordered w-full pl-10 bg-base-200 text-base-content"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                className="btn btn-primary w-full"
                type="button"
                onClick={() => navigate("/profile/edit")}
                title="Edit your profile"
              >
                <ShipWheelIcon className="size-5 mr-2" />
                Edit Profile
              </button>
              <button
                className="btn btn-ghost w-full"
                type="button"
                onClick={() => navigate("/")}
                title="Go to Home"
              >
                <HomeIcon className="size-5 mr-2" />
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;