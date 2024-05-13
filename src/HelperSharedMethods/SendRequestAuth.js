import axios from "axios";
import tryActiveTokens from "./tryActiveTokens";

async function sendRequestAuth(url, method, body = null) {
  let configs =
    method?.toLowerCase() === "get"
      ? {
          method: method,
          url: url,
          withCredentials: true,
        }
      : {
          method: method,
          url: url,
          data: body,
          withCredentials: true,
          
        };
  try {
    let result = await axios(configs);
    return result;
  } catch (e) {
    if (e.response?.status === 401) {
      const res = await tryActiveTokens();
      if (res) 
        return await sendRequestAuth(url, method, body);
      else {
        return false;
      }
    }
    return e.response;
  }
}
export default sendRequestAuth;
