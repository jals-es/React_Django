
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import './home.css'
import useCreatePost from '../../hooks/useCreatePost';
import UserTarget from '../../components/UserTarget';
import useGetSuggestedUsersQuery from '../../hooks/useGetSuggestedUsersQuery';
import useGetPostsQuery from '../../hooks/useGetPostsQuery';
import PostTarget from '../../components/PostTarget';
export default function Home() {

    useEffect(() => {
        register('post')
    });

    const formSchema = Yup.object().shape({
        post: Yup.string()
            .required("* Required field")
            .max(280, "* Message to long")
    });

    const { register, handleSubmit, formState: { errors }, setValue, setError} = useForm({
        mode: "onSubmit",
        resolver: yupResolver(formSchema)
    });

    function ctChars(e) { 
        let el = e.target,
            to = setTimeout(function() {
                let len = el.textContent.length,
                    ct = document.getElementById("tweetcounter"),
                    btn = document.getElementById("postbutton"),
                    warnAt = 20,
                    max = ct.getAttribute("data-limit");

                ct.innerHTML = max - len;
                ct.className = len > max - warnAt ? "warn" : "";
                btn.disabled = len === 0 || len > max ? true : false;
                el.value = el.textContent;
                clearTimeout(to);
            }, 1);
    }

    const createPostMutation = useCreatePost()

    async function submitPost(data){
        console.log(data)
        try {
            await createPostMutation.mutateAsync(data)
            document.getElementById("tweet").textContent = "";
        } catch (error) {
            if(error.response.data){
                console.log(error.response.data)
                document.getElementById("tweet").textContent = "";
                setError("message", {message: "Error al crear el post"})
            }
        }
    }

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

    console.log(posts)
    
    var myposts = null;
    if(posts?.data && posts.data.length > 0){
        myposts = posts.data.map((post)=>
            <PostTarget key={post.id} data={post}/>
        );
    }else{
        myposts = <p className='mx-3 fst-italic'>We can't find posts</p>
    }

    
 
    return (
        <div id="user-feed h-100">
            <div id='header' className="row row1">
                <div className="col-12"></div>
            </div>
            <div className="row row2">
                <div className="col-lg-3 col-md-6 col-sm-12 ">

                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className='feedSection'>
                        <form onSubmit={handleSubmit(submitPost)}>
                            <div className='textarea' id="tweet" onKeyDown={ctChars} contentEditable="true" placeholder="What’s happening?" onInput={(e) => {setValue('post', e.currentTarget.textContent, { shouldValidate: true });}}/>
                            <div className="bottom">
                                <span className="text-danger">{errors.post?.message}</span>
                                <span id='tweetcounter' data-limit="280" >280</span>
                                <button id='postbutton' type="submit" tabIndex="0" disabled>
                                    <span tabIndex="-1">Post</span>
                                </button>
                            </div>
                        </form>
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