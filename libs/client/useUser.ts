import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
//유저의 profile을 담아주는 custom hook


// 기본 JS상식 : arrow function에서 {} 로 감싸면 return을 해줘야 return해준다. 없으면 return값이 없음
// 만약 {} 로 감싸지 않으면 () 안의 값이 자동으로 return됨. 헷갈리지 말자

export default function useUser() {
  const { data, error } = useSWR("/api/users/me");

  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
       router.replace("/enter")
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}
