import { upcomingEvenrs } from '@/utils/api';
import Attendance from './page';


export async function generateStaticParams() {
    try {
        const token:any = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
        const response = await upcomingEvenrs(token);
        // Generate static paths based on the fetched member data
        const paths:any = response?.map((member: any) => ({
            slug: member.id, 
            params: { slug: member.id.toString() }, // Adjust this based on your member object structure

        }));

        return paths;
    } catch (error) {
        console.error('Error generating static parameters:', error);
        return [];
    }
}

export default function Page({ params }: any) {
    return <Attendance id={params.id} />;
}