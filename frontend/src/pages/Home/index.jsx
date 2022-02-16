import './home.css'
import UserTarget from '../../components/UserTarget';
import useGetPostsQuery from '../../hooks/useGetPostsQuery';
import PostTarget from '../../components/PostTarget';
import { useQuery, useQueryClient } from 'react-query'
import CreatePost from '../../components/CreatePost';
import SuggestedUsers from '../../components/SuggestedUsers';
import Menu from '../../components/Menu';
export default function Home() {


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

    const queryClient = useQueryClient()
    setInterval(async function () {
        await queryClient.invalidateQueries('get_post')
        await queryClient.invalidateQueries('get_all_posts')
    }, 30000);

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
                    <div className='feedSection'>
                        <CreatePost/>
                    </div>
                    {myposts}
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