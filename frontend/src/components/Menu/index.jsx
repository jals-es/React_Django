import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { Home, Person } from "@material-ui/icons"
import './menu.css'
export default function Menu(){
    
    const navigate = useNavigate()

    function redirect(e){
        let el = e.target
        navigate(el.getAttribute('redirect'))
    }

    const {data:userAuth} = useQuery("get_user_auth") 
    
    return (
        <div id="menu" className="py-3">
            <div onClick={redirect} className="my-1 home" redirect="/"><Home/> Home</div>
            <div onClick={redirect} className="my-1 profile" redirect={`/${userAuth.data.username}`}><Person/> Profile</div>
        </div>
    )
}