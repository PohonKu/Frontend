const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class Login{
    async getProfile(){
        const res = await fetch(`${BASE_URL}/api/v1/auth/me`,{
            cache: "no-store"
        })
        if (!res.ok) {
            throw new Error("Failed to fetch profile");
        }

        return res.json();


    }
}

export const getProfile = new Login();