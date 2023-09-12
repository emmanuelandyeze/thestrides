import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/clientApp';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';

type UserPageProps = {};

const UserPage: React.FC<UserPageProps> = () => {
	const router = useRouter();
	const { userId } = router.query;
	const [user, setUser] = useState();

	const getUser = async (userId: string) => {
		try {
			const userDocRef = doc(firestore, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            const userDet = userDoc.data()
            setUser(userDoc.data() as any);
            
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getUser(userId as string);
    }, [userId]);
    
    console.log(user);

	return (
		<div style={{ paddingTop: '10rem' }}>
			{/* {user?.displayName} */}
		</div>
	);
};
export default UserPage;
