import './home.css'
import UserTarget from '../../components/UserTarget';
import useGetSuggestedUsersQuery from '../../hooks/useGetSuggestedUsersQuery';
import useGetPostsQuery from '../../hooks/useGetPostsQuery';
import PostTarget from '../../components/PostTarget';
import { useQuery } from 'react-query'
import CreatePost from '../../components/CreatePost';
export default function Home() {

    var suggestedUsers = null;

    const {data} = useGetSuggestedUsersQuery();

    if(data?.data && data.data.length > 0){
        suggestedUsers = data.data.map((user)=>
            <UserTarget key={user.username} data={user}/>
        );
    }else{
        suggestedUsers = <p className='mx-3 fst-italic'>We can't find recomended users</p>
    }

    const {data:posts} = useGetPostsQuery();
    
    var myposts = null;
    if(posts?.data && posts.data.length > 0){
        myposts = posts.data.map((post)=>
            <PostTarget key={post.id+post.data.user_repeat} data={post}/>
        );
    }else{
        myposts = <p className='mx-3 fst-italic'>We can't find posts</p>
    }
    
    let user = null;
    const {data:userAuth} = useQuery("get_user_auth") 
    if(userAuth){
        user = <UserTarget data={{
            name: userAuth.data.first_name,
            username: userAuth.data.username,
            photo: userAuth.data.avatar
        }} pfollow={"logout"}/>
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
                    <div className='feedSection'>
                        <CreatePost/>
                    </div>
                    {myposts}
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 rightSection">
                    <div className="userSection">
                        <div className='title px-3 pt-3'>
                            <p>Recomended users</p>
                        </div>
                        {suggestedUsers}
                    </div>
                </div>
            </div>
        </div>
    )
}