import LoginForm from "./components/home/loginForm";

export async function generateMetadata() {
  return {
    title: "پنل پزشکان دکتر زوشا",
    description: "با آشنایی با تخصص‌های دکتر زوشا، بهترین خدمات پزشکی را دریافت کنید. اطلاعات کامل درباره مهارت‌ها، تجربه‌ها و حوزه‌های درمانی تخصصی. ✅💙",
  };
}

export default function Home() {

  return (
    <>
      <LoginForm />
    </>
  );
}