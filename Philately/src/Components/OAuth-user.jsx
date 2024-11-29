import { Button } from 'flowbite-react';
import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            console.log(resultsFromGoogle);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoURL: resultsFromGoogle.user.photoURL
                })
            });

            // Check if the response is OK (status 200-299)
            if (res.ok) {
                const data = await res.json(); // Parse JSON response
                console.log(data); // Log success message
                navigate('/user-signin'); // Redirect to home on success
            } else {
                const errorData = await res.json(); // Get error details
                console.error("Error:", errorData); // Log error details
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error); // Log any sign-in errors
        }
    };

    return (
        <Button className="w-full text-white gap-1 rounded-lg font-semibold hover:bg-green-700 transition duration-300" outline type='button' onClick={handleGoogleClick}>
            <AiFillGoogleCircle/>
            Continue with Google
        </Button>
    );
}
