import Swal from "sweetalert2"

function AlertSessionEnded(navigate,dispatch,signOut){
    Swal.fire({title:"Your session has been ended",icon:"warning"}).then(res=>{
        if(res.isConfirmed||res.isDismissed){
          navigate("/")
          dispatch(signOut())
          
        }
      })
}
export default AlertSessionEnded