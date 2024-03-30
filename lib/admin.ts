import { auth } from "@clerk/nextjs"


const allowedIds = [
    "user_2dm5zPu1NvcEzAr79afqv8E05Rx"
]
export const isAdmin = async () => {
    const { userId } = auth();
    if (!userId) return false;

    return allowedIds.indexOf(userId) !== -1;



}