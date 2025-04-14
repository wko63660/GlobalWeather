
// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import {Navigate, Outlet, Route} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Login from '../pages/Login';
function ProtectedRoute(){
    const [cookies, setCookie] = useCookies(["username"]);
    const role = cookies.username;
    if(!role)
        return <Navigate to="/login"/>
    else return <Outlet/>


}
export default ProtectedRoute;