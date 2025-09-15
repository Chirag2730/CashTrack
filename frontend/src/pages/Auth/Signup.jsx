import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {updateUser} = useContext(UserContext);


  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");

    //Signup API call

    try {

      // Upload image if present
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const reponse= await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profileImageUrl,
      })

      const {token, user}= reponse.data;

      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }

    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }else{
        console.log(error);
        setError("Something went wrong. Please try again")
      }
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl text-black font-semibold">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below!!
        </p>
        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              type="text"
              label="Full Name"
              placeholder="John Doe"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              type="text"
              label="Email Address"
              placeholder="john@gmail.com"
            />
            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                type="password"
                label="Password"
                placeholder="Min. 8 characters"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account? {" "}
            <Link className="text-primary font-medium underline"  to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
