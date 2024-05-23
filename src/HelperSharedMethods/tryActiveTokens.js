import axios from "axios";
import Cookies from "cookie-universal";
import BACKEND_BASEURL from "../backend-baseurl/backend-baseurl";
async function tryActiveTokens() {
  const cookies = Cookies();
  const backend = BACKEND_BASEURL;

  try {
    await axios.post(`${backend}api/Account/tokens`, null
    // , {
    //   withCredentials: true,
    // }
  );
    return true;
  } catch (e) {
    if (e.response.status == 401) {
      cookies.removeAll();
      
      return false;
    }
  }
}
export default tryActiveTokens;
