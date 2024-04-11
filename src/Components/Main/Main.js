function Main(props){

    return (


    <main id={"mainBody"}className='d-flex justify-content-center align-items-center flex-column px-lg-0 px-3'style={{height:"90vh"}}>
     {props.children}
     </main>   
    )
}
export default Main