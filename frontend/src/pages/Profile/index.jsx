import { useParams } from 'react-router-dom'
import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import UserTarget from '../../components/UserTarget';
import SuggestedUsers from '../../components/SuggestedUsers';
import PostTarget from '../../components/PostTarget';
import useGetUserPostsQuery from '../../hooks/useGetUserPostsQuery';
import './profile.css'
import Menu from '../../components/Menu';
export default function Profile(){
    const { username } = useParams()
    const queryClient = useQueryClient()

    const { data } = useGetUserPostsQuery({user: username})

    if(username !== data?.data?.username){
        queryClient.invalidateQueries('get_user_posts')
    }

    const {data:userAuth} = useQuery("get_user_auth") 

    let user = null;
    if(userAuth){
        user = <UserTarget data={{
            name: userAuth.data.first_name,
            username: userAuth.data.username,
            photo: userAuth.data.avatar
        }} pfollow={"logout"}/>
    }

    let posts = null;
    if(data?.data?.user_posts?.length > 0){
        posts = data.data.user_posts.map((post)=>
            <PostTarget key={post.id+post.data.user_repeat} data={post}/>
        )
    }else{
        posts = <p className='noReplys'>The user don't have posts</p>
    }

    async function follow(){
        console.log("follow");
    }

    async function unfollow(){
        console.log("unfollow");
    }

    if(data?.data?.photo.length === 0){
        data.data.photo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMx1itTXTXLB8p4ALTTL8mUPa9TFN_m9h5VQ&usqp=CAU"
    }

    let followButton, userInfoClass = null;
    if(data?.data?.user_follow){
        followButton = <button onClick={follow} className='followButton btn btn-outline-danger my-auto col-4'>Unfollow</button>;
        userInfoClass = "col-4"
    }else{
        if(data?.data?.user_follow === false){
            followButton = <button onClick={unfollow} className='followButton btn btn-primary my-auto col-4'>Follow</button>;
            userInfoClass = "col-4"
        }else{
            followButton = null;
            userInfoClass = ""
        }
    }

    setTimeout(()=>{
        if(!data?.data) {
            const Err404 = React.lazy(() => import("../Err404"));
            return (
                <Err404/>
            )
        }
    }, 1000)

    return (
        <div id="user-feed h-100">
            <div id='header' className="row row1">
                <div className="col-12">
                    {user}
                </div>
            </div>
            <div className="row row2">
                <div className="col-lg-3 col-md-6 col-sm-12 ">
                    <Menu/>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className='feedSection profileTarget'>
                        <div className='userPhoto' style={{backgroundImage: `url(${data?.data?.photo})`}}></div>
                        <div className='row justify-content-between userInfo mx-3'>
                            <div className={userInfoClass}>
                                <label className='name'>{data?.data?.name}</label>
                                <label className='username'>@{data?.data?.username}</label>
                            </div>
                            {followButton}
                        </div>
                        <label className='descr'>{data?.data?.descr}</label>
                    </div>
                    {posts}
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 rightSection">
                    <div className="userSection">
                        <SuggestedUsers/>
                    </div>
                </div>
            </div>
        </div>
    )
}