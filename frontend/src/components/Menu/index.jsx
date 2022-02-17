import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { Home, Person } from "@material-ui/icons"
import './menu.css'
export default function Menu(){
    
    const navigate = useNavigate()

    function redirect(e){
        let el = e.target
        let locate = window.location.pathname
        navigate(el.getAttribute('redirect'))
        if(el.getAttribute('redirect') === `/${userAuth.data.username}`){
            if(locate !== "/"){
                window.location.reload()
            }
        }
    }

    const {data:userAuth} = useQuery("get_user_auth") 
    
    return (
        <div id="menu" className="py-3">
            <div onClick={redirect} className="my-1 home" redirect="/"><Home/> Home</div>
            <div onClick={redirect} className="my-1 profile" redirect={`/${userAuth.data.username}`}><Person/> Profile</div>
        </div>
    )
}