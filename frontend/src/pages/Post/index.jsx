import { useParams } from 'react-router-dom'
import useGetPostQuery from '../../hooks/useGetPostQuery'
import React from 'react'
import { useQuery } from 'react-query'
import UserTarget from '../../components/UserTarget';
import SuggestedUsers from '../../components/SuggestedUsers';
import PostTarget from '../../components/PostTarget';
import './post.css'
export default function Post(){
    const { id_post } = useParams()

    const { data } = useGetPostQuery({id_post: id_post})

    console.log(data?.data);

    const {data:userAuth} = useQuery("get_user_auth") 

    if(!data?.data) {
        const Err404 = React.lazy(() => import("../Err404"));
        return (
            <Err404/>
        )
    }

    let post = data.data

    let user = null;
    if(userAuth){
        user = <UserTarget data={{
            name: userAuth.data.first_name,
            username: userAuth.data.username,
            photo: userAuth.data.avatar
        }} pfollow={"logout"}/>
    }
    
    let replys = null;
    if(post.replys.length > 0){
        replys = post.replys.map((post)=>
            <PostTarget key={post.id} data={post}/>
        )
    }else{
        replys = <p>No hay respuestas</p>
    }

    return (
        <div id="user-feed h-100">
            <div id='header' className="row row1">
                <div className="col-12">
                    {user}
                </div>
            </div>
            <div className="row row2">
                <div className="col-lg-3 col-md-6 col-sm-12 ">

                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className='feedSection fpost'>
                        
                    </div>
                    {replys}
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