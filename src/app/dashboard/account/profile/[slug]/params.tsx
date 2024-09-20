import {  membersData } from '@/utils/api';
import UserProfile from './page';

export async function generateStaticParams() {
    try {
        // Fetch the token securely
        const token: any = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

        // Fetch member data
        const response: any = await membersData(token);
        const members = response.users;

        // Generate static paths based on the fetched member data
        const paths = members.map((member: any) => ({
            params: { slug: member.id.toString() }, // Adjust this based on your member object structure
        }));

        return paths; // Return the array of paths directly
    } catch (error) {
        console.error('Error generating static parameters:', error);
        return []; // Return an empty array on error
    }
}

export default function Page({ params }: any) {
    return <UserProfile params={params.id} />;
}