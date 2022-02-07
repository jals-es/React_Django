
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { ChatBubbleOutline, Repeat, FavoriteBorder, Share } from '@material-ui/icons';
import './home.css'
import useCreatePost from '../../hooks/useCreatePost';
import UserTarget from '../../components/UserTarget';
import useGetSuggestedUsersQuery from '../../hooks/useGetSuggestedUsersQuery';
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

    console.log(data)

    if(data?.data && data.data.length > 0){
        suggestedUsers = data.data.map((user)=>
            <UserTarget key={user.username} data={user}/>
        );
    }else{
        suggestedUsers = <p className='mx-3 fst-italic'>We can't find recomended users</p>
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
    
                    {/* {data.map(post=>{ */}
    
                    <div className='feedSection post'>
                        <div className="title">
                            <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png" alt="tweet"/>
                            <div className="info">
                            <h4 className="name">Lalala</h4>
                            <p className="twitter-handle">@lalala</p>
                            </div>
                        </div>
                        <div className="tweet">
                            <p>Please be nice to people in service jobs. They work long hours and are treated like garbage by people, like the person
                            who tried using the "barista" title in a demeaning way.</p>
                        </div>
                        <div className="time-and-date">
                            <p>3:30 PM &middot; June 29, 2021 <span>Twitter for iPhone</span></p>
                        </div>
                        <div className="bottom-section">
                            <span className='commentIcon'>
                                <ChatBubbleOutline className='mr-2'/>
                                1
                            </span>
                            <span className='repeatIcon'>
                                <Repeat className='mr-2'/>
                                123
                            </span>
                            <span className='likeIcon'>
                                <FavoriteBorder className='mr-2'/>
                                333
                            </span>
                            <span className='shareIcon'>
                                <Share/>
                            </span>
                        </div>
                    </div>
                    {/* })} */}
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