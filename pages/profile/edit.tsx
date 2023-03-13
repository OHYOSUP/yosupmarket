import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useMutation from "@libs/client/useMutation";

interface EditProfileFrom {
  email?: string;
  phone?: string;
  name?: string;
  formError?: string;
}
interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  // setValue = 값을 설정해주는 함수
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileFrom>();

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
  }, [user, setValue]);

  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);

  const onValid = ({ email, phone, name }: EditProfileFrom) => {
    // 유저가 여러번 버튼을 누를때 발생하는 충돌을 방지
    if (loading) return;
    // email, phone 모두 입력하지 않았을 때 발생시키는 에러 생성
    if (email === "" && phone === "" && name === "") {
      return setError("formError", {
        message: "이메일 또는 전화번호를 입력하세요",
      });
    }
    editProfile({
      email,
      phone,
      name
    });
  };

  useEffect(() => {
    if (data && !data.ok && data.error) {
      return setError("formError", { message: data.error });
    }
  }, [data, setError]);

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            프로필 사진 변경
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required={false}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          required={false}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.formError ? (
          <span className="my-2 text-red-500 font-medium block text-center">
            {errors.formError.message}
          </span>
        ) : null}
        <Button text={loading ? "loading" : "프로필 수정"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
