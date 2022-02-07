import './userTarget.css'
import useFollowMutation from '../../hooks/useFollowMutation'

export default function UserTarget({data}){

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

    return (
        <div className="userTarget py-3 px-3">
            <div className='userPhoto' style={{backgroundImage: `url(${data.photo})`}}></div>
            <div className='userInfo mx-3'>
                <label className='name'>{data.name}</label>
                <label className='username'>@{data.username}</label>
            </div>
            <button onClick={follow} className='followButton btn btn-primary my-auto'>Follow</button>
        </div>
    )
}