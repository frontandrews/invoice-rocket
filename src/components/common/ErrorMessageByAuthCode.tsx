export default function ErrorMessageByAuthCode({ code }: { code: string }) {

  if(!code) return null;
  
  let msg = "";
  if (code === "auth/email-already-in-use") {
    msg = "Email already in use";
  } else if (code === "auth/invalid-email") {
    msg = "Invalid email";
  } else if (code === "auth/weak-password") {
    msg = "Weak password";
  } else {
    msg = "Invalid login credentials";
  }

  return <div className="text-red-500 text-sm">{msg}</div>;
}
