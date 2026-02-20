const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class Order {
    async orderRes(speciesId: string){
        const token = localStorage.getItem('access_token');
        const orderRes = await fetch(`${BASE_URL}/api/v1/orders`,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                speciesId,
                nameOnTag: 'John Doe',
            })
        })

        return orderRes.json();

    }
}