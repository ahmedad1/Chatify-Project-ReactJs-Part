import Cookies from "cookie-universal"
function deleteAllAuthCookies(cookiesObj){
  
    cookiesObj.remove("id")
    cookiesObj.remove("firstName")
    cookiesObj.remove("lastName")
    cookiesObj.remove("userName")
    cookiesObj.remove("email")

}
function checkAllCookies(){
    const cookies=Cookies()
    if( cookies.get("id")
    &&cookies.get("firstName")
    &&cookies.get("lastName")
    &&cookies.get("userName")
    &&cookies.get("email")
    )return true;
    
    deleteAllAuthCookies(cookies)
    return false
   
   
   }
   export default checkAllCookies