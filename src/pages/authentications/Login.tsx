/** @jsxImportSource @emotion/react */

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../../api/client";
import { AuthContext } from "../../context/AuthContext";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await client.post("/auth/login", { email, password });
      login(data.accessToken);
      navigate("/");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-row items-center justify-center ">
      <div className="h-full w-full sm:w-1/2 flex flex-col justify-center items-center ">
        <div className="w-2/3 h-2/3  flex flex-col justify-center items-center ">
          {/* Header Field */}
          <h1 className="w-full h-1/3 flex text-[40px] justify-center items-center font-bold font-playwrite ">
            Admin Login 432s
          </h1>
          <div className="w-full h-3/4 ">
            <form
              onSubmit={handleSubmit}
              className="w-full h-full flex flex-col justify-start items-center gap-8"
            >
              {/* Error Filed */}
              {error && (
                <div className="mb-4 text-red-600 text-center">{error}</div>
              )}
              {/* Input filed */}
              <div className="w-full h-3/7 flex flex-col gap-4 ">
                <InputBox
                  id="email"
                  type="email"
                  value={email}
                  label="Enter email"
                  onChange={(e: any) => setEmail(e.target.value)}
                />
                <InputBox
                  id="password"
                  type="password"
                  value={password}
                  label="Enter password"
                  onChange={(e: any) => setPassword(e.target.value)}
                />
              </div>
              {/* Submit button */}
              <div className="w-full">
                <Button content="Login" />
                <p className="mt-4 text-center ">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-[#C86C24] hover:underline font-semibold"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex  h-full w-1/2 rounded-tl-4xl rounded-bl-4xl  shadow-2xl">
        <img
          src="/login-background.png"
          alt="Login Page Background Image"
          className="w-full h-full object-cover rounded-tl-4xl rounded-bl-4xl "
        />
      </div>
    </div>
  );
}
