// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";

// export default function AuthForm() {

//     const [isLogin, setIsLogin] = useState(false);
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();
    
//     const navigate=useNavigate()
//     const onSubmit = async(data) => {
//       try {
//         let userCredential;
//         if (isLogin) {
//           const userCredential=async()=> await signInWithEmailAndPassword(
//             auth,
//             data.email,
//             data.password
//           )
//           console.log("User logged in ",userCredential.user)
          
//         }
//         else{
//           const userCredential=async()=> await createUserWithEmailAndPassword(
//             auth,
//             data.email,
//             data.password,
//           )
//           console.log("User Signed up :",userCredential.user);        
//         }
        
//         console.log(isLogin ? "Login Data:" : "Signup Data:", data);
//         navigate("/app")
//       } 
        
//         catch(error){
//           console.error("Auth error:",errors.message)
//           alert(error.message)
//         }
        
      
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FEFFFF] px-4 py-8">
//       <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 w-full max-w-6xl">
//         {/* Robot Illustration */}
//         {/* <div className="flex-1 flex justify-center mb-6 lg:mb-0">
//           <img 
//             className="sm:w-[300px] md:w-[360px] lg:w-[420px] object-contain w-auto"
//             src="https://t4.ftcdn.net/jpg/08/26/34/17/360_F_826341701_TZG4TwerhJbl1x3pth3J7Dpn8EmKaLxW.jpg" 
//             alt="Buddy"
//           />
//         </div> */}

       
//         <div className="flex-1  bg-[#FEFFFF] rounded-2xl p-6 sm:p-8 w-full max-w-md 
//         backdrop-blur-lg shadow-[5px_5px_10px_#babace,_-5px_-5px_10px_#ffffff]">
//           <div className="flex flex-row items-center">
           
//             <img src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png" 
//             alt="Logo" 
//             className="h-12 mb-3  " />
//             <h2 className="bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] bg-clip-text text-transparent text-2xl mb-4 sm:text-[2rem] md:text-[2.1rem] leading-tight font-bold lg:text-[2.2rem] ml-2">
//               Welcome to BotRix 
            
//             </h2>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
//             {!isLogin && (
//               <div>
//                 <input
//                   type="text"
//                   placeholder="Enter your name"
//                   className="w-full rounded-lg px-4 py-3  bg-[#EDF0F3] text-gray-800 focus:outline-none"
//                   {...register("name", { required: !isLogin })}
//                 />
//                 {errors.name && (
//                   <p className="text-red-400 text-sm mt-1">Name is required</p>
//                 )}
//               </div>
//             )}
//             <div>
//               {!isLogin && (
//                 <input
//                   type="text"
//                   placeholder="Enter your username"
//                   className="w-full rounded-lg px-4 py-3 bg-[#EDF0F3] text-gray-800 focus:outline-none"
//                   {...register("username", { required: !isLogin })}
//                 />

//               )}
                
//                 {errors.username && (
//                   <p className="text-red-400 text-sm mt-1">Name is required</p>
//                 )}
//               </div>

//             <div>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full rounded-lg px-4 py-3 bg-[#EDF0F3] text-gray-800 focus:outline-none"
//                 {...register("email", { required: true })}
//               />
//               {errors.email && (
//                 <p className="text-red-400 text-sm mt-1">Email is required</p>
//               )}
//             </div>

//             <div>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 className="w-full rounded-lg px-4 py-3 bg-[#EDF0F3] text-gray-800 cus:outline-none"
//                 {...register("password", { required: true })}
//               />
//               {errors.password && (
//                 <p className="text-red-400 text-sm mt-1">Password is required</p>
//               )}
//             </div>

//             {!isLogin && (
//               <div className="flex items-center gap-2 text-white text-sm">
//                 <input type="checkbox" className="accent-[#4da6ff]" required />
//                 <p className="text-gray-500">
//                   I agree to Terms of Conditions and {" "}
//                   <span className="text-[#4da6ff]">Privacy of Policy</span>
//                 </p>
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full bg-[#4da6ff] hover:bg-[#3385ff] text-white py-3 rounded-lg font-semibold mt-4"
//             >
//               {isLogin ? "Sign In" : "Sign Up"}
//             </button>
//           </form>

//           {/* Switch between Login & Signup */}
//           <p className="text-gray-500 gap-6 mt-4">
//             {isLogin ? "Don’t have an account?" : "Already have an account?"} {" "}
//             <button
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-[#4da6ff] hover:underline"
//             >
//               {isLogin ? "Sign Up" : "Sign In"}
//             </button>
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      let userCredential;

      if (isLogin) {
        // Login user
        userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        console.log("User logged in:", userCredential.user);
      } else {
        // 🔹 Sign up user
        userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        console.log("User signed up:", userCredential.user);
      }

      console.log(isLogin ? "Login Data:" : "Signup Data:", data);

      //  Navigate only if authentication succeeds
      navigate("/app");
    } catch (error) {
      console.error("Auth error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFFFF] px-4 py-8">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 w-full max-w-6xl">
        <div className="flex-1 bg-[#FEFFFF] rounded-2xl p-6 sm:p-8 w-full max-w-md backdrop-blur-lg shadow-[5px_5px_10px_#babace,_-5px_-5px_10px_#ffffff]">
          <div className="flex flex-row items-center">
            <img
              src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png"
              alt="Logo"
              className="h-12 mb-3"
            />
            <h2 className="bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] bg-clip-text text-transparent text-2xl mb-4 sm:text-[2rem] md:text-[2.1rem] leading-tight font-bold lg:text-[2.2rem] ml-2">
              Welcome to BotRix
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {!isLogin && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full rounded-lg px-4 py-3 bg-[#EDF0F3] text-gray-800 focus:outline-none"
                    {...register("name", { required: !isLogin })}
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">Name is required</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full rounded-lg px-4 py-3 bg-[#EDF0F3] text-gray-800 focus:outline-none"
                    {...register("username", { required: !isLogin })}
                  />
                  {errors.username && <p className="text-red-400 text-sm mt-1">Username is required</p>}
                </div>
              </>
            )}

            <div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg px-4 py-3 bg-[#EDF0F3] text-gray-800 focus:outline-none"
                {...register("email", { required: true })}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">Email is required</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg px-4 py-3 bg-[#EDF0F3] text-gray-800 focus:outline-none"
                {...register("password", { required: true })}
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">Password is required</p>}
            </div>

            {!isLogin && (
              <div className="flex items-center gap-2 text-white text-sm">
                <input type="checkbox" className="accent-[#4da6ff]" required />
                <p className="text-gray-500">
                  I agree to Terms of Conditions and{" "}
                  <span className="text-[#4da6ff]">Privacy of Policy</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#4da6ff] hover:bg-[#3385ff] text-white py-3 rounded-lg font-semibold mt-4"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="text-gray-500 gap-6 mt-4">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#4da6ff] hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

