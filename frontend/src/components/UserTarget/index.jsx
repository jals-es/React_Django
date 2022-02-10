import './userTarget.css'
import useFollowMutation from '../../hooks/useFollowMutation'
import { httpClient as ApiHttpService } from '../../core/api.service';
// import { useNavigate } from "react-router-dom";
export default function UserTarget({data, pfollow = true}){

    if(data.photo.length === 0){
        data.photo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMx1itTXTXLB8p4ALTTL8mUPa9TFN_m9h5VQ&usqp=CAU"
    }

    const followMutation = useFollowMutation();

    async function follow (){
        try {
            await followMutation.mutateAsync(data.username)
        } catch (error) {
            if(error.response.data){
                console.log(error.response.data)
            }
        }
    }

    function logout (){
        localStorage.removeItem('token')
        ApiHttpService.defaults.headers.common['Authorization'] = null;
        window.location.reload();
    }

    let print_follow = null;
    if(pfollow === true){
        print_follow = <button onClick={follow} className='followButton btn btn-primary my-auto'>Follow</button>
    }else if(pfollow === "logout"){
        print_follow = <button onClick={logout} className='followButton btn btn-outline-danger my-auto'>Logout</button>
    }

    return (
        <div className="userTarget py-3 px-3">
            <div className='userPhoto' style={{backgroundImage: `url(${data.photo})`}}></div>
            <div className='userInfo mx-3'>
                <label className='name'>{data.name}</label>
                <label className='username'>@{data.username}</label>
            </div>
            {print_follow}
        </div>
    )
}