import { Button } from '@mantine/core';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '../../firebase/firebase.ts';

export function GoogleButton() {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <Button
      leftSection={<FcGoogle size={20} />}
      className="text-[#383838] bg-transparent hover:bg-green-800 border border-[#D9D9D9] w-[180px] mt-4"
      onClick={handleGoogleLogin}
    >
      Google
    </Button>
  );
}
