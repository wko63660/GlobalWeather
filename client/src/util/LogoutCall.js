// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

const Logout = () => {
    return fetch("http://34.204.136.172/api/logout", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
}

export default Logout;