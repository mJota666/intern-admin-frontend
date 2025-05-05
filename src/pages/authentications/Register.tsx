import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../../api/client";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const role = "admin";
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await client.post("/auth/register", {
        email,
        name,
        password,
        role,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="w-[100vw] h-[100vh] flex flex-row items-center justify-center ">
      <div className="hidden sm:flex h-full w-1/2 rounded-tr-4xl rounded-br-4xl   shadow-2xl">
        <img
          src="/register-background.png"
          alt="Register Page Background Image"
          className="w-full h-full object-cover rounded-tr-4xl rounded-br-4xl "
        />
      </div>
      <div className="h-full w-full sm:w-1/2 flex flex-col justify-center items-center ">
        <div className="w-4/6 h-2/3  flex flex-col justify-center items-center ">
          {/* Header Field */}
          <h1 className="w-full h-1/3 flex text-[40px] justify-center items-center font-bold font-playwrite ">
            Admin Register
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
              <div className="w-full h-2/3 flex flex-col gap-4 ">
                <InputBox
                  id="email"
                  type="email"
                  value={email}
                  label="Enter email"
                  onChange={(e: any) => setEmail(e.target.value)}
                />
                <InputBox
                  id="name"
                  type="text"
                  value={name}
                  label="Enter name"
                  onChange={(e: any) => setName(e.target.value)}
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
                <Button content="Register" />
                <p className="mt-4 text-center ">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#C86C24] hover:underline font-semibold"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
